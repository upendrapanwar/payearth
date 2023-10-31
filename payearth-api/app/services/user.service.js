const config = require('../config/index');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const Schema = mongoose.Types;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const msg = require('../helpers/messages.json');
const Webhook = require('coinbase-commerce-node').Webhook;
const { User, Seller, Coupon, Product, Wishlist, UserCoupon, Review, ProductComplaint, Order, OrderStatus, OrderTrackingTimeline, OrderCancel, OrderReturn, Payment, CryptoConversion, Savelater, Cart, OrderDetails } = require("../helpers/db");

module.exports = {
    authenticate,
    getById,
    getUserByRole,
    create,
    changePass,
    forgotPass,
    resetPass,
    getProducts,
    getProfileById,
    editProfile,
    getWishList,
    deleteWishlist,
    getSaveLaterList,
    removeProductFromWishlist, 
    removeProductFromSavelater,
    getMyCoupons,
    getNewCoupons,
    checkPayment,
    checkCoupon,
    couponStatus,
    addReview,
    addToWishlist,
    addToSaveLater,
    saveOrder,
    addToCart,
    updateToCart,
    deleteFromCart,
    socialLogin,
    getOrders,
    getOrderStatus,
    getOrderTrackingTime,
    getOrderById,
    //getUserOrderById,
    getOrderDataById,
    getOrderDetails,
    addComplaint,
    addCancel,
    addReturn,
    getPayments,
    getPaymentsById,
    getSellerByProductId,
    savepaymentdata,
    saveOrdertrackingTime,
    updateOrderStatus,
    saveorderdetails
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

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log('*** Error', err);
        } else {
            console.log('*** Success', info);
        }

    });
    return true;
}

