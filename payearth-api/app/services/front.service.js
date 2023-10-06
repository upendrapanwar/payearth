const config = require('../config/index');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const { Category, Product, Review, User, Brand, TrendingProduct, TodayDeal, RecentSearchProduct, BannerImage, PopularProduct, Color, ServiceVideo, CryptoConversion } = require("../helpers/db");

module.exports = {
    getReviews,
    getRatingCount,
    getSimilarProducts,
    getPopularBrands,
    getTrendingProducts,
    getPopularProducts,
    getTodayDeals,
    getRecentSearchProducts,
    getBannerImages,
    getCategoriesSearch,
    getCategoriesMenu,
    getProductListing,
    getFilterCategories,
    getBrandsListByProducts,
    getColorsListByProducts,
    getProductById,
    getServiceListing,
    getServiceById,
};

async function getReviews(id) {
    const reviews = await Review.find({ isActive: true, productId: id })
        .select("id review rating productId reviewImages createdAt")
        .sort({ createdAt: 'desc' })
        .populate("userId", "name");

    if (reviews && reviews.length > 0) {
        return result = {
            reviewCount: reviews.length,
            reviews: reviews
        };
    }
    return false;
}

async function getRatingCount(id) {
    try {

        const productId = mongoose.Types.ObjectId(id);

        var condition = {
            "_id": "$productId",
            "5": {
                "$sum": {
                    "$cond": [{ "$eq": ["$rating", 5] }, 1, 0]
                }
            },
            "4": {
                "$sum": {
                    "$cond": [{ "$eq": ["$rating", 4] }, 1, 0]
                }
            },
            "3": {
                "$sum": {
                    "$cond": [{ "$eq": ["$rating", 3] }, 1, 0]
                }
            },
            "2": {
                "$sum": {
                    "$cond": [{ "$eq": ["$rating", 2] }, 1, 0]
                }
            },
            "1": {
                "$sum": {
                    "$cond": [{ "$eq": ["$rating", 1] }, 1, 0]
                }
            }
        };

        var ratingsData = [
            { "$match": { "productId": productId } },
            {
                "$group": condition
            }
        ];

        const ratings = await Review.aggregate(ratingsData);

        if (ratings && ratings.length > 0) {

            return ratings;
        }
        return false;

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getSimilarProducts(id) {

    try {
        const product = await Product.findById(id);

        if (!product) return false;

        const products = await Product.find({ isActive: true, isService: product.isService, category: product.category, _id: { $ne: id } })
            .select("id name price featuredImage avgRating isService videoCount quantity")
            .populate([{
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            }])
            .sort({ createdAt: 'desc' });

        if (products && products.length > 0) {
            return products;
        }
        return false;

    } catch (err) {
        console.log('Error', err);
        return false;
    }

}

async function getPopularBrands() {
    const result = await Brand.find({ isActive: true, isPopular: true })
        .select("brandName logoImage")
        .limit(11)
        .sort({ brandName: 'asc' });
    if (result && result.length > 0) return result;
    return false;
}

async function getTrendingProducts(req) {

    const limit = req.params.limit == 'all' ? '' : parseInt(req.params.limit);
    const result = await TrendingProduct.find({ isActive: true })
        .select("id")
        .populate([{
            path: "productId",
            model: Product,
            select: "id name price featuredImage avgRating isService quantity",
            populate: {
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            }
        }])
        .limit(limit)
        .sort({ createdAt: 'desc' });
    if (result && result.length > 0) return result;
    return false;
}

async function getPopularProducts(req) {
    const limit = req.params.limit == 'all' ? '' : parseInt(req.params.limit);
    const result = await PopularProduct.find({ isActive: true })
        .select("id")
        //.populate("productId", "id name price featuredImage")
        .populate([{
            path: "productId",
            model: Product,
            select: "id name price featuredImage avgRating isService quantity",
            populate: {
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            }
        }])
        .limit(limit)
        .sort({ createdAt: 'desc' });
    if (result && result.length > 0) return result;
    return false;
}

async function getTodayDeals() {
    const result = await TodayDeal.find({ isActive: true })
        .select("id title categoryId bannerImage")
        .sort({ createdAt: 'desc' });
    if (result && result.length > 0) return result;
    return false;
}

async function getRecentSearchProducts(req) {
    const limit = req.params.limit == 'all' ? '' : parseInt(req.params.limit);
    const result = await RecentSearchProduct.find({ isActive: true })
        .select("id")
        //.populate("productId", "id name price featuredImage")
        .populate([{
            path: "productId",
            model: Product,
            select: "id name price featuredImage avgRating isService quantity",
            populate: {
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            }
        }])
        .limit(limit)
        .sort({ createdAt: 'desc' });
    if (result && result.length > 0) return result;
    return false;
}

async function getBannerImages(page) {
    try {
        const banner = await BannerImage.findOne({ isActive: true, page: page })
            .select("id singleImage bannerImages");

        if (banner) {
            return banner;
        }
        return false;
    } catch (err) {
        console.log(err.message)
    }
}

async function getCategoriesSearch(req) {
    const param = req.body;
    var whereCondition = { isActive: true, parent: null };

    if (param.is_service) {
        whereCondition['isService'] = param.is_service;
    } else {
        whereCondition['isService'] = false;
    }

    let sortOption = { categoryName: 'asc' };
    const categories = await Category.find(whereCondition)
        .select("id categoryName")
        .sort(sortOption);

    if (categories && categories.length > 0) {
        return categories;
    }
    return false;
}

async function getCategoriesMenu(req) {
    try {
        const param = req.body;

        var whereCondition = { "isActive": true, "onMainMenu": true, 'parent': null };

        if (param.is_service) {
            whereCondition['isService'] = param.is_service;
        } else {
            whereCondition['isService'] = false;
        }


        var condData = [
            { "$match": whereCondition },
            { "$group": { "_id": "$_id", "name": { "$first": "$categoryName" }, } },
            {

                $graphLookup: {
                    from: "categories",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parent",
                    as: "subCategories",
                    restrictSearchWithMatch: {
                        onMainMenu: true,
                        isActive: true
                    }
                }
            },

            {
                $project: {
                    "_id": 1,
                    "name": 1,
                    "subCategories._id": 1,
                    "subCategories.categoryName": 1,
                }
            },
            {
                $sort: {
                    "name": 1,
                    "subCategories.parent": 1,
                }
            }
        ];

        const result = await Category.aggregate(condData);

        if (result && result.length > 0) {
            return result;
        }
        return false;

    } catch (err) {
        console.log(err.message)
    }
}

//Product or Service
async function getFilterCategories(req) {
    try {
        const id = req.params.id;
        const param = req.body;
        var whereCondition = { isActive: true };

        if (param.is_service) {
            whereCondition['isService'] = param.is_service;
        } else {
            whereCondition['isService'] = false;
        }

        if (id != 'null') {
            whereCondition['parent'] = id;
        } else {
            whereCondition['parent'] = null;
        }

        let sortOption = { categoryName: 'asc' };

        const categories = await Category.find(whereCondition).select("id categoryName").sort(sortOption);

        if (categories && categories.length > 0) {
            return categories;
        }
        return false;
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getProductListing(req) {

    try {
        // console.log('param', param);
        var param = req.body;
        var sortOption = { createdAt: 'desc' }; //default
        var limit = '';
        var skip = '';
        var whereCondition = { isActive: true, isService: false };

        if (param.sorting) {
            sortOption = {};
            let sort_type = param.sorting.sort_type;
            let sort_val = param.sorting.sort_val;

            if (sort_type == 'price') {
                sortOption[sort_type] = sort_val;
            } else
            if (sort_type == 'new') {
                sortOption['createdAt'] = "desc";
            } else
            if (sort_type == 'popular') {
                sortOption['reviewCount'] = "desc";
            }
        }

        if (param.search_value && param.search_value != '') {
            let val = param.search_value.toLowerCase();
            whereCondition['lname'] = { $regex: val, $options: "i" };
        }

        if (param.category_filter && param.category_filter.length > 0) {
            whereCondition['category'] = { $in: param.category_filter };
        }

        if (param.sub_category_filter && param.sub_category_filter.length > 0) {
            whereCondition['sub_category'] = { $in: param.sub_category_filter };
        }

        if (param.brand_filter && param.brand_filter.length > 0) {
            whereCondition['brand'] = { $in: param.brand_filter };
        }

        if (param.price_filter) {
            let min = param.price_filter.min_val;
            let max = param.price_filter.max_val;
            if (min !== "" && max !== "") {
                whereCondition['price'] = { $gte: min, $lte: max };
            }
        }

        if (param.color_filter && param.color_filter.length > 0) {
            var colors = param.color_filter;
            var orArr = [];
            if (colors && colors.length > 0) {
                for (let i = 0; i < colors.length; i++) {
                    let color = colors[i];
                    orArr.push({ 'color_size': { '$elemMatch': { 'color': color } } });
                }
                whereCondition['$or'] = orArr;
            }

        }

        if (param.count) {
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.start);
        }

        const products = await Product.find(whereCondition)
            .select("id name price featuredImage avgRating isService quantity")
            .populate([{
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            }])
            .limit(limit)
            .skip(skip)
            .sort(sortOption);

        //to get count of total products
        const totalProducts = await Product.find(whereCondition).countDocuments();

        //to get max price of products
        const maxPrice = await Product.findOne(whereCondition).sort({ "price": "desc" });

        if (products && products.length > 0) {

            var result = { totalProducts: totalProducts, products: products };
            if (maxPrice) {
                result['maxPrice'] = maxPrice.price;
            }
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }

}

async function getBrandsListByProducts(req) {
    try {
        const param = req.body;
        var whereCondition = { isActive: true, isService: false };

        if (param.product_ids && param.product_ids.length > 0) {

            whereCondition['_id'] = { $in: param.product_ids };

            const results = await Product.find(whereCondition)
                .select("brand")
                .populate("brand", "id brandName")
                .limit(10);

            if (results && results.length > 0) {
                //distinct brands
                var obj = {};
                for (var i = 0; i < results.length; i++) {
                    obj[results[i]['brand']] = results[i].brand;
                }
                var brands = new Array();
                for (var key in obj) {
                    brands.push(obj[key]);
                }
                return brands;
            }
        }
        return false;

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}


async function getColorsListByProducts(req) {
    try {
        const param = req.body;
        var whereCondition = { isActive: true, isService: false };

        if (param.product_ids && param.product_ids.length > 0) {
            whereCondition['_id'] = { $in: param.product_ids };
        }

        const results = await Product.find(whereCondition)
            .select("color_size");
        //.limit(10);

        var colors = [];
        var color_data = [];
        if (results && results.length > 0) {

            for (var i = 0; i < results.length; i++) {
                let color_size = results[i].color_size;

                for (var j = 0; j < color_size.length; j++) {
                    let color = color_size[j].color;
                    colors = colors.concat(color);
                }
            }

            if (colors) {
                colors = colors.filter(function(item, index, inputArray) {
                    return inputArray.indexOf(item) == index;
                });

                if (colors && colors.length > 0) {

                    color_data = await Color.find({ lname: { $in: colors } }).select("lname code");

                    if (color_data && color_data.length > 0) {
                        return color_data;
                    }

                } else {
                    return color_data;
                }

            } else {
                return false;
            }
        }
        return false;

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

//Product
async function getProductById(id) {
    const product = await Product.findById(id).select('productCode name description specifications color_size tier_price price featuredImage images avgRating reviewCount quantity')
        .populate([{
            path: "reviews",
            model: Review,
            select: "id review rating productId userId reviewImages createdAt",
            populate: {
                path: "userId",
                model: User,
                select: "name"
            }
        }])
        .populate([{
            path: "cryptoPrices",
            model: CryptoConversion,
            select: "name code cryptoPriceUSD",
            match: { isActive: true, asCurrency: true }
        }])
        .populate("createdBy", "name");
    if (!product) return false;
    return product;
}


async function getServiceListing(req) {

    try {
        var param = req.body;
        var sortOption = { createdAt: 'desc' }; //default
        var limit = '';
        var skip = '';
        var whereCondition = { isActive: true, isService: true };

        if (param.sorting) {
            sortOption = {};
            let sort_type = param.sorting.sort_type;
            let sort_val = param.sorting.sort_val;

            if (sort_type == 'price') {
                sortOption[sort_type] = sort_val;
            } else
            if (sort_type == 'new') {
                sortOption['createdAt'] = "desc";
            } else
            if (sort_type == 'popular') {
                sortOption['reviewCount'] = "desc";
            }
        }

        if (param.search_value && param.search_value != '') {
            let val = param.search_value.toLowerCase();
            whereCondition['lname'] = { $regex: val, $options: "i" };
        }

        if (param.category_filter && param.category_filter.length > 0) {
            whereCondition['category'] = { $in: param.category_filter };
        }

        if (param.sub_category_filter && param.sub_category_filter.length > 0) {
            whereCondition['sub_category'] = { $in: param.sub_category_filter };
        }

        if (param.episode_filter && param.episode_filter.length > 0) {
            let x = Math.min(...param.episode_filter);
            whereCondition['videoCount'] = { $gt: x };
        }

        if (param.price_filter) {
            let min = param.price_filter.min_val;
            let max = param.price_filter.max_val;
            if (min !== "" && max !== "") {
                whereCondition['price'] = { $gte: min, $lte: max };
            }
        }

        if (param.rating_filter && param.rating_filter.length > 0) {
            let min = Math.min(...param.rating_filter);
            whereCondition['avgRating'] = { $gte: min };
        }

        if (param.count) {
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.start);
        }

        const services = await Product.find(whereCondition)
            .select("id name price featuredImage avgRating videoCount isService quantity")
            .populate([{
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            }])
            .limit(limit)
            .skip(skip)
            .sort(sortOption);

        //to get count of total services
        const totalServices = await Product.find(whereCondition).countDocuments();

        //to get max price of services
        const maxPrice = await Product.findOne(whereCondition).sort({ "price": "desc" });

        //to get max video count of services
        const maxVideoCount = await Product.findOne(whereCondition).sort({ "videoCount": "desc" });

        if (services && services.length > 0) {

            var result = { totalServices: totalServices, services: services };

            if (maxPrice) {
                result['maxPrice'] = maxPrice.price;
            }

            if (maxVideoCount) {
                let vid_count = maxVideoCount.videoCount;
                let x = 5;
                let filter_chunks = range(x, vid_count, x);
                result['maxVideoCount'] = vid_count;
                result['episodeChunks'] = filter_chunks;
            }
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}


var range = function(start, end, step) {
    var range = [];
    var typeofStart = typeof start;
    var typeofEnd = typeof end;

    if (step === 0) {
        throw TypeError("Step cannot be zero.");
    }

    if (typeofStart == "undefined" || typeofEnd == "undefined") {
        throw TypeError("Must pass start and end arguments.");
    } else if (typeofStart != typeofEnd) {
        throw TypeError("Start and end arguments must be of same type.");
    }

    typeof step == "undefined" && (step = 1);

    if (end < start) {
        step = -step;
    }

    if (typeofStart == "number") {

        while (step > 0 ? end >= start : end <= start) {
            range.push(start);
            start += step;
        }

    } else if (typeofStart == "string") {

        if (start.length != 1 || end.length != 1) {
            throw TypeError("Only strings with one character are supported.");
        }

        start = start.charCodeAt(0);
        end = end.charCodeAt(0);

        while (step > 0 ? end >= start : end <= start) {
            range.push(String.fromCharCode(start));
            start += step;
        }

    } else {
        throw TypeError("Only string and number types are supported");
    }

    return range;

}

//Service
async function getServiceById(id) {
    const product = await Product.findById(id).select('productCode name validity description specifications price featuredImage avgRating reviewCount videoCount quantity')
        .populate([{
            path: "reviews",
            model: Review,
            select: "id review rating productId userId reviewImages createdAt",
            populate: {
                path: "userId",
                model: User,
                select: "name"
            }
        }])
        .populate([{
            path: "videos",
            model: ServiceVideo,
            select: "video.title video.no video.thumb video.description"
        }])
        .populate([{
            path: "cryptoPrices",
            model: CryptoConversion,
            select: "name code cryptoPriceUSD",
            match: { isActive: true, asCurrency: true }
        }])
        .populate("createdBy", "name");
    if (!product) return false;
    return product;
}