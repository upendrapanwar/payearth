﻿const config = require('../config/index');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useNewUrlParser: true,  useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const fs = require('fs');

const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');
const LocationData = require('countrycitystatejson');

const { User, Seller, Product, Brand, Category, ServiceVideo, CryptoConversion, OrderStatus, Payment, Order, OrderTrackingTimeline, Color, NeedHelp, SellerContactUs, ProductSales, Review } = require("../helpers/db");

module.exports = {
    authenticate,
    getCountries,
    getStatesByCountry,
    getById,
    getUserByRole,
    signup,
    socialLogin,
    changePass,
    forgotPass,
    resetPass,
    getListedProducts,
    getProductById,
    addProduct,
    editProduct,
    addService,
    editService,
    getListedServices,
    getServiceById,
    addFeaturedImage,
    getStockItems,
    getOrders,
    getPayments,
    getOrderById,
    productStatusUpdate,
    getColors,
    getCategories,
    getBrands,
    needHelp,
    contactUs,
    getDashboardCounters,
    getProductSales,
    getSalesLineChartData,
    getTopSellingCategoryChartData,
    
};

function sendMail(mailOptions) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        port: config.mail_port, // true for 465, false for other ports
        host: config.mail_host,
        auth: {
            user: config.mail_auth_user,
            pass: config.mail_auth_pass,
        },
        tls: {
            rejectUnauthorized: false
        },
        secure: config.mail_is_secure,
    });

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log('*** Error', err);
        } else {
            console.log('*** Success', info);
        }

    });
    return true;
}