async function create(param) {
    if (await User.findOne({ email: param.email })) {
        throw 'email "' + param.email + '" is already taken';
    }

    const user = new User({
        name: param.name,
        email: param.email,
        password: bcrypt.hashSync(param.password, 10),
        role: "user",
        purchase_type: param.purchase_type,
        isActive: true
    });

    //Email send functionality.
    const mailOptions = {
        from: config.mail_from_email, // sender address
        to: user.email,
        subject: 'Welcome Email - PayEarth',
        text: 'Welcome Email',
        html: 'Dear <b>' + user.name + '</b>,<br/> You are successfully registered.<br/> ',
    };
    sendMail(mailOptions);

    const data = await user.save();
    if (data) {

        let res = await User.findById(data.id).select("-password -community -social_accounts -reset_password -image_url -phone");

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
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
        const { password, reset_password, __v, createdAt, updatedAt, social_accounts, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ id: user.id }, config.secret, {
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
    }
}

async function socialLogin(req) {

    var param = req.body;

    var input = {
        role: "user",
        purchase_type: "retail",
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

    //check for existing user

    var whereCondition = {};

    whereCondition['$and'] = andConditon;

    if (orCondition && orCondition.length > 0) {
        whereCondition['$or'] = orCondition;
    }


    var user = await User.findOne(whereCondition);

    if (user) {
        //check for existing social login data
        var flag = 0;

        if (param.provider_type == 'google' && user.social_accounts.google.google_id == null) {
            flag = 1;
        } else
            if (param.provider_type == 'facebook' && user.social_accounts.facebook.facebook_id == null) {
                flag = 1;
            } else
                if (param.provider_type == 'twitter' && user.social_accounts.twitter.twitter_id == null) {
                    flag = 1;
                }

        if (flag === 1) {
            Object.assign(user, input);
            await user.save();
        }

        const { password, reset_password, __v, createdAt, updatedAt, social_accounts, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ id: user.id }, config.secret, {
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

        const userData = new User(input);

        const data = await userData.save();

        if (data) {
            const user = await User.findById(data.id);

            if (user) {

                //Email send functionality.
                const mailOptions = {
                    from: config.mail_from_email, // sender address
                    to: user.email, // list of receivers
                    subject: 'Welcome Email - PayEarth',
                    text: 'Welcome Email',
                    html: 'Dear <b>' + user.name + '</b>,<br/> You are successfully registered.<br/> ',
                };
                sendMail(mailOptions);

                const { password, reset_password, __v, createdAt, updatedAt, social_accounts, ...userWithoutHash } = user.toObject();
                const token = jwt.sign({ id: user.id }, config.secret, {
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

async function forgotPass(param) {
    const email = param.email;
    const user = await User.findOne({ email });

    if (user) {
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

        Object.assign(user, input);

        // Email send functionality.
        let app_url = config.app_env === "local" ? config.react_local_url : config.react_dev_url;
        let url = app_url + '?t=resetpass&u=' + user.id + '&hash=' + verif_code;
        const mailOptions = {
            from: config.mail_from_email, // sender address
            to: user.email, // list of receivers
            subject: 'Verification link generated for reset password.',
            text: 'Verification link',
            html: 'Dear <b>' + user.name + '</b>,<br/> password reset verification link is - <a href="' + url + '" target="_blank"><b>' + url + ' </b></a><br/> It will expire in ' + config.verif_min + ' minutes.',
        };
        sendMail(mailOptions);

        const data = await user.save();

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
    const user = await User.findById(id);
    const now = new Date();

    if (user && user.reset_password.verif_code == param.code && user.reset_password.code_valid_at >= now) {
        var verif_code = '';
        var code_valid_at = null;
        var is_pass_req = false;

        if (param.password === param.password_confirmation) {
            var password = bcrypt.hashSync(param.password, 10);
        } else {
            throw msg.user.password.confirm_pass_err;
        }

        const input = {
            "reset_password": {
                "code_valid_at": code_valid_at,
                "verif_code": verif_code,
                "is_pass_req": is_pass_req
            },
            "password": password,
        };

        Object.assign(user, input);

        const data = await user.save();

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
    const user = await User.findById(id).select("-password");
    if (!user) return false;
    return user;
}

async function getUserByRole(param) {
    //console.log(param.id.payload.id)
    
    //const user = await User.findOne({ _id: param.id, role: param.role });
    const user = await User.findOne({ _id: param.id.payload.id, role: param.role });
    if (!user) return false;
    return user;
}

async function changePass(id, param) {
    if (!param) throw msg.common.invalid;

    const user = await User.findById(id);

    if (!user) {
        return false;
    } else {
        //check old password
        // if (bcrypt.compareSync(param.old_password, user.password)) {
        if (param.password === param.password_confirmation) {
            param.password = bcrypt.hashSync(param.password, 10);
        } else {
            throw msg.user.password.confirm_pass_err;
        }
        Object.assign(user, { password: param.password });
        await user.save();
        return user;
        // } else {
        //     throw msg.user.password.old_pass_err;
        // }
    }
}

async function getProducts() {
    const result = await Product.find({ isActive: true })
        .select("id name price images avgRating isService quantity")
        .populate([{
            path: "cryptoPrices",
            model: CryptoConversion,
            select: "name code cryptoPriceUSD",
            match: { isActive: true, asCurrency: true }
        }])
        .sort({ createdAt: 'desc' });
    if (result && result.length > 0) return result;
    return false;
}

async function getProfileById(id) {
    const user = await User.findById(id).select("id name email role purchase_type community");
    if (!user) return false;
    return user;
}

async function editProfile(id, param) {

    if (!param) throw msg.common.invalid;

    const user = await User.findById(id);

    if (!user) {
        return false;
    } else {

        if (user.email !== param.email && (await User.findOne({ email: param.email }))) {
            throw 'Email "' + param.email + '" already exists.';
        }

        const input = {
            "name": param.name,
            "email": param.email,
            "role": param.role,
            "purchase_type": param.purchase_type,
        };

        Object.assign(user, input);

        if (await user.save()) {
            return await User.findById(id).select("id name email role purchase_type community");
        } else {
            return false;
        }
    }
}

async function getWishList(req) {
    try {

        var param = req.body;
        var id = req.params.id;
        var sortOption = { createdAt: 'desc' }; //default
        var limit = '';
        var skip = '';
        var whereCondition = { userId: id, isActive: true };

        if (param.count) {
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.start);
        }

        const wishlist = await Wishlist.find(whereCondition)
            .select("id productId userId isActive")
            .limit(limit)
            .skip(skip)
            .sort(sortOption)
            .populate([{
                path: "productId",
                model: Product,
                select: "id name price featuredImage avgRating isService isActive quantity",
                populate: {
                    path: "cryptoPrices",
                    model: CryptoConversion,
                    select: "name code cryptoPriceUSD",
                    match: { isActive: true, asCurrency: true }
                }
            }]);

        if (wishlist && wishlist.length > 0) {

            //to get count of total wishlists
            const totalWishlists = await Wishlist.find(whereCondition).countDocuments();

            const result = {
                totalWishlists: totalWishlists,
                wishlist: wishlist
            };
            return result;
        }
        return false;
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getSaveLaterList(req) {
    try {

        var param = req.body;
        var id = req.params.id;
        var sortOption = { createdAt: 'desc' }; //default
        var limit = '';
        var skip = '';
        var whereCondition = { userId: id, isActive: true };

        if (param.count) {
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.start);
        }

        const savelater = await Savelater.find(whereCondition)
            .select("id productId userId isActive")
            .limit(limit)
            .skip(skip)
            .sort(sortOption)
            .populate([{
                path: "productId",
                model: Product,
                select: "id name price featuredImage avgRating isService isActive quantity",
                populate: {
                    path: "cryptoPrices",
                    model: CryptoConversion,
                    select: "name code cryptoPriceUSD",
                    match: { isActive: true, asCurrency: true }
                }
            }]);

        if (savelater && savelater.length > 0) {

            //to get count of total savelater
            const totalSaveLaterlists = await Savelater.find(whereCondition).countDocuments();

            const result = {
                totalSaveLaterlists: totalSaveLaterlists,
                savelater: savelater
            };
            return result;
        }
        return false;
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function deleteWishlist(id) {
    const wishlist = await Wishlist.findById(id);

    if (!wishlist) return false;

    return await Wishlist.findByIdAndRemove(id);
}


async function removeProductFromWishlist(req) {

    const param = req.body;

    const wishlist = await Wishlist.findOne({ productId: param.product_id, userId: param.user_id }).exec();

    if (!wishlist) return false;

    return await Wishlist.findByIdAndRemove(wishlist._id);
}

async function removeProductFromSavelater(req) {

    const param = req.body;

    const savelater = await Savelater.findOne({ productId: param.product_id, userId: param.user_id }).exec();

    if (!savelater) return false;

    return await Savelater.findByIdAndRemove(savelater._id);
}

async function getMyCoupons(req) {
    try {

        var param = req.body;
        var id = req.params.id;
        var sortOption = { createdAt: 'desc', isActive: 'desc' }; //default
        var limit = '';
        var skip = '';
        var whereCondition = { userId: id, isActive: true };

        if (param.count) {
            limit = parseInt(param.count.limit);
            skip = parseInt(param.count.start);
        }
        var now = new Date();
        const coupons = await UserCoupon.find(whereCondition)
            .select("id couponId userId isActive")
            .limit(limit)
            .skip(skip)
            .sort(sortOption)
            .populate("couponId", "code discount_per start end", { isActive: true });

        if (coupons && coupons.length > 0) {

            //to get count of available coupons
            const availableCoupons = await UserCoupon.find({ isActive: true, userId: id })
                .limit(limit)
                .skip(skip)
                .sort(sortOption)
                .countDocuments(); //not expired

            //to get count of total coupons
            const totalCoupons = await UserCoupon.find(whereCondition).countDocuments(); // all coupons      

            const result = {
                totalCoupons: totalCoupons,
                availableCoupons: availableCoupons,
                coupons: coupons
            };
            return result;
        }
        return false;
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}
async function getNewCoupons(req) {
    try {
        let now = new Date();
        var param = req.body;
        var whereCondition = { end: { $gte: now } }; //default
        const result = await Coupon.paginate(whereCondition)
            .then((data) => {
                let res = {
                    coupons: data.docs
                };
                return res;
            });
        if (result.coupons && result.coupons.length > 0) {
            return result;
        } else {
            return false;
        }
        console.log('its checking')
    } catch (err) {
        console.log('Error', err);
        console.log('Cpouon is Expired or Code is not match')
        return false;
    }
}//end getNewCoupon


function rawBody(req, res, next) {
    req.setEncoding('utf8');

    var data = '';

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {
        req.rawBody = data;

        next();
    });
}
// start checkPayment
async function checkPayment(request, response) {
    var event;
    const webhookSecret = '35b12217-47b7-4b0d-aa4d-d48f0c56fc2e';
   
    rawBody()
    try {
        event = Webhook.verifyEventBody(
            request.rawBody,
            request.headers['x-cc-webhook-signature'],
            webhookSecret
        );
    } catch (err) {
        console.log('Error', err);
        console.log('Cpouon is Expired or Code is not match')
        return false;
    }
}//end checkPayment


//check Coupon
async function checkCoupon(req) {
    let now = new Date();
    var param = req.body;
    var couponCode = param.data;
    let use_id = param.user_id
    var whereCondition = { end: { $gte: now }, isActive: true, code: couponCode }; //default

    try {
        var res = '';
        var result = '';
        if (await Coupon.findOne(whereCondition)) {
            result = await Coupon.updateOne({ code: couponCode }, { $set: { isActive: false, user_id: use_id } })

            if (await Coupon.findOne({ end: { $gte: now }, code: couponCode })) {
                result = await Coupon.paginate({ code: couponCode })
                    .then((data) => {
                        res = {
                            coupons: data.docs
                        };
                        return res;
                    });
            }


            if (result.coupons && result.coupons.length > 0) {
                return result;
            } else {
                return false;
                console.log('data is not found')
            }
        } else {
            console.log('this coupon has already used by user')
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }

}


//coupon status
async function couponStatus(req) {
    let now = new Date();
    var param = req.body;
    var couponCode = param.data;
    let use_id = param.user_id

    //update table
    if (await Coupon.findOne({ end: { $gte: now }, code: couponCode })) {
        await Coupon.updateOne({ code: couponCode }, { $set: { isActive: false, user_id: use_id } })

    }//update table
    try {
        const result = await Coupon.paginate({ end: { $gte: now }, code: couponCode, isActive: false })
            .then((data) => {
                let res = {
                    coupon: data.docs
                }
                return res
            });
        if (result.coupon && result.coupon.length > 0) {
            return result
        } else {
            return false
        }
    } catch (err) {
        console.log(err)
        console.log('couponStatus is not responding')
    }
}

async function addToWishlist(req) {

    const param = req.body;

    if (await Wishlist.findOne({ productId: param.product_id, userId: param.user_id })) {
        throw 'This item is already added in wishlist.';
    }

    let input = {
        productId: param.product_id,
        userId: param.user_id,
        isActive: true
    };

    const wishlist = new Wishlist(input);

    const data = await wishlist.save();

    if (data) {
        let result = await Wishlist.findById(data.id).select();
        if (result) {
            return result;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

async function addToSaveLater(req) {
    const param = req.body;

    if (await Savelater.findOne({ productId: param.product_id, userId: param.user_id })) {
        throw 'This item is already added in savelater.';
    }

    let input = {
        productId: param.product_id,
        userId: param.user_id,
        isActive: true
    };

    const savelater = new Savelater(input);

    const data = await savelater.save();

    if (data) {

        let result = await Savelater.findById(data.id).select();
        if (result) {
            return result;
        } else {
            return false;
        }
    } else {
        return false;
    }

}
async function saveOrder(req) {
    try {
        const param = req.body;

        let input = {
            userId:                param.userId,
            productId:             param.productId,
            paymentId:             param.paymentId,
            sellerId:              param.sellerId,
            price:                 param.price, 
            product_sku:           param.product_sku,
            billingFirstName:      param.billingFirstName,
            billingLastName:       param.billingLastName,
            billingCompanyName:    param.billingCompanyName,
            billingCounty:         param.billingCounty,
            billingStreetAddress:  param.billingStreetAddress,
            billingStreetAddress1: param.billingStreetAddress1,
            billingCity:           param.billingCity,
            billingCountry:        param.billingCountry,
            billingPostCode:       param.billingPostCode,
            billingPhone:          param.billingPhone,
            billingEmail:          param.billingEmail,
            billingNote:           param.billingNote,
            deliveryCharge:        param.deliveryCharge,
            taxPercent:            param.taxPercent,
            taxAmount:             param.taxAmount,
            discount:              param.discount, 
            total:                 param.total,
            orderStatus:           param.orderStatus,
            isActive:              param.isActive,
            isService:             param.isService
        };

        const orderItem = new Order(input);

        const data = await orderItem.save();


        if (data) {
            //console.log(data);
            return data._id;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}
async function addToCart(req) {

    try {
        const param = req.body;

        let input = {
            userId: param.user_id,
            products: [{
                productId: param.productId,
                qty: param.qty,
                price: param.price
            }],
        };

        const cartItem = new Cart(input);

        const data = await cartItem.save();


        if (data) {

            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }

}
async function updateToCart(req) {
    try {
        var param = req.body;
        let input = {
            userId: param.user_id,
            products: [{
                productId: param.productId,
                qty: param.qty,
                price: param.price
            }],
        };

        await Cart.findOneAndDelete({ userId: param.user_id, productId: param.productId });
        const cartItem = new Cart(input);

        const data = await cartItem.save();
        if (data) {

            return true;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}
async function deleteFromCart(req) {
    try {
        var param = req.body;
        const data = await Cart.findOneAndDelete({ userId: param.user_id, productId: param.productId });
        if (data) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getOrders(req) {
    try {

        var param = req.body;
        var id = req.params.id; //user id
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 10;
        var skip = 0;
        var whereCondition = { userId: id, isActive: true };

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
                select: "id name price featuredImage isService isActive",
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
                path: "paymentId",
                model: Payment,
                select: "paymentMode amountPaid invoiceNo paymentAccount invoiceUrl"
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

async function getOrderStatus() {
    try {
        const result = await OrderStatus.find({ isActive: true })
        .sort({ createdAt: 'desc' });
        if (result && result.length > 0) return result;
        return false;
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getOrderTrackingTime() {
    try {
        const result = await OrderTrackingTimeline.find({ isActive: true })
        .sort({ createdAt: 'desc' });
        if (result && result.length > 0) return result;
        return false;
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getOrderById(id) {
    const order = await Order.findById(id).select('id orderCode productId userId amount quantity isActive orderStatus createdAt')
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
            .sort({ createdAt: 'asc' })
            .populate("orderStatusId", "id lname title", { isActive: true });

        //get payment data
        let payment = await Payment.findOne({ orderId: order.id, userId: order.userId._id })
            .select("invoiceNo invoiceUrl").exec();

        //get review data
        let reviewData = await Review.findOne({ productId: order.productId._id, userId: order.userId._id })
            .select("rating review reviewImages isActive").exec();

        //get complaint data
        let complaintData = await ProductComplaint.findOne({ orderId: order.id, productId: order.productId._id, userId: order.userId._id }).select("rating complaint complaintImages isActive").exec();

        let result = {
            order: order,
            orderTimeline: orderTimeline,
            invoice: payment,
            reviewData: reviewData,
            complaintData: complaintData
        };
        return result;
    }

}
/*
async function getUserOrderById(id) {
    const order = await Order.findById(id).select('id orderCode productId userId amount quantity isActive orderStatus createdAt')
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
            .sort({ createdAt: 'asc' })
            .populate("orderStatusId", "id lname title", { isActive: true });

        //get payment data
        let payment = await Payment.findOne({ orderId: order.id, userId: order.userId._id })
            .select("invoiceNo invoiceUrl").exec();

        //get review data
        let reviewData = await Review.findOne({ productId: order.productId._id, userId: order.userId._id })
            .select("rating review reviewImages isActive").exec();

        //get complaint data
        let complaintData = await ProductComplaint.findOne({ orderId: order.id, productId: order.productId._id, userId: order.userId._id }).select("rating complaint complaintImages isActive").exec();

        let result = {
            order: order,
            orderTimeline: orderTimeline,
            invoice: payment,
            reviewData: reviewData,
            complaintData: complaintData
        };
        return result;
    }

}*/
/**
 * Get order details by order id
 * 
 * @param {*} req 
 * @returns ObjectArray|boolean
 */
async function getOrderDataById(req) {
    try {
        let result = await Order.findById(req).select('orderCode product_sku price paymentId sellerId billingFirstName billingLastName billingCompanyName billingCounty billingStreetAddress billingStreetAddress1 billingCity billingCountry billingPostCode billingPhone billingEmail billingNote deliveryCharge taxPercent taxAmount discount orderStatus productId userId createdId')
        .populate({
            path: 'productId.productId',
            model: Product,
            select: ('productId name')
        })
        .populate({
            path: 'orderStatus',
            Model: OrderTrackingTimeline,
            populate:({
                path: 'orderStatusId',
                model: OrderStatus,
                select: 'lname'
            })
        })
        if (result) {
            return result;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getOrderDetails(id) {
    try {
        let result = await OrderDetails.find({userId: id})
        .select('orderId productId quantity price userId sellerId createdAt')
        .populate({
            path:'orderId',
            model: Order,
            select:'orderCode billingFirstName billingLastName billingCompanyName billingCounty billingStreetAddress billingStreetAddress1 billingCity billingCountry billingPostCode billingPhone billingEmail billingNote deliveryCharge taxPercent taxAmount discount',
            populate:({
                path:'orderStatus',
                model: OrderTrackingTimeline,
                populate:({
                    path:'orderStatusId',
                    model:OrderStatus,
                    select:'title'
                })

            })
        })
        .populate({
            path: 'productId',
            model: Product,
            select: ('name')
        })
        
        if (result) {
            return result;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getOrderDetails(id) {
    try {
        const orders = await Order.find({ userId: id })
            .select('orderCode price paymentId billingFirstName billingLastName billingCompanyName billingCounty billingStreetAddress billingStreetAddress1 billingCity billingCountry billingPostCode billingPhone billingEmail billingNote deliveryCharge taxPercent taxAmount discount orderStatus total createdAt')
            .populate([
                {
                        path: 'orderStatus',
                        model: OrderStatus,
                        select: 'title'
                }, 
                {
                    path: 'paymentId',
                    model: Payment,
                    select: 'invoiceNo amountPaid paymentMode paymentAccount createdAt paymentStatus'
                },
            ])


        // Collect all orderIds
        const orderIds = orders.map(order => order._id);

        const orderDetails = await OrderDetails.find({ orderId: { $in: orderIds } })
            .populate({
                path: 'productId',
                model: Product,
                select: 'name',
            })
            .populate({
                path: 'sellerId',
                model: Seller,
                select: 'name email phone full_address',
            });
            

        // Create a map to associate orderIds with their corresponding product data
        const orderDetailsMap = {};
        orderDetails.forEach(detail => {
            if (!orderDetailsMap[detail.orderId]) {
                orderDetailsMap[detail.orderId] = [];
            }
            orderDetailsMap[detail.orderId].push(detail);
        });

        // Create an array of results, each containing order and product data
        const result = orders.map(order => {
            const orderId = order._id;
            if (orderDetailsMap[orderId]) {
                return {
                    order: order,
                    orderDetails: orderDetailsMap[orderId]
                };
            } else {
                return {
                    order: order,
                    orderDetails: []
                };
            }
        });

        return {
            data: result
        };
    } catch (err) {
        console.log('Error:', err);
        return {
            status: false,
            data: "An error occurred while fetching data."
        };
    }
}




/**************************************************************************/
/**************************************************************************/

async function addReview(req) {

    try {

        const files = req.files;

        const param = req.body;
        var imagesArr = [];

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let url = files[i].destination + "/" + files[i].filename;
                imagesArr.push(url);
            }
        }

        var rating = parseInt(param.rating);

        var input = {
            productId: param.product_id,
            userId: param.user_id,
            review: {
                title: param.title,
                description: param.description
            },
            reviewImages: imagesArr,
            rating: rating,
        };

        //get product detail
        var product = await Product.findById(param.product_id).select().exec();

        var totalRatingScore;
        var NewReviewCount;
        var avgRating;
        var updateData;
        var review;
        var data;

        //check for existing entry
        const reviewData = await Review.findOne({ productId: param.product_id, userId: param.user_id }).exec();

        if (reviewData) {
            //existing review
            review = reviewData;

            input['updatedAt'] = new Date().toISOString();

            if (files.length === 0) { //if no image is selected then old images will stay remain.
                input['reviewImages'] = review.reviewImages;
            }

            //product data
            totalRatingScore = (parseFloat(product.totalRatingScore) - parseInt(review.rating)) + rating; //subtract old rating and add new rating
            NewReviewCount = parseInt(product.reviewCount); //reviewCount will be same for edit
            avgRating = totalRatingScore / NewReviewCount;
            updateData = { totalRatingScore: totalRatingScore, avgRating: avgRating }; //only new totalRatingScore and Average rating updated value.

            Object.assign(review, input);

            //save review data
            data = await review.save();

        } else {
            //product data 
            totalRatingScore = parseFloat(product.totalRatingScore) + rating; //add only new rating
            NewReviewCount = parseInt(product.reviewCount) + 1; //add +1 count
            avgRating = totalRatingScore / NewReviewCount;

            //new review 
            review = new Review(input);
            //save review data
            data = await review.save();

            updateData = { $push: { reviews: data.id }, $inc: { reviewCount: 1, totalRatingScore: rating }, avgRating: avgRating }; //push new entry in reviews, reviewCount increment, totalRatingScore icrement, Average rating updated value.

        }

        if (data) {

            //update in product reviews
            const filter = { _id: param.product_id };
            await Product.findOneAndUpdate(filter, updateData, { new: true });

            let result = await Review.findById(data.id).select();

            if (result) {
                return result;
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

async function addComplaint(req) {

    const files = req.files;
    const param = req.body;
    var imagesArr = [];

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            let url = files[i].destination + "/" + files[i].filename;
            imagesArr.push(url);
        }
    }

    let input = {
        orderId: param.order_id,
        productId: param.product_id,
        userId: param.user_id,
        complaint: {
            title: param.title,
            description: param.description
        },
        complaintImages: imagesArr,
        //isActive: false
    };

    const complaint = new ProductComplaint(input);

    const data = await complaint.save();

    if (data) {
        return await ProductComplaint.findById(data.id).select();
    } else {
        return false;
    }
}


async function addCancel(req) {

    const files = req.files;
    const param = req.body;
    var imagesArr = [];

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            let url = files[i].destination + "/" + files[i].filename;
            imagesArr.push(url);
        }
    }

    let input = {
        orderId: param.order_id,
        productId: param.product_id,
        userId: param.user_id,
        cancel: {
            title: param.title,
            description: param.description
        },
        cancelImages: imagesArr,
        isActive: false
    };

    const cancel = new OrderCancel(input);

    const data = await cancel.save();

    if (data) {

        //get id of order status
        const orderStatus = await OrderStatus.findOne({ "lname": "cancel_request" }).select("id").exec();

        //add new entry in order tracking timeline

        const timeline = new OrderTrackingTimeline({
            orderId: param.order_id,
            orderStatusId: orderStatus._id
        });

        const timelineData = await timeline.save();

        //update in order
        await Order.findOneAndUpdate({ _id: param.order_id }, { orderStatus: timelineData._id }, { new: true });

        return await OrderCancel.findById(data.id).select();
    } else {
        return false;
    }
}


async function addReturn(req) {

    const files = req.files;
    const param = req.body;
    var imagesArr = [];

    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            let url = files[i].destination + "/" + files[i].filename;
            imagesArr.push(url);
        }
    }

    let input = {
        orderId: param.order_id,
        productId: param.product_id,
        userId: param.user_id,
        return: {
            title: param.title,
            description: param.description
        },
        returnImages: imagesArr,
        isActive: false
    };

    const returnOrder = new OrderReturn(input);

    const data = await returnOrder.save();

    if (data) {

        //get id of order status
        const orderStatus = await OrderStatus.findOne({ "lname": "return_request" }).select("id").exec();

        //add new entry in order tracking timeline

        const timeline = new OrderTrackingTimeline({
            orderId: param.order_id,
            orderStatusId: orderStatus._id
        });

        const timelineData = await timeline.save();

        //update in order
        await Order.findOneAndUpdate({ _id: param.order_id }, { orderStatus: timelineData._id }, { new: true });

        return await OrderReturn.findById(data.id).select();
    } else {
        return false;
    }
}

async function getPaymentsById(id) {
    try {
        const payments = await Payment.find({ userId: id })
        .select('invoiceNo orderId userId amountPaid paymentMode paymentAccount createdAt')
        .populate({
            path: 'orderId',
            modal: Order,
            select: 'billingCompanyName deliveryCharge taxAmount discount price'
        })
        .populate([{
            path: 'userId',
            model: User,
            select: 'name email'
        }])
        
        if (!payments) {
            console.log('User not found');
            return false;
        }

        return payments;
    } catch (error) {
        console.error('Error fetching user payments:', error);
        return false;
    }
}

    
async function getPayments(req) {
    try {

        var param = req.body;
        var id = req.params.id; //user id
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { userId: id, isActive: true };

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
            select: 'id invoiceNo orderId userId amountPaid paymentMode invoiceUrl isActive',
            sort: sortOption,
            populate: [{
                path: "orderId",
                model: Order,
                select: "id productId",
                populate: {
                    path: "productId",
                    model: Product,
                    select: "id name isService",
                    populate: {
                        path: "cryptoPrices",
                        model: CryptoConversion,
                        select: "name code cryptoPriceUSD",
                        match: { isActive: true, asCurrency: true }
                    }
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

/**
 * Get seller by product id
 * 
 * @param id
 * @returns sellerid|null 
 */
async function getSellerByProductId(id) {
    
    try {
        const result = await Product.findOne({_id: id}).select("createdBy").exec();
        var createBy = result.createdBy;
        if (typeof result.createdBy != 'undefined') {
            return createBy.valueOf();
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}
/************************************************************************************/
/************************************************************************************/

async function savepaymentdata(req) {
    try {
        var param = req.body;
       
        let input;
        param.map( result => {
            input = {
                userId:         result.userId,
                sellerId:       result.sellerId,
                amountPaid:     result.amountPaid,
                paymentMode:    result.paymentMode,
                paymentAccount: result.paymentAccount,
                invoiceUrl:     result.invoiceUrl,
                paymentStatus:  result.paymentStatus,
                isActive:       true
            };
       });
        const payment = new Payment(input);
        
        const data = await payment.save();
        if (data) {
            console.log(data._id);
            return data._id;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error',err);
        return false;
    }
}
/************************************************************************************/
/************************************************************************************/
async function saveOrdertrackingTime(req) {
    try {
        var param = req.body;
       
        let input;
        //console.log(param);
        input = {
            orderId:       param.orderId,
            orderStatusId: param.orderStatusId,
            isActive:      true
        };
       
        const orderTrackTimeLine = new OrderTrackingTimeline(input);
        
        const data = await orderTrackTimeLine.save();
        if (data) {
            //console.log(data._id);
            return data._id;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error',err);
        return false;
    }
}
/************************************************************************************/
/************************************************************************************/
async function saveorderdetails(req) {
    try {
        var param = req.body;
        const options = { ordered: true };
        let input;
        
        input = {
            orderId:   param.orderId,
            productId: param.productId,
            isActive:  true
        };
        
        //const OrderDetails = new OrderDetails();
        //const data = await OrderDetails.save();
        const data = await OrderDetails.insertMany(param, options);
        if (data) {
            console.log('id=',data);
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log('Error',err);
        return false;
    }
}
/************************************************************************************/
/************************************************************************************/

async function updateOrderStatus(req) {
    try {
        var param = req.body;
        console.log('_id='+param.orderId);
        console.log('order_status='+param.orderStatus);
        //update in order
        await Order.findOneAndUpdate({ _id: param.orderId }, { orderStatus: param.orderStatus }, { new: true });
        return true;
    } catch (err) {
        console.log('Error',err);
        return false;
    }
}
/************************************************************************************/
/************************************************************************************/