﻿const config = require("../config/index");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const {
  Category,
  Product,
  Review,
  User,
  Seller,
  Admin,
  Brand,
  TrendingProduct,
  TodayDeal,
  RecentSearchProduct,
  BannerImage,
  PopularProduct,
  Color,
  ServiceVideo,
  CryptoConversion,
  cmsPost,
  cmsPage,
  bannerAdvertisement,
  Services,
  ServiceReview,
  Notification,
} = require("../helpers/db");

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
  cmsPublishBlog,
  cmsBlogDetailBySlug,
  cmsPublishPage,
  cmsPageDetails,
  getAllBannersData,
  getAllAdvBannerData,
  advertismentBySlug,
  searchFilterServices,
  getServiceCategory,
  getServicesByCategory,
  saveNotifications,
  getNotifications,
  updateNotifications,
  setNotificationSeen,
};

async function getReviews(id) {
  const reviews = await Review.find({ isActive: true, productId: id })
    .select("id review rating productId reviewImages createdAt")
    .sort({ createdAt: "desc" })
    .populate("userId", "name");

  if (reviews && reviews.length > 0) {
    return (result = {
      reviewCount: reviews.length,
      reviews: reviews,
    });
  }
  return false;
}

async function getRatingCount(id) {
  try {
    const productId = mongoose.Types.ObjectId(id);

    var condition = {
      _id: "$productId",
      5: {
        $sum: {
          $cond: [{ $eq: ["$rating", 5] }, 1, 0],
        },
      },
      4: {
        $sum: {
          $cond: [{ $eq: ["$rating", 4] }, 1, 0],
        },
      },
      3: {
        $sum: {
          $cond: [{ $eq: ["$rating", 3] }, 1, 0],
        },
      },
      2: {
        $sum: {
          $cond: [{ $eq: ["$rating", 2] }, 1, 0],
        },
      },
      1: {
        $sum: {
          $cond: [{ $eq: ["$rating", 1] }, 1, 0],
        },
      },
    };

    var ratingsData = [
      { $match: { productId: productId } },
      {
        $group: condition,
      },
    ];

    const ratings = await Review.aggregate(ratingsData);

    if (ratings && ratings.length > 0) {
      return ratings;
    }
    return false;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getSimilarProducts(id) {
  try {
    const product = await Product.findById(id);

    if (!product) return false;

    const products = await Product.find({
      isActive: true,
      isService: product.isService,
      category: product.category,
      _id: { $ne: id },
    })
      .select(
        "id name price featuredImage avgRating isService videoCount quantity"
      )
      .populate([
        {
          path: "cryptoPrices",
          model: CryptoConversion,
          select: "name code cryptoPriceUSD",
          match: { isActive: true, asCurrency: true },
        },
      ])
      .sort({ createdAt: "desc" });

    if (products && products.length > 0) {
      return products;
    }
    return false;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getPopularBrands() {
  const result = await Brand.find({ isActive: true, isPopular: true })
    .select("brandName logoImage")
    .limit(11)
    .sort({ brandName: "asc" });
  if (result && result.length > 0) return result;
  return false;
}

async function getTrendingProducts(req) {
  const limit = req.params.limit == "all" ? "" : parseInt(req.params.limit);
  const result = await TrendingProduct.find({ isActive: true })
    .select("id")
    .populate([
      {
        path: "productId",
        model: Product,
        select: "id name price featuredImage avgRating isService quantity",
        populate: {
          path: "cryptoPrices",
          model: CryptoConversion,
          select: "name code cryptoPriceUSD",
          match: { isActive: true, asCurrency: true },
        },
      },
    ])
    .limit(limit)
    .sort({ createdAt: "desc" });
  if (result && result.length > 0) return result;
  return false;
}

async function getPopularProducts(req) {
  const limit = req.params.limit == "all" ? "" : parseInt(req.params.limit);
  const result = await PopularProduct.find({ isActive: true })
    .select("id")
    //.populate("productId", "id name price featuredImage")
    .populate([
      {
        path: "productId",
        model: Product,
        select: "id name price featuredImage avgRating isService quantity",
        populate: {
          path: "cryptoPrices",
          model: CryptoConversion,
          select: "name code cryptoPriceUSD",
          match: { isActive: true, asCurrency: true },
        },
      },
    ])
    .limit(limit)
    .sort({ createdAt: "desc" });
  if (result && result.length > 0) return result;
  return false;
}

async function getTodayDeals() {
  const result = await TodayDeal.find({ isActive: true })
    .select("id title categoryId bannerImage")
    .sort({ createdAt: "desc" });
  if (result && result.length > 0) return result;
  return false;
}

async function getRecentSearchProducts(req) {
  const limit = req.params.limit == "all" ? "" : parseInt(req.params.limit);
  const result = await RecentSearchProduct.find({ isActive: true })
    .select("id")
    //.populate("productId", "id name price featuredImage")
    .populate([
      {
        path: "productId",
        model: Product,
        select: "id name price featuredImage avgRating isService quantity",
        populate: {
          path: "cryptoPrices",
          model: CryptoConversion,
          select: "name code cryptoPriceUSD",
          match: { isActive: true, asCurrency: true },
        },
      },
    ])
    .limit(limit)
    .sort({ createdAt: "desc" });
  if (result && result.length > 0) return result;
  return false;
}

async function getBannerImages(page) {
  try {
    const banner = await BannerImage.findOne({
      isActive: true,
      page: page,
    }).select("id singleImage bannerImages");

    if (banner) {
      return banner;
    }
    return false;
  } catch (err) {
    console.log(err.message);
  }
}

async function getCategoriesSearch(req) {
  const param = req.body;
  var whereCondition = { isActive: true, parent: null };

  if (param.is_service) {
    whereCondition["isService"] = param.is_service;
  } else {
    whereCondition["isService"] = false;
  }

  let sortOption = { categoryName: "asc" };
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

    var whereCondition = { isActive: true, onMainMenu: true, parent: null };

    if (param.is_service) {
      whereCondition["isService"] = param.is_service;
    } else {
      whereCondition["isService"] = false;
    }

    var condData = [
      { $match: whereCondition },
      { $group: { _id: "$_id", name: { $first: "$categoryName" } } },
      {
        $graphLookup: {
          from: "categories",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent",
          as: "subCategories",
          restrictSearchWithMatch: {
            onMainMenu: true,
            isActive: true,
          },
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          "subCategories._id": 1,
          "subCategories.categoryName": 1,
        },
      },
      {
        $sort: {
          name: 1,
          "subCategories.parent": 1,
        },
      },
    ];

    const result = await Category.aggregate(condData);

    if (result && result.length > 0) {
      return result;
    }
    return false;
  } catch (err) {
    console.log(err.message);
  }
}

//Product or Service
async function getFilterCategories(req) {
  try {
    const id = req.params.id;
    const param = req.body;
    var whereCondition = { isActive: true };

    if (param.is_service) {
      whereCondition["isService"] = param.is_service;
    } else {
      whereCondition["isService"] = false;
    }

    if (id != "null") {
      whereCondition["parent"] = id;
    } else {
      whereCondition["parent"] = null;
    }

    let sortOption = { categoryName: "asc" };

    const categories = await Category.find(whereCondition)
      .select("id categoryName")
      .sort(sortOption);

    if (categories && categories.length > 0) {
      return categories;
    }
    return false;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getProductListing(req) {
  try {
    // console.log('param', param);
    var param = req.body;
    var sortOption = { createdAt: "desc" }; //default
    var limit = "";
    var skip = "";
    var whereCondition = { isActive: true, isService: false };

    if (param.sorting) {
      sortOption = {};
      let sort_type = param.sorting.sort_type;
      let sort_val = param.sorting.sort_val;

      if (sort_type == "price") {
        sortOption[sort_type] = sort_val;
      } else if (sort_type == "new") {
        sortOption["createdAt"] = "desc";
      } else if (sort_type == "popular") {
        sortOption["reviewCount"] = "desc";
      }
    }

    if (param.search_value && param.search_value != "") {
      let val = param.search_value.toLowerCase();
      whereCondition["lname"] = { $regex: val, $options: "i" };
    }

    if (param.category_filter && param.category_filter.length > 0) {
      whereCondition["category"] = { $in: param.category_filter };
    }

    if (param.sub_category_filter && param.sub_category_filter.length > 0) {
      whereCondition["sub_category"] = { $in: param.sub_category_filter };
    }

    if (param.brand_filter && param.brand_filter.length > 0) {
      whereCondition["brand"] = { $in: param.brand_filter };
    }

    if (param.price_filter) {
      let min = param.price_filter.min_val;
      let max = param.price_filter.max_val;
      if (min !== "" && max !== "") {
        whereCondition["price"] = { $gte: min, $lte: max };
      }
    }

    if (param.color_filter && param.color_filter.length > 0) {
      var colors = param.color_filter;
      var orArr = [];
      if (colors && colors.length > 0) {
        for (let i = 0; i < colors.length; i++) {
          let color = colors[i];
          orArr.push({ color_size: { $elemMatch: { color: color } } });
        }
        whereCondition["$or"] = orArr;
      }
    }

    if (param.count) {
      limit = parseInt(param.count.limit);
      skip = parseInt(param.count.start);
    }

    const products = await Product.find(whereCondition)
      .select("id name price featuredImage avgRating isService quantity")
      .populate([
        {
          path: "cryptoPrices",
          model: CryptoConversion,
          select: "name code cryptoPriceUSD",
          match: { isActive: true, asCurrency: true },
        },
      ])
      .limit(limit)
      .skip(skip)
      .sort(sortOption);

    //to get count of total products
    const totalProducts = await Product.find(whereCondition).countDocuments();

    //to get max price of products
    const maxPrice = await Product.findOne(whereCondition).sort({
      price: "desc",
    });

    if (products && products.length > 0) {
      var result = { totalProducts: totalProducts, products: products };
      if (maxPrice) {
        result["maxPrice"] = maxPrice.price;
      }
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getBrandsListByProducts(req) {
  try {
    const param = req.body;
    var whereCondition = { isActive: true, isService: false };

    if (param.product_ids && param.product_ids.length > 0) {
      whereCondition["_id"] = { $in: param.product_ids };

      const results = await Product.find(whereCondition)
        .select("brand")
        .populate("brand", "id brandName")
        .limit(10);

      if (results && results.length > 0) {
        //distinct brands
        var obj = {};
        for (var i = 0; i < results.length; i++) {
          obj[results[i]["brand"]] = results[i].brand;
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
    console.log("Error", err);
    return false;
  }
}

async function getColorsListByProducts(req) {
  try {
    const param = req.body;
    var whereCondition = { isActive: true, isService: false };

    if (param.product_ids && param.product_ids.length > 0) {
      whereCondition["_id"] = { $in: param.product_ids };
    }

    const results = await Product.find(whereCondition).select("color_size");
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
        colors = colors.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index;
        });

        if (colors && colors.length > 0) {
          color_data = await Color.find({ lname: { $in: colors } }).select(
            "lname code"
          );

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
    console.log("Error", err);
    return false;
  }
}

//Product
async function getProductById(id) {
  const product = await Product.findById(id)
    .select(
      "productCode name description specifications color_size tier_price price featuredImage images avgRating reviewCount quantity"
    )
    .populate([
      {
        path: "reviews",
        model: Review,
        select: "id review rating productId userId reviewImages createdAt",
        populate: {
          path: "userId",
          model: User,
          select: "name",
        },
      },
      {
        path: "category",
        model: Category,
        select: "categoryName lname"
      }
    ])
    .populate([
      {
        path: "cryptoPrices",
        model: CryptoConversion,
        select: "name code cryptoPriceUSD",
        match: { isActive: true, asCurrency: true },
      },
    ])
    .populate("createdBy", "name");
  if (!product) return false;
  // console.log("product Check", product)
  return product;
}

async function getServiceListing(req) {
  try {
    var param = req.body;
    var sortOption = { createdAt: "desc" }; //default
    var limit = "";
    var skip = "";
    var whereCondition = { isActive: true, isService: true };

    if (param.sorting) {
      sortOption = {};
      let sort_type = param.sorting.sort_type;
      let sort_val = param.sorting.sort_val;

      if (sort_type == "price") {
        sortOption[sort_type] = sort_val;
      } else if (sort_type == "new") {
        sortOption["createdAt"] = "desc";
      } else if (sort_type == "popular") {
        sortOption["reviewCount"] = "desc";
      }
    }

    if (param.search_value && param.search_value != "") {
      let val = param.search_value.toLowerCase();
      whereCondition["lname"] = { $regex: val, $options: "i" };
    }

    if (param.category_filter && param.category_filter.length > 0) {
      whereCondition["category"] = { $in: param.category_filter };
    }

    if (param.sub_category_filter && param.sub_category_filter.length > 0) {
      whereCondition["sub_category"] = { $in: param.sub_category_filter };
    }

    if (param.episode_filter && param.episode_filter.length > 0) {
      let x = Math.min(...param.episode_filter);
      whereCondition["videoCount"] = { $gt: x };
    }

    if (param.price_filter) {
      let min = param.price_filter.min_val;
      let max = param.price_filter.max_val;
      if (min !== "" && max !== "") {
        whereCondition["price"] = { $gte: min, $lte: max };
      }
    }

    if (param.rating_filter && param.rating_filter.length > 0) {
      let min = Math.min(...param.rating_filter);
      whereCondition["avgRating"] = { $gte: min };
    }

    if (param.count) {
      limit = parseInt(param.count.limit);
      skip = parseInt(param.count.start);
    }

    const services = await Product.find(whereCondition)
      .select(
        "id name price featuredImage avgRating videoCount isService quantity"
      )
      .populate([
        {
          path: "cryptoPrices",
          model: CryptoConversion,
          select: "name code cryptoPriceUSD",
          match: { isActive: true, asCurrency: true },
        },
      ])
      .limit(limit)
      .skip(skip)
      .sort(sortOption);

    //to get count of total services
    const totalServices = await Product.find(whereCondition).countDocuments();

    //to get max price of services
    const maxPrice = await Product.findOne(whereCondition).sort({
      price: "desc",
    });

    //to get max video count of services
    const maxVideoCount = await Product.findOne(whereCondition).sort({
      videoCount: "desc",
    });

    if (services && services.length > 0) {
      var result = { totalServices: totalServices, services: services };

      if (maxPrice) {
        result["maxPrice"] = maxPrice.price;
      }

      if (maxVideoCount) {
        let vid_count = maxVideoCount.videoCount;
        let x = 5;
        let filter_chunks = range(x, vid_count, x);
        result["maxVideoCount"] = vid_count;
        result["episodeChunks"] = filter_chunks;
      }
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

var range = function (start, end, step) {
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
};

//Service
async function getServiceById(id) {
  const product = await Product.findById(id)
    .select(
      "productCode name validity description specifications price featuredImage avgRating reviewCount videoCount quantity"
    )
    .populate([
      {
        path: "reviews",
        model: Review,
        select: "id review rating productId userId reviewImages createdAt",
        populate: {
          path: "userId",
          model: User,
          select: "name",
        },
      },
    ])
    .populate([
      {
        path: "videos",
        model: ServiceVideo,
        select: "video.title video.no video.thumb video.description",
      },
    ])
    .populate([
      {
        path: "cryptoPrices",
        model: CryptoConversion,
        select: "name code cryptoPriceUSD",
        match: { isActive: true, asCurrency: true },
      },
    ])
    .populate("createdBy", "name");
  if (!product) return false;
  return product;
}

// Get Published Blog
async function cmsPublishBlog(req) {
  try {
    const all = await cmsPost.find({ status: req }).sort({ createdAt: "desc" });
    return all;
  } catch (error) {
    console.log(error);
  }
}

// Get Blog Details
async function cmsBlogDetailBySlug(req) {
  const slug = req.params.slug;
  // console.log("status", status)
  try {
    const allPost = await cmsPost.find({}).select().sort({ createdAt: "desc" });
    const filteredStatus = allPost.filter((item) => item.slug === slug);
    return filteredStatus;
  } catch (error) {
    console.log(error);
  }
}

// Publish page
async function cmsPublishPage(req) {
  try {
    const all = await cmsPage.find({ status: req }).sort({ createdAt: "desc" });
    return all;
  } catch (error) {
    console.log(error);
  }
}

// pageDetailByID
async function cmsPageDetails(req) {
  const slug = req.params.slug;
  // console.log("status", status)
  try {
    const allPost = await cmsPage.find({}).select().sort({ createdAt: "desc" });
    const filteredStatus = allPost.filter((item) => item.slug === slug);
    return filteredStatus;
  } catch (error) {
    console.log(error);
  }
}



// Get advertisment by url
async function advertismentBySlug(req) {
  const slug = req.params.slug;

  // console.log("status", status)
  try {
    const query = {
      status: "Publish",
    };
    const fieldsToSelect = "image video siteUrl slug"
    const advertise = await bannerAdvertisement
      .find(query)
      .select(fieldsToSelect)
      .sort({ createdAt: "desc" });
    const filteredStatus = advertise.filter((item) => item.slug === slug);
    return filteredStatus;
  } catch (error) {
    console.log(error);
  }
}

// BANNER DATA GET WITH KEYWORDS MATCH

async function getAllBannersData(req) {
  const keywordsData = req.params.keywords;
  try {
    // const result = await bannerAdvertisement.find({}).select().sort({ createdAt: 'desc' })
    // const matchedBannerData = result.filter(item => item.keyword.toLowerCase().includes(keywordsData.toLowerCase()))

    const query = {
      keyword: { $regex: keywordsData, $options: "i" },
      status: "Publish",
    };
    const fieldsToSelect = "image video category keyword siteUrl bannerName blockByUser";
    const result = await bannerAdvertisement
      .find(query)
      .sort({ createdAt: "desc" })
      .select(fieldsToSelect);

    if (result && result.length > 0) {
      // console.log("banner list ", result)
      return result;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
}


// Without keyword match only latest banner show..
async function getAllAdvBannerData() {
  try {
    const query = {
      status: "Publish",
    };
    const fieldsToSelect = "image video category keyword siteUrl bannerName blockByUser";
    const result = await bannerAdvertisement
      .find(query)
      .sort({ createdAt: "desc" })
      .select(fieldsToSelect)
      .limit(1);

    if (result && result.length > 0) {
      // console.log("banner ALL list ", result)
      return result;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
}

// Searching with category in services..

async function searchFilterServices(req, res) {
  const { category, name } = req.query;

  // console.log("category", category);
  // console.log("name", name);
  // try {
  //   const categoryData = await Category.findOne({ categoryName: new RegExp(category, 'i') });
  //   if (!categoryData) {
  //     return
  //   }
  //   const result = await Services.find({
  //     category: categoryData._id,
  //     categoryName: new RegExp(name, 'i')
  //   }).populate('category');
  //   return result;
  // } catch (error) {
  //   console.log(error);
  // }
  try {
    let items;

    if (category) {
      // Find the category by categoryName
      const categoryData = await Category.findOne({ categoryName: new RegExp(category, 'i') });

      if (!categoryData) {
        return
      }

      // Find items that match the category and name
      items = await Services.find({
        isActive: true,
        category: categoryData._id,
        categoryName: new RegExp(name, 'i'), // Case-insensitive match
      }).populate('category')
        .populate({
          path: 'reviews',
          model: ServiceReview,
          select: ''
        })
        .exec();
    } else if (name) {
      // Find items that match the name only
      // console.log("This esle is run")
      items = await Services.find({
        name: new RegExp(name, 'i'), // Case-insensitive match
        isActive: true,
      }).populate('category')
        .populate({
          path: 'reviews',
          model: ServiceReview,
          select: ''
        })
        .exec();;
    }
    else {
      items = await Services.find({ isActive: true, }).populate({
        path: 'reviews',
        model: ServiceReview,
        select: ''
      })
        .exec();
    }
    // console.log("Services filter data", items);
    return items;

  } catch (error) {
    console.log(error);
  }
}

// get service catgeory

async function getServiceCategory() {
  try {
    const categories = await Category.find({ isService: true, parent: null });
    return categories;
  } catch (err) {
    console.log("Error", err)
  }
}

async function getServicesByCategory(req) {
  try {
    const categoryId = req.params.categoryId;
    const categories = req.query.categories;
    let services
    if (categories) {
      console.log("categories", categories)
      const selectedCategories = categories.split(',');
      // const selectedCategories = categories.split(',').map(cat => mongoose.Types.ObjectId(cat));
      services = await Services.find({ category: { $in: selectedCategories } });
      return services
    } else {
      //console.log("services with only id select", services)
      services = await Services.find({ category: mongoose.Types.ObjectId(categoryId), isActive: true, })
        .populate({
          path: 'reviews',
          model: ServiceReview,
          select: ''
        })
        .exec();
      return services
    }
  } catch (err) {
    console.log("Error", err)
  }
}

async function saveNotifications(req) {
  let data = req.body;
  // console.log('notification data to save--',data)
  const { type, receiver, sender, message, postId } = data;

  if (!type || !receiver || !sender || !message) {
    throw new Error('Missing required fields: type, receiver,postId, sender, or message');
  }

  const newNotification = new Notification({
    type,
    receiver: {
      id: receiver.id,
      type: receiver.type
    },
    sender: {
      id: sender.id,
      type: sender.type
    },
    postId,
    message,
    isRead: false,
    createdAt: new Date()
  });

  try {
    const savedNotification = await newNotification.save();
    return savedNotification;
  } catch (error) {
    console.error('Error saving notification:', error);
    throw new Error('Failed to save notification');
  }
}

// async function getNotifications(req) {
//   let id = req.params.id;
//   //console.log('notification da--', id)
//   try {
//     const notifications = await Notification.find({ 'receiver.id': mongoose.Types.ObjectId(id) }) .sort({ createdAt: 'desc' });

//     for (let notification of notifications) {
//       let modelName = '';

//       if (notification.sender.type === 'seller') {
//         modelName = 'Seller';
//       } else if (notification.sender.type === 'user') {
//         modelName = 'User';
//       } else if (notification.sender.type === 'admin') {
//         modelName = 'Admin';
//       }

//       await notification.populate({
//         path: 'sender.id',
//         model: modelName,
//         select: 'name'
//       });
//     }

//     return notifications;
//   } catch (error) {
//     console.error('Error getting notifications:', error);
//     throw new Error('Failed to get notifications');
//   }
// }

async function getNotifications(req) {
  try {
    const authUserId = req.params.id;

    // Step 1: Find notifications where receiver.id matches authUserId
    const notifications = await Notification.find({
      "receiver.id": mongoose.Types.ObjectId(authUserId)
    }).sort({ createdAt: 'desc' });

    if (!notifications || notifications.length === 0) {
      return { message: "No notifications found" };
    }

    // Iterate over notifications to get sender details for each notification
    const notificationDetails = await Promise.all(
      notifications.map(async (notification) => {
        const senderId = notification.sender.id;
        let senderDetails = null;

        // Step 2: Query user model
        senderDetails = await User.findOne({ _id: senderId }).select('name');

        if (!senderDetails) {
          // Step 3: Query seller model if not found in user
          senderDetails = await Seller.findOne({ _id: senderId }).select('name');
        }

        if (!senderDetails) {
          // Step 4: Query admin model if not found in seller
          senderDetails = await Admin.findOne({ _id: senderId }).select('name');
        }

        // Return notification and corresponding senderDetails
        return {
          notification,
          senderDetails: senderDetails || { message: "Sender details not found" }
        };
      })
    );
    return notificationDetails;

  } catch (error) {
    console.error(error);
    return { message: "An error occurred while fetching notifications" };
  }
}

async function updateNotifications(req) {
  let id = req.params.id;
  //console.log('notification da--', id)
  try {
    const notification = await Notification.updateMany({ 'receiver.id': id, isRead: false }, { $set: { isRead: true } });
    if (notification.modifiedCount > 0) {
      return { message: 'Notifications updated successfully' };
    } else {
      return { message: 'No unread notifications found for the given user' };
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    throw new Error('Failed to update notification');
  }
}

async function setNotificationSeen(req, res) {
  const { notificationId } = req.body;

  if (!notificationId) {
    return { message: 'Notification ID is required' };
  }

  try {
    const result = await Notification.updateOne(
      { _id: notificationId, isSeen: false },
      { $set: { isSeen: true } }
    );

    if (result.modifiedCount > 0) {
      return { message: 'Notification updated successfully' };
    } else {
      return { message: 'No unread notification found with the given ID' };
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    throw new Error('Failed to update notification');
  }
}