async function signup(req) {
    // const file = req.file;
    const param = req.body;

    // var fullUrl = '';

    if (await Seller.findOne({ email: param.email })) {
        throw 'email "' + param.email + '" is already taken';
    }

    // if (typeof file != "undefined") {
    //     fullUrl = file.destination + "/" + file.filename;
    // }

    const address_data = {
        address: param.address,
        country: param.country,
        state: param.state
    };
    const seller = new Seller({
        name: param.name,
        email: param.email,
        password: bcrypt.hashSync(param.password, 10),
        seller_type: param.seller_type,
        want_to_sell: param.want_to_sell,
        //pdf_url: fullUrl,
        full_address: address_data,
        isActive: true
    });

    //Email send functionality.
    const mailOptions = {
        from: config.mail_from_email, // sender address
        to: seller.email,
        subject: 'Welcome Email - PayEarth',
        text: 'Welcome Email',
        html: 'Dear <b>' + seller.name + '</b>,<br/> You are successfully registered as Seller.<br/> ',
    };
    sendMail(mailOptions);

    const data = await seller.save();
    if (data) {

        let res = await Seller.findById(data.id).select("-password -community -social_accounts -reset_password -pdf_url -phone");

        if (res) {
            return res;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

async function authenticate({ email, password }) {
    const seller = await Seller.findOne({ email });
    if (seller && bcrypt.compareSync(password, seller.password)) {
        const { password, reset_password, __v, createdAt, updatedAt, social_accounts, ...userrWithoutHash } = seller.toObject();
        const token = jwt.sign({ id: seller.id }, config.secret, {
            expiresIn: "2h"
        });
        var expTime = new Date();
        expTime.setHours(expTime.getHours() + 2); //2 hours token expiration time
        //expTime.setMinutes(expTime.getMinutes() + 2);
        expTime = expTime.getTime();
        return {
            ...userrWithoutHash,
            token,
            expTime
        };
    }
}

async function socialLogin(req) {

    var param = req.body;

    var input = {
        role: "seller",
        seller_type: "retailer",
        isActive: true
    };
    var andConditon = [{ isActive: true }];
    var orCondition = [];

    if (param.provider_data.email) {
        orCondition.push({ 'email': param.provider_data.email });
    }

    if (param.provider_type == 'google') {
        orCondition.push({ 'social_accounts.google.google_id': param.provider_id });

        input.name = param.provider_data.name;

        if (param.provider_data.email) {
            input.email = param.provider_data.email;
        }

        input.image_url = param.provider_data.imageUrl;
        input.social_accounts = {
            "google": {
                google_id: param.provider_data.googleId,
                google_data: param.provider_data
            }
        };

    } else
    if (param.provider_type == 'facebook') {
        orCondition.push({ 'social_accounts.facebook.facebook_id': param.provider_id });
        input.name = param.provider_data.name;
        input.email = param.provider_data.email;
        input.image_url = param.provider_data.picture.data.url;
        input.social_accounts = {
            "facebook": {
                facebook_id: param.provider_data.id,
                facebook_data: param.provider_data
            }
        };
    } else
    if (param.provider_type == 'twitter') {
        orCondition.push({ 'social_accounts.twitter.twitter_id': param.provider_id });
        input.name = param.provider_data.name;
        input.social_accounts = {
            "twitter": {
                twitter_id: param.provider_data.id,
                twitter_data: param.provider_data
            }
        };
    }

    //check for existing seller

    var whereCondition = {};

    whereCondition['$and'] = andConditon;

    if (orCondition && orCondition.length > 0) {
        whereCondition['$or'] = orCondition;
    }


    var seller = await Seller.findOne(whereCondition);

    if (seller) {
        //check for existing social login data
        var flag = 0;

        if (param.provider_type == 'google' && seller.social_accounts.google.google_id == null) {
            flag = 1;
        } else
        if (param.provider_type == 'facebook' && seller.social_accounts.facebook.facebook_id == null) {
            flag = 1;
        } else
        if (param.provider_type == 'twitter' && seller.social_accounts.twitter.twitter_id == null) {
            flag = 1;
        }

        if (flag === 1) {
            Object.assign(seller, input);
            await seller.save();
        }

        const { password, reset_password, __v, createdAt, updatedAt, social_accounts, ...userWithoutHash } = seller.toObject();
        const token = jwt.sign({ id: seller.id }, config.secret, {
            expiresIn: "2h"
        });
        var expTime = new Date();
        expTime.setHours(expTime.getHours() + 2); //2 hours token expiration time
        //expTime.setMinutes(expTime.getMinutes() + 2);
        expTime = expTime.getTime();
        return {
            ...userWithoutHash,
            token,
            expTime
        };

    } else {

        const sellerData = new Seller(input);

        const data = await sellerData.save();

        if (data) {
            const seller = await Seller.findById(data.id);

            if (seller) {

                //Email send functionality.
                const mailOptions = {
                    from: config.mail_from_email, // sender address
                    to: seller.email, // list of receivers
                    subject: 'Welcome Email - PayEarth',
                    text: 'Welcome Email',
                    html: 'Dear <b>' + seller.name + '</b>,<br/> You are successfully registered as Seller.<br/> ',
                };
                sendMail(mailOptions);

                const { password, reset_password, __v, createdAt, updatedAt, social_accounts, ...userWithoutHash } = seller.toObject();
                const token = jwt.sign({ id: seller.id }, config.secret, {
                    expiresIn: "2h"
                });
                var expTime = new Date();
                expTime.setHours(expTime.getHours() + 2); //2 hours token expiration time
                //expTime.setMinutes(expTime.getMinutes() + 2);
                expTime = expTime.getTime();
                return {
                    ...userWithoutHash,
                    token,
                    expTime
                };
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}

async function getCountries() {
    try {
        const countries = LocationData.getCountries();

        if (countries) {
            const result = [];
            for (let i = 0; i < countries.length; i++) {
                result.push({ code: countries[i].shortName, country: countries[i].name });
            };
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getStatesByCountry(req) {
    let country = req.body.country_code;
    const states = LocationData.getStatesByShort(country);

    if (states) {
        return states;
    } else {
        return false;
    }

}

async function forgotPass(param) {
    const email = param.email;
    const seller = await Seller.findOne({ email });

    if (seller) {
        var verif_code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        var verifExpTime = new Date();
        verifExpTime.setMinutes(verifExpTime.getMinutes() + parseInt(config.verif_min));
        var code_valid_at = verifExpTime;
        var is_pass_req = true;

        const input = {
            "reset_password": {
                "code_valid_at": code_valid_at,
                "verif_code": verif_code,
                "is_pass_req": is_pass_req
            }
        };

        Object.assign(seller, input);

        // Email send functionality.
        let app_url = config.app_env === "local" ? config.react_local_url : config.react_dev_url;
        let url = app_url + '/seller/reset-password?t=resetpass&u=' + seller.id + '&hash=' + verif_code;

        const mailOptions = {
            from: config.mail_from_email, // sender address
            to: seller.email, // list of receivers
            subject: 'Verification link generated for reset password.',
            text: 'Verification link',
            html: 'Dear <b>' + seller.name + '</b>,<br/> password reset verification link is - <a href="' + url + '" target="_blank"><b>' + url + ' </b></a><br/> It will expire in ' + config.verif_min + ' minutes.',
        };
        sendMail(mailOptions);

        const data = await seller.save();

        if (data) {
            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

async function resetPass(param) {
    const id = param.id;
    const seller = await Seller.findById(id);
    const now = new Date();

    if (seller && seller.reset_password.verif_code == param.code && seller.reset_password.code_valid_at >= now) {
        var verif_code = '';
        var code_valid_at = null;
        var is_pass_req = false;

        if (param.password === param.password_confirmation) {
            var password = bcrypt.hashSync(param.password, 10);
        } else {
            throw msg.seller.password.confirm_pass_err;
        }

        const input = {
            "reset_password": {
                "code_valid_at": code_valid_at,
                "verif_code": verif_code,
                "is_pass_req": is_pass_req
            },
            "password": password,
        };

        Object.assign(seller, input);

        const data = await seller.save();

        if (data) {
            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

async function getById(id) {
    const seller = await Seller.findById(id).select("-password");
    if (!seller) return false;
    return seller;
}

async function getUserByRole(param) {
    const seller = await Seller.findOne({ _id: param.id, role: param.role });
    if (!seller) return false;
    return seller;
}

async function changePass(id, param) {
    if (!param) throw msg.common.invalid;

    const seller = await Seller.findById(id);

    if (!seller) {
        return false;
    } else {
        //check old password
        if (bcrypt.compareSync(param.old_password, seller.password)) {
            if (param.password === param.password_confirmation) {
                param.password = bcrypt.hashSync(param.password, 10);
            } else {
                throw msg.seller.password.confirm_pass_err;
            }
            Object.assign(seller, { password: param.password });
            await seller.save();
            return seller;
        } else {
            throw msg.seller.password.old_pass_err;
        }
    }
}

async function getListedProducts(req) {
    try {
        var param = req.body;
        var id = req.params.id; //seller id
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { createdBy: id, isService: false };

        if (param.count) {
            page = parseInt(param.count.page);
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.skip);
        }

        if (param.sorting) {
            sortOption = {};
            let sort_type = param.sorting.sort_type;
            let sort_val = param.sorting.sort_val;
            if (sort_type == 'date') {
                sortOption['createdAt'] = sort_val;
            }
        }

        var options = {
            select: "id name price featuredImage isService isActive cryptoPrices",
            sort: sortOption,
            populate: [{
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            }],
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await Product.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    products: data.docs,
                    paginationData: {
                        totalProducts: data.totalDocs,
                        totalPages: data.totalPages,
                        currentPage: data.page,
                        limit: data.limit,
                        skip: data.offset,
                        hasPrevPage: data.hasPrevPage,
                        hasNextPage: data.hasNextPage,
                        prevPage: data.prevPage,
                        nextPage: data.nextPage
                    }
                };
                return res;
            });
        if (result.products && result.products.length > 0) {
            return result;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getProductById(id) {
    const product = await Product.findById(id)
        .select('name category sub_category brand description specifications color_size tier_price price images quantity isService isActive createdAt featuredImage')
        .populate([{
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            },
            {
                path: "brand",
                model: Brand,
                select: "id brandName"
            },
            {
                path: "category",
                model: Category,
                select: "id categoryName"
            },
            {
                path: "sub_category",
                model: Category,
                select: "id categoryName"
            }
        ]);

    if (!product) {

        return false;
    } else {

        //get product sales data
        const sales = await ProductSales.findOne({ productId: product.id }).select("totalSalesCount").exec();

        let result = {
            product: product,
            sales: sales
        };
        return result;
    }
}

async function addProduct(req) {
    const files = req.files;
    const param = req.body;
    var lName = param.name.toLowerCase();
    var imagesArr = [];
    var colorSizeArr = [];
    var tierPriceArr = [];
    var stockQty = 0;

    if (await Product.findOne({ lname: lName })) {
        throw 'Name "' + param.name + '" is already taken';
    }

    if (files.length > 0) {

        var fieldnames = {};
        for (var i = 0; i < files.length; i++) {
            var field = files[i].fieldname;
            var url = files[i].destination + "/" + files[i].filename;
            if (!fieldnames[field]) {
                fieldnames[field] = [];
            }
            fieldnames[field].push(url);
        }

        for (var field in fieldnames) {
            imagesArr.push({ color: field, paths: fieldnames[field] });
        }
    }

    if (param.color_size) {
        for (var size in param.color_size) {
            colorSizeArr.push({ size: size, color: param.color_size[size] });
        }
    }

    if (param.tier_price) {
        for (var tp in param.tier_price) {
            let tpArr = param.tier_price[tp];
            let qty = Number(tpArr.qty);
            stockQty += qty;
            tierPriceArr.push({ qty: qty, price: Number(tpArr.price) });
        }
    }

    let qtyObj = {
        selling_qty: 0,
        stock_qty: stockQty
    };

    let input = {
        name: param.name,
        lname: lName,
        category: param.category,
        brand: param.brand,
        description: param.description,
        specifications: param.specifications,
        price: param.price,
        color_size: colorSizeArr,
        tier_price: tierPriceArr,
        price: param.price,
        images: imagesArr,
        quantity: qtyObj,
        isActive: false,
        createdBy: param.seller_id,
        updatedBy: param.seller_id,
        isActive: true
    };

    if (param.sub_category !== "") {
        input['sub_category'] = param.sub_category;
    }

    const product = new Product(input);

    const data = await product.save();

    if (data) {

        let res = await Product.findById(data.id).select('name category sub_category brand description specifications color_size tier_price price images quantity isService isActive');

        if (res) {
            return res;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

async function editProduct(req) {
    try {

        // console.log('old_images', req.body.old_images);
        //return false;

        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) return false;

        const files = req.files;
        const param = req.body;
        var old_images = [];
        var lName = param.name.toLowerCase();
        var imagesArr = [];
        var colorSizeArr = [];
        var tierPriceArr = [];
        var stockQty = 0;
        var fieldnames = {};

        if (product.lname !== lName && (await Product.findOne({ lname: lName, isService: false }))) {
            throw 'Product Name "' + param.name + '" already exists.';
        }

        if (param.old_images) {
            for (var oi in param.old_images) {
                old_images.push(oi);
            }
        }


        if (files.length > 0) { //when images is selected to upload in atleast one color
            for (var i = 0; i < files.length; i++) {
                var fx = files[i].fieldname;
                var url = files[i].destination + "/" + files[i].filename;
                if (!fieldnames[fx]) {
                    fieldnames[fx] = [];
                }
                fieldnames[fx].push(url);
            }

            if (fieldnames) {
                for (var fy in fieldnames) {
                    let paths = fieldnames[fy];

                    if (old_images.includes(fy)) { //when existing color is selected to upload images
                        paths = paths.concat(param.old_images[fy]);
                    }

                    imagesArr.push({ color: fy, paths: paths });
                }
            }

        }

        if (param.old_images) { //when old images are exists.
            for (var fz in param.old_images) {
                if (fieldnames && !checkForColor(fieldnames, fz)) { //when color is not exist in new upload images
                    let el = { color: fz, paths: param.old_images[fz] };
                    imagesArr.push(el);
                }
            }
        }


        if (param.color_size) {
            for (var size in param.color_size) {
                colorSizeArr.push({ size: size, color: param.color_size[size] });
            }
        }

        if (param.tier_price) {
            for (var tp in param.tier_price) {
                let tpArr = param.tier_price[tp];
                let qty = Number(tpArr.qty);
                stockQty += qty;
                tierPriceArr.push({ qty: qty, price: Number(tpArr.price) });
            }
        }

        let qtyObj = {
            selling_qty: 0,
            stock_qty: stockQty
        };

        let input = {
            name: param.name,
            lname: lName,
            category: param.category,
            brand: param.brand,
            description: param.description,
            specifications: param.specifications,
            color_size: colorSizeArr,
            tier_price: tierPriceArr,
            price: param.price,
            images: imagesArr,
            quantity: qtyObj,
            updatedBy: param.seller_id
        };

        if (param.sub_category !== "") {
            input['sub_category'] = param.sub_category;
        }

        Object.assign(product, input);

        const data = await product.save();

        if (data) {

            let res = await Product.findById(data.id).select('name category sub_category brand description specifications color_size tier_price price images');

            if (res) {
                return res;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

function checkForColor(obj, key) {
    var result = false;
    result = key in obj;
    return result;
}

async function addFeaturedImage(req) {

    var file = req.file;
    var param = req.body;
    const id = param.id;
    var imgUrl = '';

    const data = await Product.findById(id);

    if (!data) return false;

    if (typeof file != "undefined") {

        if (fs.existsSync(data.featuredImage)) {
            fs.unlinkSync(data.featuredImage);
        }

        imgUrl = file.destination + "/" + file.filename;
    } else {
        imgUrl = data.featuredImage;
    }

    const input = {
        "featuredImage": imgUrl,
        "updatedAt": new Date().toISOString(),
    };

    Object.assign(data, input);

    const result = await data.save();

    if (result) {
        return await Product.findById(id).select("id featuredImage isService");
    } else {
        return false;
    }

}

//Services

async function getListedServices(req) {
    try {
        var param = req.body;
        var id = req.params.id; //seller id
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { createdBy: id, isService: true };

        if (param.count) {
            page = parseInt(param.count.page);
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.skip);
        }

        if (param.sorting) {
            sortOption = {};
            let sort_type = param.sorting.sort_type;
            let sort_val = param.sorting.sort_val;
            if (sort_type == 'date') {
                sortOption['createdAt'] = sort_val;
            }
        }

        var options = {
            select: "id name price featuredImage avgRating isService isActive quantity",
            sort: sortOption,
            populate: [{
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            }],
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await Product.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    services: data.docs,
                    paginationData: {
                        totalServices: data.totalDocs,
                        totalPages: data.totalPages,
                        currentPage: data.page,
                        limit: data.limit,
                        skip: data.offset,
                        hasPrevPage: data.hasPrevPage,
                        hasNextPage: data.hasNextPage,
                        prevPage: data.prevPage,
                        nextPage: data.nextPage
                    }
                };
                return res;
            });
        if (result.services && result.services.length > 0) {
            return result;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getServiceById(id) {
    const service = await Product.findById(id)
        .select('name category sub_category description validity price videoCount isActive isService quantity videos createdAt featuredImage')
        .populate([{
                path: "cryptoPrices",
                model: CryptoConversion,
                select: "name code cryptoPriceUSD",
                match: { isActive: true, asCurrency: true }
            },
            {
                path: "category",
                model: Category,
                select: "id categoryName"
            },
            {
                path: "sub_category",
                model: Category,
                select: "id categoryName"
            },
            {
                path: "videos",
                model: ServiceVideo,
                select: "video.title video.no video.thumb video.description"
            }
        ]);

    if (!service) {

        return false;
    } else {

        //get service sales data
        const sales = await ProductSales.findOne({ productId: service.id }).select("totalSalesCount").exec();

        let result = {
            service: service,
            sales: sales
        };
        return result;
    }
}

async function addService(req) {
    // try {
    //console.log(req.files);
    //return false;
    const param = req.body;
    var lName = param.name.toLowerCase();


    if (await Product.findOne({ lname: lName })) {
        throw 'Service Name "' + param.name + '" already exists.';
    }


    let input = {
        name: param.name,
        lname: lName,
        category: param.category,
        description: param.description,
        validity: param.validity,
        price: param.price,
        isActive: true,
        isService: true,
        createdBy: param.seller_id,
        updatedBy: param.seller_id
    };

    if (param.sub_category !== "") {
        input['sub_category'] = param.sub_category;
    }

    const service = new Product(input);

    const data = await service.save();

    if (data) {

        const files = req.files;
        var videosArr = [];
        var videoCount = 0;

        if (files.length > 0) {

            for (var i = 0; i < files.length; i++) {

                //for thumb file
                let upload_folder = 'uploads/video_thumbs';
                let path = files[i].path;
                let thumb_file_name = files[i].filename + '-' + Date.now() + '-thumb.png';
                let thumb_full = upload_folder + '/' + thumb_file_name;

                try {
                    //create thumb file
                    ffmpeg(path)
                        .setFfmpegPath(ffmpeg_static)
                        .screenshots({
                            timestamps: [0.0],
                            filename: thumb_file_name,
                            folder: upload_folder
                        }).on('end', function() {
                            //
                        });
                } catch (err) {
                    console.log('Error', err);
                }


                let url = files[i].destination + "/" + files[i].filename;
                let no = i + 1;
                let vid_data = {
                    serviceId: data.id,
                    video: {
                        no: no,
                        title: "Ep-" + no,
                        description: "Episode-" + no + " of " + param.name,
                        url: url,
                        thumb: thumb_full
                    },
                    isActive: true
                };
                videosArr.push(vid_data);
                videoCount++;
            }
        }

        if (videosArr && videosArr.length > 0) {
            //insert multiple videos data at once
            await ServiceVideo.insertMany(videosArr, async function(error, videos) {
                if (error == null && videos.length > 0) {
                    videoIds = [];
                    for (var j = 0; j < videos.length; j++) {
                        let videoId = mongoose.Types.ObjectId(videos[j]._id);
                        videoIds.push(videoId);
                    }

                    if (videoIds.length > 0) {
                        let update = { videoCount: videoCount, videos: videoIds };
                        //update video data into service
                        await Product.findByIdAndUpdate(data.id, update);
                    }
                }
            });
        }

        let res = await Product.findById(data.id).select('name category sub_category description validity price isActive isService');

        if (res) {
            return res;
        } else {
            return false;
        }
    } else {
        return false;
    }

    // } catch (err) {
    //     console.log('Error', err);
    //     return false;
    // }
}

async function editService(req) {

    //try {
    const id = req.params.id;
    const service = await Product.findById(id);
    const param = req.body;
    var lName = param.name.toLowerCase();

    if (service.lname !== lName && (await Product.findOne({ lname: lName, isService: true }))) {
        throw 'Service Name "' + param.name + '" already exists.';
    }

    let input = {
        name: param.name,
        lname: lName,
        category: param.category,
        description: param.description,
        validity: param.validity,
        price: param.price,
        isActive: true,
        isService: true,
        updatedBy: param.seller_id
    };

    if (param.sub_category !== "") {
        input['sub_category'] = param.sub_category;
    }

    Object.assign(service, input);

    const data = await service.save();

    if (data) {

        const files = req.files;
        var videosArr = [];
        var videoCount = 0;

        if (files.length > 0) {

            for (var i = 0; i < files.length; i++) {

                //for thumb file
                let upload_folder = 'uploads/video_thumbs';
                let path = files[i].path;
                let thumb_file_name = files[i].filename + '-' + Date.now() + '-thumb.png';
                let thumb_full = upload_folder + '/' + thumb_file_name;

                try {
                    //create thumb file
                    ffmpeg(path)
                        .setFfmpegPath(ffmpeg_static)
                        .screenshots({
                            timestamps: [0.0],
                            filename: thumb_file_name,
                            folder: upload_folder
                        }).on('end', function() {
                            //
                        });
                } catch (err) {
                    console.log('Error', err);
                }

                let url = files[i].destination + "/" + files[i].filename;
                let no = i + 1;
                let vid_data = {
                    serviceId: data.id,
                    video: {
                        no: no,
                        title: "Ep-" + no,
                        description: "Episode-" + no + " of " + param.name,
                        url: url,
                        thumb: thumb_full
                    },
                    isActive: true
                };
                videosArr.push(vid_data);
                videoCount++;
            }
        }

        if (videosArr && videosArr.length > 0) {
            //insert multiple videos data at once
            await ServiceVideo.insertMany(videosArr, async function(error, videos) {
                if (error == null && videos.length > 0) {
                    videoIds = [];
                    for (var j = 0; j < videos.length; j++) {
                        let videoId = mongoose.Types.ObjectId(videos[j]._id);
                        videoIds.push(videoId);
                    }

                    if (videoIds.length > 0) {
                        let update = { videoCount: videoCount, videos: videoIds };
                        //update video data into service
                        await Product.findByIdAndUpdate(data.id, update);
                    }
                }
            });
        }

        let res = await Product.findById(data.id).select('name category sub_category description validity price isActive isService');

        if (res) {
            return res;
        } else {
            return false;
        }
    } else {
        return false;
    }

    // } catch (err) {
    //     console.log('Error', err);
    //     return false;
    // }

}

async function getStockItems(req) {
    //Product or  Service : added / pending / reject
    try {
        var param = req.body;
        var id = req.params.id; //seller id
        var selectColumn = "id productCode name brand quantity category isActive approveStatus isService";
        var sortOption = { createdAt: 'desc' }; //default
        var statusType = param.filter.type ? param.filter.type : "none";
        var isService = param.filter.is_service ? param.filter.is_service : false;
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { createdBy: id, isService: isService, approveStatus: statusType };

        if (statusType == "none") {
            selectColumn = "id productCode name brand quantity category isActive approveStatus isService";
        } else if (statusType == "pending") {
            selectColumn = "id productCode name brand quantity.stock_qty category isActive approveStatus isService";
        } else if (statusType == "reject") {
            selectColumn = "id productCode name brand category isActive approveStatus isService";
        }

        if (param.count) {
            page = parseInt(param.count.page);
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.skip);
        }

        var options = {
            select: selectColumn,
            sort: sortOption,
            populate: [{
                    path: "brand",
                    model: Brand,
                    select: "brandName"
                },
                {
                    path: "category",
                    model: Category,
                    select: "categoryName"
                }
            ],
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await Product.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    items: data.docs,
                    paginationData: {
                        totalItems: data.totalDocs,
                        totalPages: data.totalPages,
                        currentPage: data.page,
                        limit: data.limit,
                        skip: data.offset,
                        hasPrevPage: data.hasPrevPage,
                        hasNextPage: data.hasNextPage,
                        prevPage: data.prevPage,
                        nextPage: data.nextPage
                    }
                };
                return res;
            });
        if (result.items && result.items.length > 0) {
            return result;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function productStatusUpdate(req) {
    try {

        const param = req.body;
        const id = param.product_id;
        const product = await Product.findById(id);

        if (!product) {
            return false;
        } else {
            const input = {
                "isActive": param.is_active,
                "updatedBy": param.seller_id,
                "updatedAt": new Date().toISOString()
            };

            Object.assign(product, input);

            if (await product.save()) {
                return true;
            }
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}


async function getOrders(req) {
    //pending, ongoing, cancel and refund, complete orders of product/service 
    try {

        var param = req.body;
        var id = req.params.id; //user id
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var orArr = [{ "lname": "pending" }]; //default
        var statusOrArray = [];
        var timelineOrArray = [];
        var isService = param.filter.is_service ? param.filter.is_service : false;
        var whereCondition = {};

        //get id of order status
        if (param.filter.type == "pending") {
            orArr = [{ "lname": "pending" }];

        } else if (param.filter.type == "ongoing") {
            orArr = [{ "lname": "processing" }, { "lname": "packed" }, { "lname": "shipped" }, { "lname": "delivered" }];

        } else if (param.filter.type == "cancel_refund") {
            orArr = [{ "lname": "cancelled" }, { "lname": "refunded" }, { "lname": "declined" }, { "lname": "disputed" }, { "lname": "failed" }, { "lname": "returned" }, { "lname": "return_request" }, { "lname": "cancel_request" }];

        } else if (param.filter.type == "complete") {
            orArr = [{ "lname": "completed" }];
        }

        var statuses = await OrderStatus.find({ $or: orArr }).select("id lname").exec();

        if (statuses && statuses.length > 0) {

            for (var i = 0; i < statuses.length; i++) {
                let id = statuses[i]._id;
                let el = { "orderStatusId": id };
                statusOrArray.push(el);
            }

            var timelines = await OrderTrackingTimeline.find({ $or: statusOrArray }).select("id").exec();

            if (timelines && timelines.length > 0) {
                for (var j = 0; j < timelines.length; j++) {
                    let x = timelines[j]._id;
                    timelineOrArray.push(x);
                }
            }
        }

        if (timelineOrArray.length > 0) {
            whereCondition = { $and: [{ sellerId: id }, { isActive: true }, { isService: isService }, { orderStatus: { $in: timelineOrArray } }] };
        } else {
            return false;
        }

        if (param.count) {
            page = parseInt(param.count.page);
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.skip);
        }

        if (param.sorting) {
            sortOption = {};
            let sort_type = param.sorting.sort_type;
            let sort_val = param.sorting.sort_val;
            if (sort_type == 'date') {
                sortOption['createdAt'] = sort_val;
            }
        }

        var options = {
            select: 'id orderCode productId userId isActive orderStatus paymentId product_sku',
            sort: sortOption,
            populate: [{
                    path: "productId",
                    model: Product,
                    select: "id productCode name isService isActive",
                    populate: {
                        path: "cryptoPrices",
                        model: CryptoConversion,
                        select: "name code cryptoPriceUSD",
                        match: { isActive: true, asCurrency: true }
                    }
                },
                {
                    path: "orderStatus",
                    model: OrderTrackingTimeline,
                    select: "id orderStatusId",
                    populate: {
                        path: "orderStatusId",
                        model: OrderStatus,
                        select: "lname title"
                    }
                },
                {
                    path: "paymentId",
                    model: Payment,
                    select: "paymentMode amountPaid"
                }
            ],
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await Order.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    orders: data.docs,
                    paginationData: {
                        totalOrders: data.totalDocs,
                        totalPages: data.totalPages,
                        currentPage: data.page,
                        limit: data.limit,
                        skip: data.offset,
                        hasPrevPage: data.hasPrevPage,
                        hasNextPage: data.hasNextPage,
                        prevPage: data.prevPage,
                        nextPage: data.nextPage
                    }
                };
                return res;
            });
        if (result.orders && result.orders.length > 0) {
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getPayments(req) {
    try {

        var param = req.body;
        var id = req.params.id; //seller id
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { sellerId: id, isActive: true };

        if (param.count) {
            page = parseInt(param.count.page);
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.skip);
        }

        if (param.sorting) {
            sortOption = {};
            let sort_type = param.sorting.sort_type;
            let sort_val = param.sorting.sort_val;
            if (sort_type == 'date') {
                sortOption['createdAt'] = sort_val;
            }

        }

        var options = {
            select: 'id orderId userId amountPaid paymentMode paymentAccount isActive createdAt',
            sort: sortOption,
            populate: [{
                path: "orderId",
                model: Order,
                select: "id orderCode productId",
                populate: {
                    path: "productId",
                    model: Product,
                    select: "id name featuredImage isService"
                }
            }],
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await Payment.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    payments: data.docs,
                    paginationData: {
                        totalPayments: data.totalDocs,
                        totalPages: data.totalPages,
                        currentPage: data.page,
                        limit: data.limit,
                        skip: data.offset,
                        hasPrevPage: data.hasPrevPage,
                        hasNextPage: data.hasNextPage,
                        prevPage: data.prevPage,
                        nextPage: data.nextPage
                    }
                };
                return res;
            });
        if (result.payments && result.payments.length > 0) {
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getOrderById(id) {
    try {
        const order = await Order.findById(id).select('id orderCode productId userId amount product_sku isActive orderStatus createdAt')
            .populate([{
                    path: "productId",
                    model: Product,
                    select: "id name price featuredImage avgRating isService",
                    populate: {
                        path: "cryptoPrices",
                        model: CryptoConversion,
                        select: "name code cryptoPriceUSD",
                        match: { isActive: true, asCurrency: true }
                    }
                },
                {
                    path: "orderStatus",
                    model: OrderTrackingTimeline,
                    select: "updatedAt",
                    populate: {
                        path: "orderStatusId",
                        model: OrderStatus,
                        select: "lname title"
                    }
                },
                {
                    path: "userId",
                    model: User,
                    select: "id name"
                }
            ]);

        if (!order) {
            return false;
        } else {

            //get order tracking timeline data
            let orderTimeline = await OrderTrackingTimeline.find({ orderId: order.id })
                .select("orderId orderStatusId updatedAt")
                .populate("orderStatusId", "id lname title", { isActive: true });

            //get payment data
            let payment = await Payment.findOne({ orderId: order.id, userId: order.userId._id })
                .select("invoiceNo invoiceUrl amountPaid paymentMode paymentAccount").exec();

            let result = {
                order: order,
                orderTimeline: orderTimeline,
                payment: payment
            };
            return result;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getColors() {
    try {
        const result = await Color.find({ isActive: true }).select("colorName lname code").sort({ createdAt: 'desc' });
        var colors = {};
        if (result && result.length > 0) {
            for (var i = 0; i < result.length; i++) {
                colors[result[i].lname] = result[i].code;
            }
            return colors;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getCategories(req) {
    var param = req.body;
    var parent = param.parent ? param.parent : null;

    const result = await Category.find({ isActive: true, isService: param.is_service, parent: parent }).select("id categoryName isService parent").sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
}


async function getBrands() {
    const result = await Brand.find({ isActive: true }).select("id brandName").sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
}


async function needHelp(req) {

    const param = req.body;

    const needhelp = new NeedHelp({
        reason: param.reason,
        comment: param.comment,
        sellerId: param.seller_id,
        isActive: true
    });

    const data = await needhelp.save();

    if (data) {
        let res = await NeedHelp.findById(data.id).select("id reason comment isActive");

        if (res) {
            return res;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

async function contactUs(req) {

    const param = req.body;

    const result = new SellerContactUs({
        name: param.name,
        email: param.email,
        message: param.message,
        sellerId: param.seller_id,
        isActive: true
    });

    const data = await result.save();

    if (data) {
        let res = await SellerContactUs.findById(data.id).select("id name email message isActive");

        if (res) {
            return res;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


async function getDashboardCounters(id) {
    try {
        //to get count of total products of seller
        const totalProducts = await Product.find({ isActive: true, isService: false, createdBy: id }).countDocuments();

        //to get count of total services of seller
        const totalServices = await Product.find({ isActive: true, isService: true, createdBy: id }).countDocuments();

        //to get count of total orders of seller
        const totalOrders = await Order.find({ isActive: true, sellerId: id }).countDocuments();

        //to get sum of payments amount of seller
        const sellerId = mongoose.Types.ObjectId(id);
        const totalPaymentAmount = await Payment.aggregate([{
                $match: {
                    sellerId: sellerId,
                    isActive: true
                }
            },
            {
                $group: {
                    _id: "$id",
                    total: {
                        $sum: "$amountPaid"
                    }
                }
            }
        ]);

        let result = {
            totalOrders: totalOrders,
            totalPaymentAmount: totalPaymentAmount && totalPaymentAmount[0] ? totalPaymentAmount[0].total : 0,
            totalProducts: totalProducts,
            totalServices: totalServices
        };
        return result;

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}


async function getProductSales(req) {
    try {

        var param = req.body;
        var id = req.params.id; //seller id
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { sellerId: id, isActive: true };

        if (param.count) {
            page = parseInt(param.count.page);
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.skip);
        }

        if (param.sorting) {
            sortOption = {};
            let sort_type = param.sorting.sort_type;
            let sort_val = param.sorting.sort_val;
            if (sort_type == 'date') {
                sortOption['createdAt'] = sort_val;
            }

        }

        var options = {
            select: 'id productId profitAmount revenueAmount totalSalesCount',
            sort: sortOption,
            populate: [{
                path: "productId",
                model: Product,
                select: "id name featuredImage isService reviewCount price cryptoPrices",
                populate: {
                    path: "cryptoPrices",
                    model: CryptoConversion,
                    select: "name code cryptoPriceUSD",
                    match: { isActive: true, asCurrency: true }
                }
            }],
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await ProductSales.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    sales: data.docs,
                    paginationData: {
                        totalSales: data.totalDocs,
                        totalPages: data.totalPages,
                        currentPage: data.page,
                        limit: data.limit,
                        skip: data.offset,
                        hasPrevPage: data.hasPrevPage,
                        hasNextPage: data.hasNextPage,
                        prevPage: data.prevPage,
                        nextPage: data.nextPage
                    }
                };
                return res;
            });
        if (result.sales && result.sales.length > 0) {
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

async function getSalesLineChartData(req) {
    try {

        var conditionData = getConditionData(req);

        var res = await ProductSales.aggregate(conditionData);

        if (res && res.length > 0) {

            if (req.body.filter_type == 'month') {
                let obj = res[0].sales;
                res = Object.keys(obj).map((key) => [key, obj[key]]);
            }
            const result = {
                "result": res,
                "filter_type": req.body.filter_type
            };
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}


function getConditionData(req) {
    var param = req.body;
    var sellerId = mongoose.Types.ObjectId(req.params.id);
    var filter_type = param.filter_type; //month, year, week
    var dateVal = param.date_value && param.date_value !== '' ? new Date(param.date_value) : new Date();

    if (filter_type === "month") {
        const firstMonth = 1;
        const lastMonth = 12;
        const monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let today = new Date();
        let year = today.getFullYear();
        let yearVal = new Date(year, 0, 2); //first date of startYear


        return [{
                $match: {
                    sellerId: sellerId,
                    createdAt: { $gte: yearVal, $lte: today }
                }
            }, {
                $group: {
                    _id: { "year_month": { $substrCP: ["$createdAt", 0, 7] } },
                    count: { $sum: "$totalSalesCount" }
                }
            }, {
                $sort: { "_id.year_month": 1 }
            }, {
                $project: {
                    _id: 0,
                    count: 1,
                    month_year: {
                        $concat: [
                            { $arrayElemAt: [monthsArray, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
                            "-",
                            { $substrCP: ["$_id.year_month", 0, 4] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    data: { $push: { k: "$month_year", v: "$count" } }
                }
            },
            {
                $addFields: {
                    start_year: { $substrCP: [yearVal, 0, 4] },
                    end_year: { $substrCP: [today, 0, 4] },
                    months1: { $range: [{ $toInt: { $substrCP: [yearVal, 5, 2] } }, { $add: [lastMonth, 1] }] },
                    months2: { $range: [firstMonth, { $add: [{ $toInt: { $substrCP: [today, 5, 2] } }, 1] }] }
                }
            }, {
                $addFields: {
                    template_data: {
                        $concatArrays: [{
                                $map: {
                                    input: "$months1",
                                    as: "m1",
                                    in: {
                                        count: 0,
                                        month_year: {
                                            $concat: [{ $arrayElemAt: [monthsArray, { $subtract: ["$$m1", 1] }] }, "-", "$start_year"]
                                        }
                                    }
                                }
                            },
                            {
                                $map: {
                                    input: "$months2",
                                    as: "m2",
                                    in: {
                                        count: 0,
                                        month_year: {
                                            $concat: [{ $arrayElemAt: [monthsArray, { $subtract: ["$$m2", 1] }] }, "-", "$end_year"]
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }, {
                $addFields: {
                    data: {
                        $map: {
                            input: "$template_data",
                            as: "t",
                            in: {
                                k: "$$t.month_year",
                                v: {
                                    $reduce: {
                                        input: "$data",
                                        initialValue: 0,
                                        in: {
                                            $cond: [{ $eq: ["$$t.month_year", "$$this.k"] },
                                                { $add: ["$$this.v", "$$value"] },
                                                { $add: [0, "$$value"] }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                $project: {
                    sales: { $arrayToObject: "$data" },
                    _id: 0
                }
            }
        ];


    } else if (filter_type === "year") {

        let today = new Date();
        let year = today.getFullYear();
        let yearBefore = new Date(year - 9, 0, 2); //first date of yearBefore

        //var yearsArray = ["2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"];

        return [{
                $match: {
                    sellerId: sellerId,
                    createdAt: { $gte: yearBefore, $lte: today }
                }
            },
            {
                $group: {
                    _id: { $substrCP: ["$createdAt", 0, 4] },
                    count: { $sum: "$totalSalesCount" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ];

    } else if (filter_type === "week") {

        let end = dateVal;
        let start = getMonday(end); //first date of week

        const weeksArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return [{
                $match: {
                    sellerId: sellerId,
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: {
                        $concat: [
                            { $arrayElemAt: [weeksArray, { $subtract: [{ $toInt: { $dayOfWeek: "$createdAt" } }, 1] }] }

                        ]
                    },
                    count: { $sum: "$totalSalesCount" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ];

    }


}


async function getTopSellingCategoryChartData(req) {
    try {
        var id = req.params.id;
        var sales = await ProductSales.find({ sellerId: id, isActive: true })
            .select("productId")
            .populate([{
                path: "productId",
                model: Product,
                select: "category"
            }])
            .exec();
        const totalSales = sales.length;

        if (sales && sales.length > 0) {
            var categoryArr = [];

            for (var i = 0; i < sales.length; i++) {
                let id = sales[i].productId.category;
                categoryArr.push(id);
            }

            const counts = {};
            categoryArr.forEach(function(x) { counts[x] = (counts[x] || 0) + 1; });

            var sortable = [];
            var cats = [];
            for (var count in counts) {
                sortable.push([count, counts[count]]);
            }

            sortable.sort(function(a, b) {
                return b[1] - a[1];
            });

            let mylength = sortable.length;
            for (x = 0; x < mylength; x++) {
                let id = sortable[x][0];
                let category = await Category.findById(id).select('categoryName').exec();

                //console.log('category' + x, category);
                let count = sortable[x][1];
                // let per = (count / totalSales) * 100;
                // per = per.toFixed(2);
                cats.push({ id: id, name: category.categoryName, count: count });
            }

            return cats;
        } else {
            return false;
        }


    } catch (err) {
        console.log('Error', err);
        return false;
    }
}