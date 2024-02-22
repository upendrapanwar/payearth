﻿const config = require('../config/index');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const Schema = mongoose.Types;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const msg = require('../helpers/messages.json');
const Webhook = require('coinbase-commerce-node').Webhook;
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var SDKConstants = require('authorizenet').Constants;
const fs = require('fs');
const stripe = require('stripe')('sk_test_51OewZgD2za5c5GtO7jqYHLMoDerwvEM69zgVsie3FNLrO0LLSLwFJGzXv4VIIGqScWn6cfBKfGbMChza2fBIQhsv00D9XQRaOk');

const { User, Seller, Coupon, Product, Wishlist, UserCoupon, Review, ProductComplaint, Order, OrderStatus, OrderTrackingTimeline, OrderCancel, OrderReturn, Payment, CryptoConversion, Savelater, Cart, OrderDetails, bannerAdvertisement } = require("../helpers/db");

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
    saveorderdetails,
    createUserBanner,
    getBannersByUserId,
    deleteBanner,
    getBannerById,
    updateBanner,
    bannerPayment,
    customerAuthorizePayment,
    createSubscription

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
            userId: param.userId,
            productId: param.productId,
            paymentId: param.paymentId,
            sellerId: param.sellerId,
            price: param.price,
            product_sku: param.product_sku,
            billingFirstName: param.billingFirstName,
            billingLastName: param.billingLastName,
            billingCompanyName: param.billingCompanyName,
            billingCounty: param.billingCounty,
            billingStreetAddress: param.billingStreetAddress,
            billingStreetAddress1: param.billingStreetAddress1,
            billingCity: param.billingCity,
            billingCountry: param.billingCountry,
            billingPostCode: param.billingPostCode,
            billingPhone: param.billingPhone,
            billingEmail: param.billingEmail,
            billingNote: param.billingNote,
            deliveryCharge: param.deliveryCharge,
            taxPercent: param.taxPercent,
            taxAmount: param.taxAmount,
            discount: param.discount,
            total: param.total,
            orderStatus: param.orderStatus,
            isActive: param.isActive,
            isService: param.isService
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
                populate: ({
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
        let result = await OrderDetails.find({ userId: id })
            .select('orderId productId quantity price userId sellerId createdAt')
            .populate({
                path: 'orderId',
                model: Order,
                select: 'orderCode billingFirstName billingLastName billingCompanyName billingCounty billingStreetAddress billingStreetAddress1 billingCity billingCountry billingPostCode billingPhone billingEmail billingNote deliveryCharge taxPercent taxAmount discount',
                populate: ({
                    path: 'orderStatus',
                    model: OrderTrackingTimeline,
                    populate: ({
                        path: 'orderStatusId',
                        model: OrderStatus,
                        select: 'title'
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
        const result = await Product.findOne({ _id: id }).select("createdBy").exec();
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
        param.map(result => {
            input = {
                userId: result.userId,
                sellerId: result.sellerId,
                amountPaid: result.amountPaid,
                paymentMode: result.paymentMode,
                paymentAccount: result.paymentAccount,
                invoiceUrl: result.invoiceUrl,
                paymentStatus: result.paymentStatus,
                isActive: true
            };
        });
        const payment = new Payment(input);

        const data = await payment.save();
        if (data) {
            // console.log(data._id);
            return data._id;
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
async function saveOrdertrackingTime(req) {
    try {
        var param = req.body;

        let input;
        //console.log(param);
        input = {
            orderId: param.orderId,
            orderStatusId: param.orderStatusId,
            isActive: true
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
        console.log('Error', err);
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
            orderId: param.orderId,
            productId: param.productId,
            isActive: true
        };

        //const OrderDetails = new OrderDetails();
        //const data = await OrderDetails.save();
        const data = await OrderDetails.insertMany(param, options);
        if (data) {
            console.log('id=', data);
            return true;
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

async function updateOrderStatus(req) {
    try {
        var param = req.body;
        console.log('_id=' + param.orderId);
        console.log('order_status=' + param.orderStatus);
        //update in order
        await Order.findOneAndUpdate({ _id: param.orderId }, { orderStatus: param.orderStatus }, { new: true });
        return true;
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}
/************************************************************************************/
/************************************************************************************/

// POST API CREATE NEW BANNER....................................

async function createUserBanner(req, res) {
    try {
        var param = req.body;
        let input = {
            image: param.image,
            imageId: param.imageId,
            video: param.video,
            videoId: param.videoId,
            bannerText: param.bannerText,
            bannerType: param.bannerType,
            bannerName: param.bannerName,
            siteUrl: param.siteUrl,
            category: param.category,
            startDate: param.startDate,
            endDate: param.endDate,
            subscriptionPlan: param.subscriptionPlan,
            bannerPlacement: param.bannerPlacement,
            status: param.status,
            tag: param.tag,
            keyword: param.keyword,
            author: param.author
        };
        const banner = new bannerAdvertisement(input);
        const data = await banner.save();
        // console.log("RES data", data)
        if (data) {
            // console.log(data._id);
            return data;
        }
        return false;
    } catch (error) {
        console.log('Error', error);
    }
}


// GET BANNER DATA BY USER id..........................

async function getBannersByUserId(req) {
    const userId = req.params.id;
    // console.log("userID Author", userId)
    try {
        const result = await bannerAdvertisement.find({ author: userId }).select().sort({ createdAt: 'desc' });
        return result
    } catch (error) {
        console.log(error);
    }
}


// DELETE BANNER 

async function deleteBanner(req) {
    const bannerId = req.params.id;
    // console.log("delete banner", bannerId)
    try {
        const result = await bannerAdvertisement.deleteOne({ _id: bannerId })
        return result
    } catch (error) {
        console.log(error);
    }
}

 
// ByID
async function getBannerById(req) {
    const bannerId = req.params.id;
    try {
        const result = await bannerAdvertisement.find({ _id: bannerId })
        return result
    } catch (error) {
        console.log(error);
    }
}

// Update Page
async function updateBanner(req) {
    const bannerId = req.params.id;
    const { image, video, bannerText, bannerName, bannerType, siteUrl, category, bannerPlacement, startDate } = req.body;
    try {
        const banner = await bannerAdvertisement.findByIdAndUpdate(bannerId, { image, video, bannerText, bannerName, bannerType, siteUrl, category, startDate, bannerPlacement }, { new: true });
        //  console.log("update banner", banner)
        return banner;
    } catch (error) {
        console.log(error)
    }
}

// Authorize.net paymenet getway intrigation example........................

const API_LOGIN_ID = '7e44GKHmR3b';
const TRANSACTION_KEY = '9d3H2z8X27PeD6Sh';


async function bannerPayment(req) {
    const amount = req.body.amount;
    const planName = req.body.planName;
    const cardNumber = req.body.cardNumber;
    const expiryDate = req.body.expiryDate;

    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 30);
    const startDate = futureDate.toISOString().substring(0, 10);
    console.log("start Date 30 days after", startDate)
    console.log("amount CHECK", amount)
    console.log("cardNumber", cardNumber)

    const randomString = Math.floor((Math.random() * 100000) + 1)

    // fs.readFile(filePath, 'utf8', (err, data) => {
    //     if (err) {
    //         console.error('Error reading from file:', err);
    //     } else {
    //         // Parse JSON data
    //         const retrievedData = JSON.parse(data);
    //         console.log('Retrieved data:', retrievedData);
    //     }
    // });

    try {

        var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType
        merchantAuthenticationType.setName(API_LOGIN_ID);
        merchantAuthenticationType.setTransactionKey(TRANSACTION_KEY);

        var interval = new ApiContracts.PaymentScheduleType.Interval();
        interval.setLength(1);
        interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);

        var paymentScheduleType = new ApiContracts.PaymentScheduleType();
        paymentScheduleType.setInterval(interval);
        paymentScheduleType.setStartDate(startDate);
        paymentScheduleType.setTotalOccurrences(5);
        paymentScheduleType.setTrialOccurrences(0);

        var creditCard = new ApiContracts.CreditCardType();
        creditCard.setExpirationDate(expiryDate);
        creditCard.setCardNumber(cardNumber);

        var payment = new ApiContracts.PaymentType();
        payment.setCreditCard(creditCard);

        var orderType = new ApiContracts.OrderType();
        orderType.setInvoiceNumber("");
        orderType.setDescription("");

        var customer = new ApiContracts.CustomerType();
        customer.setType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
        customer.setId(randomString);
        customer.setEmail("");
        customer.setPhoneNumber('1232122122');
        customer.setFaxNumber('1232122122');
        customer.setTaxId('911011011');

        var nameAndAddressType = new ApiContracts.NameAndAddressType();
        nameAndAddressType.setFirstName("");
        nameAndAddressType.setLastName('LName');
        nameAndAddressType.setCompany('Company');
        nameAndAddressType.setAddress('Address');
        nameAndAddressType.setCity('City');
        nameAndAddressType.setState('State');
        nameAndAddressType.setZip('98004');
        nameAndAddressType.setCountry('USA');

        var arbSubscription = new ApiContracts.ARBSubscriptionType();
        arbSubscription.setName(planName);
        arbSubscription.setPaymentSchedule(paymentScheduleType);
        arbSubscription.setAmount(amount);
        arbSubscription.setTrialAmount(0.00);
        arbSubscription.setPayment(payment);
        arbSubscription.setOrder(orderType);
        arbSubscription.setCustomer(customer);
        arbSubscription.setBillTo(nameAndAddressType);
        arbSubscription.setShipTo(nameAndAddressType);

        console.log("arbSubscription", arbSubscription)

        var createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
        createRequest.setMerchantAuthentication(merchantAuthenticationType);
        createRequest.setSubscription(arbSubscription);
        // createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
        // console.log("createRequest Check :", JSON.stringify(createRequest.getJSON(), null, 2));



        var ctrl = new ApiControllers.ARBCreateSubscriptionController(createRequest.getJSON());
        console.log("ctrl", ctrl)
        ctrl.execute(function () {
            var apiResponse = ctrl.getResponse();
            console.log("api Response", apiResponse)
            var response = new ApiContracts.ARBCreateSubscriptionResponse(apiResponse);
            console.log("response ::::::", JSON.stringify(response, null, 2));

            if (response != null) {
                if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                    console.log('Subscription Id : ' + response.getSubscriptionId());
                    console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
                    console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
                }
                else {
                    console.log('Result Code: ' + response.getMessages().getResultCode());
                    console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                    console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                }
            }
            else {
                console.log('Null Response.');
            }
            // callback(response);
            console.log("response", response)
            return response
        });
    } catch (error) {

        console.log("error :")
        conole.log("error : ", error)
        //res.status(500).json({ success: false, error: error.message });
    }
}


// *******************************************************************************
// *******************************************************************************
// *******************************************************************************


// To generate customer ID.....

async function customerAuthorizePayment(req) {
    const amount = req.body.amount;
    const planName = req.body.planName;
    const cardNumber = req.body.cardNumber;
    const expiryDate = req.body.expiryDate;


    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 30);
    const startDate = futureDate.toISOString().substring(0, 10);
    console.log("start Date 30 days after", startDate)


    try {

        var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
        merchantAuthenticationType.setName(API_LOGIN_ID);
        merchantAuthenticationType.setTransactionKey(TRANSACTION_KEY);

        var creditCard = new ApiContracts.CreditCardType();
        creditCard.setCardNumber('4242424242424242');
        creditCard.setExpirationDate('1226');

        var paymentType = new ApiContracts.PaymentType();
        paymentType.setCreditCard(creditCard);

        var customerPaymentProfileType = new ApiContracts.CustomerPaymentProfileType();
        customerPaymentProfileType.setCustomerType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
        customerPaymentProfileType.setPayment(paymentType);

        var paymentProfilesList = [];
        paymentProfilesList.push(customerPaymentProfileType);

        var customerProfileType = new ApiContracts.CustomerProfileType();
        customerProfileType.setMerchantCustomerId('M_' + Math.floor((Math.random() * 100000) + 1));
        customerProfileType.setDescription('Profile description here');
        customerProfileType.setEmail('@anet.net');
        customerProfileType.setPaymentProfiles(paymentProfilesList);

        var createRequest = new ApiContracts.CreateCustomerProfileRequest();
        createRequest.setProfile(customerProfileType);
        createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
        createRequest.setMerchantAuthentication(merchantAuthenticationType);


        var ctrl = new ApiControllers.ARBCreateSubscriptionController(createRequest.getJSON());
        console.log("ctrl", ctrl)
        ctrl.execute(function () {
            var apiResponse = ctrl.getResponse();
            console.log("api Response", apiResponse);
            console.log("customerProfileId", apiResponse.customerProfileId);
            console.log("customerPaymentProfileIdList", apiResponse.customerPaymentProfileIdList);

            // const localStorage = new LocalStorage('./scratch');
            // localStorage.setItem('customerProfileId', apiResponse.customerProfileId);

            const dataToStore = {
                key: 'customerProfileId',
                anotherKey: apiResponse.customerProfileId,
            };
            const jsonData = JSON.stringify(dataToStore);
            const filePath = 'localData.json';

            fs.writeFile(filePath, jsonData, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                } else {
                    console.log('Data successfully stored in local file.', jsonData);
                }
            });

            //   fs.readFile(filePath, 'utf8', (err, data) => {
            //     if (err) {
            //       console.error('Error reading from file:', err);
            //     } else {
            //       // Parse JSON data
            //       const retrievedData = JSON.parse(data);
            //       console.log('Retrieved data:', retrievedData);
            //     }
            //   });



            var response = new ApiContracts.ARBCreateSubscriptionResponse(apiResponse);
            console.log("response ::::::;", JSON.stringify(response, null, 2));

            if (response != null) {
                if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                    console.log('Subscription Id : ' + response.getSubscriptionId());
                    console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
                    console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
                }
                else {
                    console.log('Result Code: ' + response.getMessages().getResultCode());
                    console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                    console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                }
            }
            else {
                console.log('Null Response.');
            }
            // callback(response);
            console.log("response", response)
            return response
        });
    } catch (error) {

        console.log("error :")
        conole.log("error : ", error)
        //res.status(500).json({ success: false, error: error.message });
    }

}


/**STRIPE>>>>>>>>>>>>>>>>>>>>>>> */


async function createSubscription(req, res) {
    const { paymentMethodId, email, plan_Id, authName } = req.body;
    try {
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                token: paymentMethodId,
            },
        });
        // console.log("paymentMethod", paymentMethod.id)

        const customer = await stripe.customers.create({
            email: email,
            payment_method: paymentMethod.id,
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
            name: authName,
        });

        // Attach the payment method to the customer
        await stripe.paymentMethods.attach(paymentMethod.id, {
            customer: customer.id,
        });

        // Set the payment method as the default for invoices
        await stripe.customers.update(customer.id, {
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: plan_Id }], // Replace with your plan ID
            expand: ['latest_invoice.payment_intent'],
        });
        
        return subscription
        // return session;
        // res.status(200).json({ subscription });
    } catch (error) {
        console.error('Error creating subscription:', error);
        // res.status(500).send({ error: 'Subscription creation failed' });
    }

}

