const config = require('../config/index');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const Schema = mongoose.Types;
var ObjectId = Schema.ObjectId;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const db = require("../helpers/db");
const msg = require('../helpers/messages.json');
const fs = require('fs');

const { Admin, User, Seller, Coupon, Product, Category, Brand, TodayDeal, BannerImage, TrendingProduct, PopularProduct, Color, OrderStatus, CryptoConversion, Payment, Order, OrderTrackingTimeline, ProductSales, cmsPost, cmsPage, cmsCategory, bannerAdvertisement, Chat, ChatMessage, Services, OrderDetails } = require("../helpers/db");

module.exports = {
    authenticate,
    getUsers,
    getUserDetails,
    getSellers,
    createCoupon,
    getNewCoupons,
    getExpiredCoupons,
    getById,
    signup,
    changePass,
    forgotPass,
    resetPass,
    //statusUpdate,
    //delete: _delete 
    createCategory,
    editCategory,
    getCateogries,
    deleteCategory,
    statusCategory,
    getCateogyById,

    createBrand,
    editBrand,
    getBrands,
    getBrandById,
    deleteBrand,
    statusBrand,

    createDeal,
    editDeal,
    getDeals,
    deleteDeal,
    statusDeal,

    createBanner,
    editBanner,
    getBanners,
    deleteBanner,
    statusBanner,

    createTrendingProduct,
    getTrendingProducts,
    deleteTrendingProduct,
    statusTrendingProduct,

    createPopularProduct,
    getPopularProducts,
    deletePopularProduct,
    statusPopularProduct,

    createColor,
    editColor,
    getColors,
    deleteColor,
    statusColor,

    //Order
    getOrders,
    getUserOrders,
    getOrderById,
    getOrderstatus,
    getPayments,
    getPaymentById,
    getUserById,
    getSellerById,
    getDashboardCounters,
    getProductSales,
    getOrderDataBypaymentId,
    getproductData,
    getProductNameById,
    filterOrderData,

    //CMS
    createCmsPost,
    getCmsPostData,
    cmsDeletePost,
    cmsUpdatePost,
    cmsGetByStatus,
    cmsGetPostById,
    getAllPostSlug,
    createCmsPage,
    cmsPageGetByStatus,
    cmsGetPageById,
    cmsUpdatePage,
    cmsDeletePage,
    getAllPageSlug,
    createCmsCategory,
    getCmsCategoryData,
    cmsGetCategoryById,
    cmsUpdateCategory,
    categoryDelete,

    getAllBannersData,
    deleteBannerAdv,
    getBannerById,
    updateBanner,
    createNewBanner,

    addService,
    allServiceData,
    getServiceItems,
    getAdminCategories,
    editService,
    deleteService,
    statusChange,
    userServiceOrders,

    getAllUser,
    accessChat,
    fetchChat,
    fetchBlockChat,
    createGroupChat,
    sendMessage,
    allMessages,
    userChatBlock,
    userUnblockChat,
    chatMessageDelete,
    removeFromGroup,
    addGroupMember,
    updateGroupName,
};

// Validator function
function isValidObjectId(id) {
    console.log('id=' + id)
    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}

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

async function signup(param) {

    if (await Admin.findOne({ email: param.email })) {
        throw 'email "' + param.email + '" is already taken';
    }

    const admin = new Admin({
        name: param.name,
        password: bcrypt.hashSync(param.password, 10),
        email: param.email,
        phone: param.phone,
        isActive: true
    });

    //Email send functionality.
    const mailOptions = {
        from: config.mail_from_email, // sender address
        to: admin.email,
        subject: 'Welcome Email - PayEarth',
        text: 'Welcome Email',
        html: 'Dear <b>' + admin.name + '</b>,<br/> You are successfully registered as Admin.<br/> ',
    };

    sendMail(mailOptions);

    const data = await admin.save();
    if (data) {

        let res = await Admin.findById(data.id).select("-password -reset_password");

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
    const admin = await Admin.findOne({ email });
    if (admin && bcrypt.compareSync(password, admin.password)) {
        const { password, otp_code, otp_valid_at, is_pass_req, __v, createdAt, ...userWithoutHash } = admin.toObject();
        const token = jwt.sign({ id: admin.id }, config.secret, {
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

async function forgotPass(param) {
    const email = param.email;
    const admin = await Admin.findOne({ email });

    if (admin) {
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

        Object.assign(admin, input);

        // Email send functionality.
        let app_url = config.app_env === "local" ? config.react_local_url : config.react_dev_url;
        let url = app_url + '/admin/reset-password?t=resetpass&u=' + admin.id + '&hash=' + verif_code;
        const mailOptions = {
            from: config.mail_from_email, // sender address
            to: admin.email, // list of receiver
            subject: 'Verification link generated for reset password.',
            text: 'Verification link',
            html: 'Dear <b>' + admin.name + '</b>,<br/> password reset verification link is - <a href="' + url + '" target="_blank"><b>' + url + ' </b></a><br/> It will expire in ' + config.verif_min + ' minutes.',
        };
        sendMail(mailOptions);

        const data = await admin.save();

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
    const admin = await Admin.findById(id);
    const now = new Date();

    if (admin && admin.reset_password.verif_code == param.code && admin.reset_password.code_valid_at >= now) {
        var verif_code = '';
        var code_valid_at = null;
        var is_pass_req = false;

        if (param.password === param.password_confirmation) {
            var password = bcrypt.hashSync(param.password, 10);
        } else {
            throw msg.admin.password.confirm_pass_err;
        }

        const input = {
            "reset_password": {
                "code_valid_at": code_valid_at,
                "verif_code": verif_code,
                "is_pass_req": is_pass_req
            },
            "password": password,
        };

        Object.assign(admin, input);

        const data = await admin.save();

        if (data) {
            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

async function changePass(id, param) {
    if (!param) throw msg.common.invalid;

    const admin = await Admin.findById(id);

    if (!admin) {
        return false;
    } else {
        //check old password
        if (bcrypt.compareSync(param.old_password, admin.password)) {
            if (param.password === param.password_confirmation) {
                param.password = bcrypt.hashSync(param.password, 10);
            } else {
                throw msg.admin.password.confirm_pass_err;
            }
            Object.assign(admin, { password: param.password });
            await admin.save();
            return admin;
        } else {
            throw msg.admin.password.old_pass_err;
        }
    }
}

async function getUsers(req) {
    try {

        var param = req.body;
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { role: "user" }; //default

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

        if (param.search_value) {
            whereCondition["name"] = { $regex: '.*' + param.search_value + '.*' };
        }

        var options = {
            select: 'id name email purchase_type isActive',
            sort: sortOption,
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await User.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    users: data.docs,
                    paginationData: {
                        totalUsers: data.totalDocs,
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
        if (result.users && result.users.length > 0) {
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getUserDetails() {
    const result = await User.find().select().sort({ createdAt: 'desc' });
    // console.log("getUserDetails Result: ", result)

    if (result && result.length > 0) return result;

    return false;
}

async function getSellers(req) {
    try {

        var param = req.body;
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { role: "seller" }; //default

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

        if (param.search_value) {
            whereCondition["name"] = { $regex: '.*' + param.search_value + '.*', $options: 'i' };
        }

        var options = {
            select: 'id name email full_address.country seller_type isActive',
            sort: sortOption,
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await Seller.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    sellers: data.docs,
                    paginationData: {
                        totalSellers: data.totalDocs,
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
        if (result.sellers && result.sellers.length > 0) {
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function createCoupon(param) {

    //if (await Coupon.findOne({ code: param.code })) { throw 'Coupon Code "' + param.code + '" already exists.'; }
    if (await Coupon.findOne({ code: param.coupon_code })) { throw 'Coupon Code "' + param.coupon_code + '" already exists.'; }
    const input = {
        "code": param.coupon_code.trim(),
        "discount_per": param.discount_percentage,
        "start": param.start_date,
        "end": param.end_date,
    };

    const coupon = new Coupon(input);
    const data = await coupon.save();

    if (data) {
        return await Coupon.findById(data.id).select();
    } else { return false; }


}


async function getNewCoupons(req) {
    try {
        let now = new Date();
        var param = req.body;
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { end: { $gte: now } }; //default

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
            select: 'id code discount_per start end isActive',
            sort: sortOption,
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await Coupon.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    coupons: data.docs,
                    paginationData: {
                        totalCoupons: data.totalDocs,
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
        if (result.coupons && result.coupons.length > 0) {
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getExpiredCoupons(req) {
    try {
        let now = new Date();
        var param = req.body;
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { end: { $lte: now } }; //default

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
            select: 'id code discount_per start end isActive',
            sort: sortOption,
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        const result = await Coupon.paginate(whereCondition, options)
            .then((data) => {
                let res = {
                    coupons: data.docs,
                    paginationData: {
                        totalCoupons: data.totalDocs,
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
        if (result.coupons && result.coupons.length > 0) {
            return result;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getById(id) {
    const admin = await Admin.findById(id).select("-password");
    if (!admin) return false;
    return admin;
}

// async function statusUpdate(id, param) {

//     const admin = await Admin.findById(id);

//     if (!admin) {
//         return false;
//     } else {
//         const input = {
//             "isActive": param.is_active
//         };

//         Object.assign(admin, input);

//         if (await admin.save()) {
//             return await Admin.findById(id).select("-password -otp_code -otp_valid_at -is_pass_req");
//         }
//     }
// }

// async function _delete(id) {
//     const admin = Admin.findById(id);
//     if (!admin) return false;
//     return await Admin.findByIdAndRemove(id);
// }

//Category 

async function createCategory(param) {

    var Name = param.name.trim();
    var lName = Name.toLowerCase();

    if (await Category.findOne({ lname: lName })) { throw 'Category "' + param.name + '" already exists.'; }

    const input = {
        "categoryName": Name,
        "lname": lName,
        "parent": param.parent_id,
        "isService": param.is_service ? param.is_service : false,
        "onMainMenu": param.add_to_menu,
        "createdBy": param.admin_id,
        "updatedBy": param.admin_id,
    };

    const category = new Category(input);
    const data = await category.save();

    if (data) {
        return await Category.findById(data.id).select();
    } else {
        return false;
    }
}

async function editCategory(req) {
    const param = req.body;
    const id = req.params.id;

    const category = await Category.findById(id);

    if (!category) return false;

    var Name = param.name.trim();
    var lName = Name.toLowerCase();

    if (category.lname !== lName && (await Category.findOne({ lname: lName }))) {
        throw 'Category "' + param.name + '" already exists.';
    }

    const input = {
        "categoryName": Name,
        "lname": lName,
        "parent": param.parent_id,
        "isService": param.is_service ? param.is_service : false,
        "onMainMenu": param.add_to_menu,
        "updatedBy": param.admin_id,
    };

    Object.assign(category, input);

    const data = await category.save();

    if (data) {
        return await Category.findById(data.id).select();
    } else {
        return false;
    }

}

async function getCateogries() {
    const result = await Category.find().select().sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
}


async function deleteCategory(id) {
    const admin = Category.findById(id);

    if (!admin) return false;

    return await Category.findByIdAndRemove(id);
}


async function statusCategory(req) {
    const id = req.params.id;
    const param = req.body;

    const category = await Category.findById(id);

    if (!category) {
        return false;
    } else {
        const input = {
            "isActive": param.is_active
        };

        Object.assign(category, input);

        if (await category.save()) {
            return await Category.findById(id).select();
        }
    }
}


//Brand

async function createBrand(req) {
    var file = req.file;
    var param = req.body;
    var logoUrl = '';

    if (await Brand.findOne({ brandName: param.name })) { throw 'Brand Name "' + param.name + '" already exists.'; }

    if (typeof file != "undefined") {
        logoUrl = file.destination + "/" + file.filename;
    }

    const input = {
        "brandName": param.name,
        "isActive": param.is_active,
        "logoImage": logoUrl,
        "isPopular": param.is_popular,
        "createdBy": param.admin_id,
        "updatedBy": param.admin_id,
    };

    const brand = new Brand(input);
    const data = await brand.save();

    if (data) {
        return await Brand.findById(data.id).select();
    } else {
        return false;
    }

}

async function editBrand(req) {
    var file = req.file;
    var param = req.body;
    var logoUrl = '';

    const id = req.params.id;

    const brand = await Brand.findById(id);

    if (!brand) return false;

    if (brand.brandName !== param.name && (await Brand.findOne({ brandName: param.name }))) {
        throw 'Brand Name "' + param.name + '" already exists.';
    }

    if (typeof file != "undefined") {

        if (fs.existsSync(brand.logoImage)) {
            fs.unlinkSync(brand.logoImage);
        }

        logoUrl = file.destination + "/" + file.filename;
    }

    const input = {
        "brandName": param.name,
        "isActive": param.is_active,
        "logoImage": logoUrl,
        "isPopular": param.is_popular,
        "createdBy": param.admin_id,
        "updatedBy": param.admin_id,
    };

    Object.assign(brand, input);

    const data = await brand.save();

    if (data) {
        return await Brand.findById(data.id).select();
    } else {
        return false;
    }
}

async function getBrands() {
    const result = await Brand.find().select().sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
}
async function getCateogyById(categoryid) {
    try {
        const categoryData = await Category.findOne({ _id: categoryid }).exec();
        if (categoryData) {
            return categoryData;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}
async function getBrandById(brandid) {
    try {
        const brandData = await Brand.findOne({ _id: brandid }).exec();
        if (brandData) {
            return brandData;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }

}

async function deleteBrand(id) {
    const admin = Brand.findById(id);

    if (!admin) return false;

    return await Brand.findByIdAndRemove(id);
}


async function statusBrand(req) {
    const id = req.params.id;
    const param = req.body;

    const brand = await Brand.findById(id);

    if (!brand) {
        return false;
    } else {
        const input = {
            "isActive": param.is_active
        };

        Object.assign(brand, input);

        if (await brand.save()) {
            return await Brand.findById(id).select();
        }
    }
}


//Deal

async function createDeal(req) {
    var file = req.file;
    var param = req.body;
    var bannerUrl = '';

    if (await TodayDeal.findOne({ title: param.title })) { throw 'Deal Title "' + param.title + '" already exists.'; }

    if (typeof file != "undefined") {
        bannerUrl = file.destination + "/" + file.filename;
    }

    const input = {
        "title": param.title,
        "isActive": param.is_active,
        "bannerImage": bannerUrl,
        "categoryId": param.category_id,
        "subCategoryId": param.subcategory_id,
        "createdBy": param.admin_id,
        "updatedBy": param.admin_id,
    };

    const deal = new Deal(input);
    const data = await deal.save();

    if (data) {
        return await TodayDeal.findById(data.id).select();
    } else {
        return false;
    }

}

async function editDeal(req) {
    var file = req.file;
    var param = req.body;
    var bannerUrl = '';

    const id = req.params.id;

    const deal = await TodayDeal.findById(id);

    if (!deal) return false;

    if (deal.title !== param.name && (await TodayDeal.findOne({ title: param.name }))) {
        throw 'Deal Name "' + param.name + '" already exists.';
    }

    if (typeof file != "undefined") {

        if (fs.existsSync(brand.bannerImage)) {
            fs.unlinkSync(brand.bannerImage);
        }

        bannerUrl = file.destination + "/" + file.filename;
    }

    const input = {
        "title": param.name,
        "isActive": param.is_active,
        "bannerImage": bannerUrl,
        "categoryId": param.category_id,
        "subCategoryId": param.subcategory_id,
        "createdBy": param.admin_id,
        "updatedBy": param.admin_id,
    };

    Object.assign(deal, input);

    const data = await deal.save();

    if (data) {
        return await TodayDeal.findById(data.id).select();
    } else {
        return false;
    }
}

async function getDeals() {
    const result = await TodayDeal.find().select().sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
}


async function deleteDeal(id) {
    const admin = TodayDeal.findById(id);

    if (!admin) return false;

    return await TodayDeal.findByIdAndRemove(id);
}


async function statusDeal(req) {
    const id = req.params.id;
    const param = req.body;

    const deal = await TodayDeal.findById(id);

    if (!deal) {
        return false;
    } else {
        const input = {
            "isActive": param.is_active
        };

        Object.assign(deal, input);

        if (await deal.save()) {
            return await TodayDeal.findById(id).select();
        }
    }
}



//Banner

async function createBanner(req) {

    try {
        var files = req.files; //multiple files
        var param = req.body;
        var bannerData = param.banner_data;
        var singleImageUrl = '';
        var bannerImagesArr = [];

        if (await BannerImage.findOne({ page: param.page })) { throw 'Page "' + param.page + '" already exists.'; }

        if (files.length > 0) {
            singleImageUrl = files[0].destination + "/" + files[0].filename;
            files.shift(); //remove first item.

            for (let i = 0; i < files.length; i++) {
                let path = files[i].destination + "/" + files[i].filename;
                let text = bannerData[i].text;
                let url = bannerData[i].url;
                let x = {
                    path: path,
                    text: text,
                    url: url
                };
                bannerImagesArr.push(x);
            }
        }

        const input = {
            "page": param.page,
            "isActive": param.is_active,
            "singleImage": singleImageUrl,
            "bannerImages": bannerImagesArr,
            "createdBy": param.admin_id,
            "updatedBy": param.admin_id,
        };
        const banner = new Banner(input);
        const data = await banner.save();

        if (data) {
            return await BannerImage.findById(data.id).select();
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function editBanner(req) {

    var files = req.files; //multiple files
    var param = req.body;
    var bannerData = param.banner_data;
    var singleImageUrl = '';
    var bannerImagesArr = [];
    const id = req.params.id;

    const banner = await BannerImage.findById(id);

    if (!banner) return false;

    if (banner.page !== param.page && (await BannerImage.findOne({ page: param.page }))) {
        throw 'Page "' + param.page + '" already exists.';
    }

    const input = {
        "page": param.page,
        "singleImage": banner.singleImage,
        "bannerImages": banner.bannerImages,
        "isActive": param.is_active,
        "updatedBy": param.admin_id,
    };

    // if (typeof file != "undefined") {
    //     fs.unlinkSync(banner.logoImage);
    //     singleImageUrl = file.destination + "/" + file.filename;
    // } 

    if (files.length > 0) {
        singleImageUrl = files[0].destination + "/" + files[0].filename;
        input['singleImage'] = singleImageUrl;

        files.shift(); //remove first item.

        for (let i = 0; i < files.length; i++) {
            let path = files[i].destination + "/" + files[i].filename;
            let text = bannerData[i].text;
            let url = bannerData[i].url;
            let x = {
                path: path,
                text: text,
                url: url
            };
            bannerImagesArr.push(x);
        }

        if (bannerImagesArr.length > 0) {
            input['bannerImages'] = bannerImagesArr;
        }

    }

    Object.assign(banner, input);

    const data = await banner.save();

    if (data) {
        return await BannerImage.findById(data.id).select();
    } else {
        return false;
    }
}

async function getBanners() {
    const result = await BannerImage.find().select().sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
}


async function deleteBanner(id) {
    const admin = BannerImage.findById(id);

    if (!admin) return false;

    return await BannerImage.findByIdAndRemove(id);
}


async function statusBanner(req) {
    const id = req.params.id;
    const param = req.body;

    const banner = await BannerImage.findById(id);

    if (!banner) {
        return false;
    } else {
        const input = {
            "isActive": param.is_active
        };

        Object.assign(banner, input);

        if (await banner.save()) {
            return await BannerImage.findById(id).select();
        }
    }
}



//TrendingProduct 

async function createTrendingProduct(param) {
    let productId = mongoose.Types.ObjectId(param.product_id);
    if (await TrendingProduct.findOne({ productId: productId })) { throw 'This product already exists.'; }

    const input = {
        "isActive": param.is_active,
        "productId": param.product_id,
        "createdBy": param.admin_id,
        "updatedBy": param.admin_id,
    };

    const trendingproduct = new TrendingProduct(input);
    const data = await trendingproduct.save();

    if (data) {
        return await TrendingProduct.findById(data.id).select().populate("productId", "name featuredImage");
    } else {
        return false;
    }

}


async function getTrendingProducts() {
    const result = await TrendingProduct.find().select().populate("productId", "name featuredImage").sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
}


async function deleteTrendingProduct(id) {
    const admin = TrendingProduct.findById(id);

    if (!admin) return false;

    return await TrendingProduct.findByIdAndRemove(id);
}


async function statusTrendingProduct(req) {
    const id = req.params.id;
    const param = req.body;

    const trendingproduct = await TrendingProduct.findById(id).populate("productId", "name featuredImage");

    if (!trendingproduct) {
        return false;
    } else {
        const input = {
            "isActive": param.is_active
        };

        Object.assign(trendingproduct, input);

        if (await trendingproduct.save()) {
            return await TrendingProduct.findById(id).select().populate("productId", "name featuredImage");
        }
    }
}


//PopularProduct 

async function createPopularProduct(param) {
    let productId = mongoose.Types.ObjectId(param.product_id);
    if (await PopularProduct.findOne({ productId: productId })) { throw 'This product already exists.'; }

    const input = {
        "isActive": param.is_active,
        "productId": param.product_id,
        "createdBy": param.admin_id,
        "updatedBy": param.admin_id,
    };

    const trendingproduct = new PopularProduct(input);
    const data = await trendingproduct.save();

    if (data) {
        return await PopularProduct.findById(data.id).select().populate("productId", "name featuredImage");
    } else {
        return false;
    }

}


async function getPopularProducts() {
    const result = await PopularProduct.find().select().populate("productId", "name featuredImage").sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
}


async function deletePopularProduct(id) {
    const admin = PopularProduct.findById(id);

    if (!admin) return false;

    return await PopularProduct.findByIdAndRemove(id);
}


async function statusPopularProduct(req) {
    const id = req.params.id;
    const param = req.body;

    const trendingproduct = await PopularProduct.findById(id).populate("productId", "name featuredImage");

    if (!trendingproduct) {
        return false;
    } else {
        const input = {
            "isActive": param.is_active
        };

        Object.assign(trendingproduct, input);

        if (await trendingproduct.save()) {
            return await PopularProduct.findById(id).select().populate("productId", "name featuredImage");
        }
    }
}


//Color 

async function createColor(req) {
    var param = req.body;
    let lname = param.name.toLowerCase();

    if (await Color.findOne({ code: param.code })) {
        throw 'Color "' + param.name + '" already exists.';
    }

    const input = {
        "isActive": param.is_active,
        "colorName": param.name,
        "lname": lname,
        "code": param.code,
        "createdBy": param.admin_id,
        "updatedBy": param.admin_id,
    };

    const color = new Color(input);
    const data = await color.save();

    if (data) {
        return await Color.findById(data.id).select();
    } else {
        return false;
    }

}

async function editColor(req) {
    var param = req.body;
    const id = req.params.id;
    let lname = param.name.toLowerCase();

    const color = await Color.findById(id);

    if (!color) return false;

    if (color.code !== code && (await Color.findOne({ code: param.code }))) {
        throw 'Color "' + param.name + '" already exists.';
    }

    const input = {
        "colorName": param.name,
        "lname": lname,
        "code": param.code,
        "isActive": param.is_active,
        "createdBy": param.admin_id,
        "updatedBy": param.admin_id,
    };

    Object.assign(color, input);

    const data = await color.save();

    if (data) {
        return await Color.findById(data.id).select();
    } else {
        return false;
    }
}


async function getColors() {
    const result = await Color.find().select().sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
}


async function deleteColor(id) {
    const admin = Color.findById(id);

    if (!admin) return false;

    return await Color.findByIdAndRemove(id);
}


async function statusColor(req) {
    const id = req.params.id;
    const param = req.body;

    const color = await Color.findById(id);

    if (!color) {
        return false;
    } else {
        const input = {
            "isActive": param.is_active
        };

        Object.assign(color, input);

        if (await color.save()) {
            return await Color.findById(id).select();
        }
    }
}

async function getUserOrders(req) {

}

async function getOrders(req) {
    //pending, ongoing, cancel and refund, complete orders of product/service 
    try {
        var param = req.body;
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var orArr = [{ "lname": "pending" }]; //default
        var statusOrArray = [];
        var timelineOrArray = [];
        var isService = param.filter.is_service ? param.filter.is_service : false;

        //get id of order status
        if (param.filter.type == "pending") {
            orArr = [{ "lname": "pending" }];

        } else if (param.filter.type == "ongoing") {
            orArr = [{ "lname": "processing" }, { "lname": "packed" }, { "lname": "shipped" }, { "lname": "delivered" }];

        } else if (param.filter.type == "cancel_refund") {
            orArr = [{ "lname": "cancelled" }, { "lname": "refunded" }, { "lname": "declined" }, { "lname": "disputed" }, { "lname": "failed" }, { "lname": "returned" }, { "lname": "return_request" }, { "lname": "cancel_request" }];

            //} else if (param.filter.type == "complete") {
        } else if (param.filter.type == "completed") {
            orArr = [{ "lname": "completed" }];
        }

        if (param.filter.status) {
            orArr = [];
        }

        if (param.filter.status == "Completed" && param.filter.type == "completed") {

            orArr = [{ "lname": "completed" }];
        }

        if (param.filter.status == "Pending" && param.filter.type == "pending") {
            orArr = [{ "lname": "pending" }];
        }

        if ((param.filter.status == "Packed" && param.filter.type == "ongoing") || (param.filter.status == "Processing" && param.filter.type == "ongoing") || (param.filter.status == "Shipped" && param.filter.type == "ongoing") || (param.filter.status == "Delivered" && param.filter.type == "ongoing")) {
            orArr = [{ "lname": "processing" }, { "lname": "packed" }, { "lname": "shipped" }, { "lname": "delivered" }];
            console.log('processing');
            //orArr = [{ "lname": "ongoing" }];
        }

        if ((param.filter.status == "Cancel Refund" && param.filter.type == "cancel_refund") || (param.filter.status == "Cancelled" && param.filter.type == "cancel_refund") || (param.filter.status == "Refunded" && param.filter.type == "cancel_refund") || (param.filter.status == "Declined" && param.filter.type == "cancel_refund") || (param.filter.status == "Disputed" && param.filter.type == "cancel_refund") || (param.filter.status == "FAILED" && param.filter.type == "cancel_refund") || (param.filter.status == "Returned" && param.filter.type == "cancel_refund") || (param.filter.status == "Return Request" && param.filter.type == "cancel_refund") || (param.filter.status == "Cancel Request" && param.filter.type == "cancel_refund")) {
            orArr = [{ "lname": "cancelled" }, { "lname": "refunded" }, { "lname": "declined" }, { "lname": "disputed" }, { "lname": "failed" }, { "lname": "returned" }, { "lname": "return_request" }, { "lname": "cancel_request" }];
        }
        //console.log(orArr);
        //console.log(orArr.length);

        var statuses = await OrderStatus.find({ $or: orArr }).select("id lname").exec();;

        if (statuses && statuses.length > 0) {

            for (var i = 0; i < statuses.length; i++) {
                let id = statuses[i]._id;
                let el = { "orderStatusId": id };
                statusOrArray.push(el);
            }


            //console.log(orArr);
            var timelines = await OrderTrackingTimeline.find({ $or: statusOrArray }).select("id").exec();

            if (timelines && timelines.length > 0) {
                for (var j = 0; j < timelines.length; j++) {
                    let x = timelines[j]._id;
                    // let y = { "orderStatus": x };
                    timelineOrArray.push(x);
                }
            }
        }

        //console.log(statusOrArray);
        //console.log(timelineOrArray);

        var whereCondition = { $and: [{ isActive: true }, { isService: isService }] };

        if (timelineOrArray.length > 0) {
            whereCondition['$and'].push({ orderStatus: { $in: timelineOrArray } });
        }

        if (param.filter.date) {
            //let start = param.filter.date.start;
            //let end = param.filter.date.end;
            let start = new Date(param.filter.date).toISOString();
            let end = param.filter.date;
            end = new Date(end);

            end.setDate(end.getDate() + 1);
            end = end.toISOString()
            //console.log('start='+start);
            //console.log('datep='+end);
            //whereCondition['$and'].push({ createdAt: { $gte: start, $lte: end } });
            whereCondition['$and'].push({ "createdAt": { $gte: new Date(start), $lt: new Date(end) } });
        }

        if (param.filter.vendor && param.filter.vendor != "") {
            let vendor_text = param.filter.vendor; //text
            var sellerIdArray = [];
            var sellers = await Seller.find({ name: { $regex: '.*' + vendor_text + '.*' } }).select("id").exec();

            if (sellers && sellers.length > 0) {

                for (var i = 0; i < sellers.length; i++) {
                    let id = sellers[i]._id;
                    sellerIdArray.push(id);
                }
            }

            if (sellerIdArray.length > 0) {
                whereCondition['$and'].push({ sellerId: { $in: sellerIdArray } });
            }

        }

        if (param.filter.customer && param.filter.customer != "") {

            let customer_text = param.filter.customer; //text
            var userIdArray = [];
            var users = await User.find({ name: { $regex: '.*' + customer_text + '.*' } }).select("id").exec();

            if (users && users.length > 0) {

                for (var i = 0; i < users.length; i++) {
                    let id = users[i]._id;
                    userIdArray.push(id);
                }
            }

            if (userIdArray.length > 0) {
                whereCondition['$and'].push({ userId: { $in: userIdArray } });
            }
        }

        //if (param.searching.value && param.searching.value != "") {
        //if (typeof param.searching != "undefined") {

        if (typeof param.search != "undefined") {
            //console.log('##')
            //let search_text = param.searching.value; //text

            //search for orders
            //if(param.search && param.search.length > 0) {
            let ordercode_text = param.search; //text

            var orderIdArray = [];

            var orders = await Order.find({ orderCode: ordercode_text }).select("id").exec();

            if (orders && orders.length > 0) {

                for (var i = 0; i < orders.length; i++) {
                    let id = orders[i]._id;
                    orderIdArray.push(id);
                }
            }
            //console.log(orderIdArray);
            if (orderIdArray.length > 0) {
                whereCondition['$and'].push({ _id: { $in: orderIdArray } });
            }
            //console.log(orderIdArray)
            //end vendors search
            //}
            //search for vendors
            if (param.search && param.search.length > 0) {
                let vendor_text = param.search; //text
                var sellerIdArray = [];
                //console.log(vendor_text);
                var sellers = await Seller.find({ name: { $regex: '.*' + vendor_text + '.*' } }).select("id").exec();

                if (sellers && sellers.length > 0) {

                    for (var i = 0; i < sellers.length; i++) {
                        let id = sellers[i]._id;
                        sellerIdArray.push(id);
                    }
                }

                if (sellerIdArray.length > 0) {
                    whereCondition['$and'].push({ sellerId: { $in: sellerIdArray } });
                }
            }

            //end vendors search

            //search for customer
            if (param.search) {
                let customer_text = param.search; //text
                var userIdArray = [];
                var users = await User.find({ name: { $regex: '.*' + customer_text + '.*' } }).select("id").exec();

                if (users && users.length > 0) {

                    for (var i = 0; i < users.length; i++) {
                        let id = users[i]._id;
                        userIdArray.push(id);
                    }
                }

                if (userIdArray.length > 0) {
                    whereCondition['$and'].push({ userId: { $in: userIdArray } });
                }
                // end customer search
            }
            if (param.search) {

                let search_text = param.search; //text
                //let search_text = ''; //text
                //cosole.log('product='+search_text)
                var productIdArray = [];
                var products = '';
                if (isValidObjectId(search_text)) {
                    //console.log('test');
                    products = await Product.find({ _id: search_text }).select("id").exec();
                } else {
                    //console.log('test1');
                    products = await Product.find({ name: { $regex: '.*' + search_text + '.*', '$options': 'i' } }).select("id").exec();
                }
                //console.log(products);
                if (products && products.length > 0) {

                    for (var i = 0; i < products.length; i++) {
                        let id = products[i]._id;
                        productIdArray.push(id);
                    }
                }

                if (productIdArray.length > 0) {
                    //console.log(productIdArray);
                    whereCondition['$and'].push({ productId: { $in: productIdArray } });
                }
            }

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
            select: 'id orderCode productId userId isActive orderStatus paymentId product_sku createdAt',
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
            },
            {
                path: "sellerId",
                model: Seller,
                select: "id name"
            }
            ],
            lean: true,
            page: page,
            offset: skip,
            limit: limit,
        };

        //console.log(whereCondition);
        //console.log(options);
        const result = await Order.paginate(whereCondition, options)
            .then((data) => {
                //filterOrderData(data.docs);
                var prodname = '';
                /*
                data.docs.map(function (val, index) {
                    var productName = '';
                    
                    if(typeof val.productId != 'undefined' && typeof val.productId.length != 'undefined') {
                        var datap = val.productId;
                        datap.map(function(value,index){
                            const result = Product.findById(value.productId).select('name').exec();
                            //console.log("result",Promise.resolve(result));
                            result.then((response) => {
                                //console.log("response=",response);
                                //return response.name;
                                //window.localStorage.setItem('productname', response.name);
                            })
                        });
                    } else {
                        
                        //val.product_name = getProductNameById(val.productId);
                        const result = Product.findById(val.productId).select('name').exec();
                        result.then((response) => {
                            //console.log("response=",response);
                            //return response.name;
                            //window.localStorage.setItem('productname', response.name);
                        })
                        //console.log("result",Promise.resolve(result));
                        //console.log(getProductNameById(val.productId))
                    }
                    
                   
                    console.log("prodname",window.localStorage.getItem('productname'));
                    val.product_name = prodname;
                })*/
                //console.log(ordersData);
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
        //console.log(result);    
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
function filterOrderData(data) {
    var i = 0;
    data.map(function (val, index) {
        var productName = '';
        //val.product_name = getProductNameById(val.productId);
        //console.log("val",val.productId.length);
        //console.log("val",val.productId);
        //console.log(i++);
        //console.log("val1",typeof(val.productId['productId']));
        if (typeof val.productId != 'undefined' && typeof val.productId.length != 'undefined') {
            console.log('test');
            //console.log(val.productId);
            var datap = val.productId;
            datap.map(function (value, index) {
                console.log(getProductNameById(value.productId))

            });
            //console.log('productname=',getProductNameById(val.productId.productId));            

        } else {
            console.log('test1');
            //val.product_name = getProductNameById(val.productId);
            console.log(getProductNameById(val.productId))
            //console.log('productname=', getProductNameById(val.productId));            
            //console.log("val",val.productId);
        }
        //console.log("productname",localStorage.getItem('productname'))
        val.product_name = '';

    })
    return data;
}

function getProductNameById(productId) {
    const result = Product.findById(productId).select('name').exec();
    console.log(Promise.resolve(result));
    if (result && result.length > 0) {
        return Promise.resolve(result);
    }
}

async function getOrderstatus() {
    const result = await OrderStatus.find().select().sort({ createdAt: 'desc' });

    if (result && result.length > 0) return result;

    return false;
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
            },
            {
                path: "sellerId",
                model: Seller,
                select: "id name"
            }
            ]);

        if (!order) {
            return false;
        } else {
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


async function getPayments(req) {
    try {

        var param = req.body;
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 10;
        var skip = 0;
        var whereCondition = { isActive: true };

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
            select: 'id orderId userId invoiceNo amountPaid paymentMode paymentAccount paymentStatus isActive createdAt',
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


async function getPaymentById(id) {

    try {
        const payment = await Payment.findById(id).select('id invoiceNo invoiceUrl amountPaid paymentMode paymentAccount orderId')
            .populate([{
                path: "orderId",
                model: Order,
                select: "id orderCode productId userId amount product_sku isActive orderStatus createdAt",
                populate: {
                    path: "productId",
                    model: Product,
                    select: "id name price featuredImage avgRating isService",
                    populate: {
                        path: "cryptoPrices",
                        model: CryptoConversion,
                        select: "name code cryptoPriceUSD",
                        match: { isActive: true, asCurrency: true }
                    }
                }
            },
            {
                path: "userId",
                model: User,
                select: "id name"
            },
            {
                path: "sellerId",
                model: Seller,
                select: "id name"
            }
            ]);

        if (!payment) {
            return false;
        } else {

            //get order tracking timeline data
            let orderTimeline = await OrderTrackingTimeline.find({ orderId: payment.orderId })
                .select("orderId orderStatusId updatedAt")
                .populate("orderStatusId", "id lname title", { isActive: true });

            // //get payment data
            // let payment = await Payment.findOne({ orderId: order.id, userId: order.userId._id })
            //     .select("invoiceNo invoiceUrl amountPaid paymentMode paymentAccount").exec();

            let result = {
                payment: payment,
                orderTimeline: orderTimeline,
            };
            return result;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}


async function getUserById(id) {
    try {
        const user = await User.findById(id).select('id name email role purchase_type isActive');

        if (!user) {
            return false;
        } else {
            return user;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getSellerById(id) {
    try {
        const seller = await Seller.findById(id).select('id name email full_address.country seller_type isActive');

        if (!seller) {
            return false;
        } else {
            return seller;
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function getDashboardCounters() {
    try {
        //to get count of total products
        const totalProducts = await Product.find({ isActive: true, isService: false }).countDocuments();

        //to get count of total services
        const totalServices = await Product.find({ isActive: true, isService: true }).countDocuments();

        //to get count of total orders
        const totalOrders = await Order.find({ isActive: true }).countDocuments();

        //to get count of total sellers
        const totalSellers = await Seller.find({ isActive: true }).countDocuments();

        //to get count of total customers
        const totalCustomers = await User.find({ isActive: true }).countDocuments();

        //to get sum of payments amount
        const totalPaymentAmount = await Payment.aggregate([{
            $match: {
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
            totalServices: totalServices,
            totalSellers: totalSellers,
            totalCustomers: totalCustomers
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
        var sortOption = { createdAt: 'desc' }; //default
        var page = 0;
        var limit = 5;
        var skip = 0;
        var whereCondition = { isActive: true };

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
            },
            {
                path: "sellerId",
                model: Seller,
                select: "id name"
            }
            ],
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

async function getOrderDataBypaymentId(paymentId) {
    try {
        const OrderData = await Order.findOne({ paymentId: paymentId }).populate(
            {
                path: "paymentId",
                model: Payment,
                select: "paymentStatus"
            }
        ).exec();
        if (OrderData) {
            return OrderData;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}
/******************************************************************************/
/******************************************************************************/

/**
 * Get product data by id
 * 
 * @param {*} productId 
 * @returns JSON | boolean
 */
async function getproductData(productId) {
    try {

        const productData = await Product.findOne({ _id: productId }).populate({
            select: 'categoryName',
            path: 'category',
            model: 'Category',
        }).populate({
            select: 'brandName',
            path: 'brand',
            model: 'Brand',
        }).
            exec();
        if (productData) {
            return productData;
        } else {
            return false;
        }

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}
/******************************************************************************/
/******************************************************************************/

// Publish Posts through Admin.........   
//POST API
async function createCmsPost(req, res) {
    try {
        var param = req.body;
        const titleCount = await cmsPost.find({ title: param.title }).count()
        let slug = "";
        if (titleCount > 0) {
            slug = param.slug + titleCount;
        } else {
            slug = param.slug
        }

        // console.log("Slug", slug)
        let input = {
            image: param.image,
            title: param.title,
            slug: slug,
            shortdescription: param.shortdescription,
            description: param.description,
            category: param.category,
            publishDate: param.publishDate,
            seo: param.seo,
            seodescription: param.seodescription,
            keywords: param.keywords,
            author: param.author,
            status: param.status
        };
        const posts = new cmsPost(input);
        const data = await posts.save();
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

// Get all post data
async function getCmsPostData() {
    try {
        const allPosts = await cmsPost.find({ seo, seodescription, title, slug, description, shortdescription, keywords }).select().sort({ createdAt: 'desc' });
        if (allPosts && allPosts.length > 0)
            return allPosts;
    } catch (error) {
        console.log(error)
    }
}
// Delete post
async function cmsDeletePost(req) {
    const postId = req.params.id;
    // console.log("delete", postId)
    try {
        const result = await cmsPost.deleteOne({ _id: postId })
        return result
    } catch (error) {
        console.log(error);
    }
}

// Update Post....api
async function cmsUpdatePost(req) {
    const postId = req.params.id;
    // console.log("postID", postId)
    const { image, seo, seodescription, title, shortdescription, description, keywords, category, status } = req.body;
    try {
        const post = await cmsPost.findByIdAndUpdate(postId, { image, seo, seodescription, title, shortdescription, description, keywords, category, status }, { new: true });
        // console.log("update post", post)
        return post;
    } catch (error) {
        console.log(error)
    }
}

// Status / Get data by status;
async function cmsGetByStatus(req) {
    const status = req.params.status;
    // console.log("status", status)
    try {
        const allPost = await cmsPost.find({}).select().sort({ createdAt: 'desc' });
        const filteredStatus = allPost.filter(item => item.status === status);
        return filteredStatus;
    } catch (error) {
        console.log(error)
    }
}

//
async function cmsGetPostById(req) {
    const postId = req.params.id;
    // console.log("id", postId)
    try {
        const result = await cmsPost.find({ _id: postId })
        return result
    } catch (error) {
        console.log(error);
    }
}

//slug

async function getAllPostSlug() {
    try {
        const allCate = await cmsPost.find({}).select('slug')
        if (allCate && allCate.length > 0)
            return allCate;
    } catch (error) {
        console.log(error)
    }
}

// ************************Cms page model******************************
async function createCmsPage(req, res) {
    try {
        var param = req.body;
        const titleCount = await cmsPage.find({ pageTitle: param.pageTitle }).count()
        let slug = "";
        if (titleCount > 0) {
            slug = param.slug + titleCount;
        } else {
            slug = param.slug
        }

        // console.log("page Slug", slug)

        let input = {
            image: param.image,
            seo: param.seo,
            seodescription: param.seodescription,
            keywords: param.keywords,
            pageTitle: param.pageTitle,
            slug: slug,
            description: param.description,
            publishDate: param.publishDate,
            author: param.author,
            status: param.status
        };
        const pages = new cmsPage(input);
        const data = await pages.save();
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

// Status
async function cmsPageGetByStatus(req) {
    const status = req.params.status;
    try {
        const allPages = await cmsPage.find({}).select().sort({ createdAt: 'desc' });
        const filteredStatus = allPages.filter(item => item.status === status);
        return filteredStatus;
    } catch (error) {
        console.log(error)
    }
}

// ByID
async function cmsGetPageById(req) {
    const pageId = req.params.id;
    try {
        const result = await cmsPage.find({ _id: pageId })
        return result
    } catch (error) {
        console.log(error);
    }
}

// Update Page
async function cmsUpdatePage(req) {
    const pageId = req.params.id;
    const { image, seo, seodescription, keywords, pageTitle, description, status } = req.body;
    try {
        const page = await cmsPage.findByIdAndUpdate(pageId, { image, seo, seodescription, keywords, pageTitle, description, status }, { new: true });
        // console.log("update post", post)
        return page;
    } catch (error) {
        console.log(error)
    }
}

// Delete Page
async function cmsDeletePage(req) {
    const pageId = req.params.id;
    try {
        const result = await cmsPage.deleteOne({ _id: pageId })
        return result
    } catch (error) {
        console.log(error);
    }
}

//all slug
async function getAllPageSlug() {
    try {
        const allCate = await cmsPage.find({}).select('slug')
        if (allCate && allCate.length > 0)
            return allCate;
    } catch (error) {
        console.log(error)
    }
}

//*************************cms Category***************** */
async function createCmsCategory(req, res) {
    try {
        var param = req.body;
        let input = {
            names: param.names,
            slug: param.slug,
            description: param.description,
            // publishDate: param.publishDate,
            // author: param.author,
        };
        const category = new cmsCategory(input);
        const data = await category.save();
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

async function getCmsCategoryData() {
    try {
        const allCate = await cmsCategory.find().select().sort({ createdAt: 'desc' });
        if (allCate && allCate.length > 0)
            return allCate;
    } catch (error) {
        console.log(error)
    }
}

async function cmsGetCategoryById(req) {
    const pageId = req.params.id;
    try {
        const result = await cmsCategory.find({ _id: pageId })
        return result
    } catch (error) {
        console.log(error);
    }
}

async function cmsUpdateCategory(req) {
    const categoryId = req.params.id;
    const { names, slug, description } = req.body;
    try {
        const category = await cmsCategory.findByIdAndUpdate(categoryId, { names, slug, description }, { new: true });
        return category;
    } catch (error) {
        console.log(error)
    }
}

// Delete Category
async function categoryDelete(req) {
    const categoryId = req.params.id;
    try {
        const result = await cmsCategory.deleteOne({ _id: categoryId })
        return result
    } catch (error) {
        console.log(error);
    }
}


//*******************************************
// ******     BANNER START     *******//

async function createNewBanner(req, res) {
    try {
        var param = req.body;
        const titleCount = await bannerAdvertisement.find({ bannerName: param.bannerName }).count()
        let slug = "";
        if (titleCount > 0) {
            slug = param.slug + titleCount;
        } else {
            slug = param.slug
        }
        let input = {
            image: param.image,
            imageId: param.imageId,
            video: param.video,
            videoId: param.videoId,
            bannerText: param.bannerText,
            bannerType: param.bannerType,
            bannerName: param.bannerName,
            slug: slug,
            siteUrl: param.siteUrl,
            category: param.category,
            startDate: param.startDate,
            endDate: param.endDate,
            subscriptionPlan: param.subscriptionPlan,
            bannerPlacement: param.bannerPlacement,
            status: param.status,
            tag: param.tag,
            keyword: param.keyword,
            author: param.author,
            authorDetails: param.authorDetails
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



// Get all banner list from different users.........


async function getAllBannersData() {
    // console.log("getAllBannersData")
    try {
        const result = await bannerAdvertisement.find().sort({ createdAt: 'desc' }).populate(
            {
                path: "author",
                model: User,
                select: " name email"
            },
        )
        if (result && result.length > 0) {
            // console.log("banner list ", result)
            return result
        }
    } catch (error) {
        console.log(error);
    }
}

// DELETE BANNER 
async function deleteBannerAdv(req) {
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
    const { image, video, bannerText, bannerName, bannerType, siteUrl, category, bannerPlacement, startDate, status, keyword } = req.body;
    try {
        const banner = await bannerAdvertisement.findByIdAndUpdate(bannerId, { image, video, bannerText, bannerName, bannerType, siteUrl, category, startDate, bannerPlacement, status, keyword }, { new: true });
        //  console.log("update banner", banner)
        return banner;
    } catch (error) {
        console.log(error)
    }
}

// Services

async function addService(req) {
    const param = req.body;
    var lName = param.name.toLowerCase();

    if (await Services.findOne({ lname: lName })) {
        throw 'Service Name "' + param.name + '" already exists.';
    }

    let input = {
        admin_id: param.admin_id,
        name: param.name,
        lname: lName,
        slug: param.slug,
        charges: param.charges,
        category: param.category,
        description: param.description,
        featuredImage: param.image,
        imageId: param.imageId,
        isActive: true,
        isService: true,
        createdByAdmin: param.admin_id,
        updatedBy: param.admin_id,
    };

    const serviceData = new Services(input);
    const data = await serviceData.save();

    if (data) {
        let res = await Services.findById({ _id: data._id }).select();
        console.log("REsponse", res);
        if (res) {
            return res;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

async function allServiceData(req) {
    try {
        const result = await Services.find({})
            .sort({ createdAt: 'desc' })
            .populate('createdBy', 'name')
            .populate('createdByAdmin', 'name')
            .populate('category', 'categoryName');
        if (result && result.length > 0) {
            //    console.log("service-list ", result)
            return result
        }
    } catch (error) {
        console.log(error);
    }
}


async function getServiceItems(req) {
    try {
        let id = req.params.id;
        //  console.log(id)
        let result = await Services.find({ $or: [{ createdBy: id }, { _id: id }] })
            .select(
            // "serviceCode name featuredImage imageId description isActive createdAt"
        )
            .populate({
                path: "category",
                model: Category,
                select: "categoryName",
            })
            .exec(); // Added exec() to execute the query

        if (result.length > 0) {
            return result;
        } else {
            return [];
        }
    } catch (err) {
        console.log("Error", err);
        throw err;
    }
}


async function getAdminCategories(req) {
    try {
        const result = await Category.find({ isActive: true, isService: true, })
            .sort({ createdAt: 'desc' })
        if (result && result.length > 0) {
            // console.log("service-list ", result)
            return result
        }
    } catch (error) {
        console.log(error);
    }
}
// console.log(Category)


async function editService(req) {
    try {
        const id = req.params.id;
        const param = req.body;
        const statusData = {
            name: param.name,
            category: param.category,
            description: param.description,
            featuredImage: param.featuredImage,
            imageId: param.imageId,
            updatedBy: param.seller_id,
        };

        const updatedOrder = await Services.findOneAndUpdate(
            { _id: id },
            statusData,
            { new: true }
        );
        if (!updatedOrder) {
            // console.log("Service not found.");
            return null;
        }

        //  console.log("Service updated successfully:", updatedOrder);
        return updatedOrder;
    } catch (err) {
        console.log("Error:", err);
        throw err;
    }
}

async function deleteService(req) {
    const id = req.params.id;
    // console.log('id for delete:',id)
    try {
        const deleted = await Services.findByIdAndDelete(id);
        return deleted;
    } catch (error) {
        console.error("Error deleting service:", error);
    }
}

async function statusChange(req) {
    const id = req.params.id;
    try {
        const service = await Services.findById(id).select("isActive");
        service.isActive = !service.isActive;    // Toggle the isActive status
        await service.save();  // Save the updated service
        return service;
    } catch (error) {
        console.error("Error deleting service:", error);
    }
}

async function userServiceOrders(req) {
    try {
        const result = await OrderDetails.find({ isService: true})
            .sort({ createdAt: 'desc' })
            .populate({
                path: "serviceId",
                model: Services,
                select: "createdBy createdByAdmin name",
                populate: [
                    {
                        path: "createdBy",
                        model: Seller,
                        select: "name email _id"
                    },
                    {
                        path: "createdByAdmin",
                        model: Admin,
                        select: "name email _id"
                    }
                ]
            },
            )
            .populate({
                path: "userId",
                model: User,
                select: "name email _id"
            },)
        //  .populate('category', 'categoryName');
        if (result && result.length > 0) {
            //    console.log("service-list ", result)
            return result
        }
    } catch (error) {
        console.log(error);
    }
}

// Chat ******************************************************
//getAllUser

async function getAllUser(req) {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const [users, sellers, admins] = await Promise.all([
        User.find(keyword).select("name email role image_url"),
        Seller.find(keyword).select("name email role image_url"),
        Admin.find(keyword).select("name email role image_url"),
    ]);

    let result = [];
    users.forEach((user) => {
        const correspondingSeller = sellers.find(
            (seller) => seller.email === user.email
        );
        const correspondingAdmin = admins.find(
            (admin) => admin.email === user.email
        );
        result.push({
            user: user,
            seller: correspondingSeller || null,
            admin: correspondingAdmin || null,
        });
    });

    sellers.forEach((seller) => {
        if (!users.find((user) => user.email === seller.email)) {
            const correspondingAdmin = admins.find(
                (admin) => admin.email === seller.email
            );
            result.push({
                user: null,
                seller: seller,
                admin: correspondingAdmin || null,
            });
        }
    });

    admins.forEach((admin) => {
        if (!users.find((user) => user.email === admin.email) &&
            !sellers.find((seller) => seller.email === admin.email)) {
            result.push({
                user: null,
                seller: null,
                admin: admin,
            });
        }
    });
    return result;
}



async function accessChat(req) {
    const { receiverId, authorId } = req.body;
    if (!receiverId) {
        console.log("receiverId not send in request")
    }
    // const finalChatdata = await Chat.findOne({ authorId: authorId.name, receiverId: receiverId.name });
    var isChat = await Chat.find({
        isGroupChat: false,
        $or: [
            {
                $and: [
                    { 'chatUsers.id': authorId.id },
                    { 'chatUsers.id': receiverId.id }
                ]
            },
            {
                $and: [
                    { 'chatUsers.id': receiverId.id },
                    { 'chatUsers.id': authorId.id }
                ]
            }
        ]
    }).sort({ createdAt: "desc" }).populate("latestMessage");
    // console.log("isChat", isChat.length)

    if (isChat.length > 0) {
        return isChat[0];
    } else {
        const newReceiverIds = [authorId, receiverId];
        // console.log("newReceiverIds", newReceiverIds)
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            chatUsers: newReceiverIds,
        };
        try {
            // console.log("chatData :  ", chatData)
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id })
            // console.log("fullChatData", fullChat)
            return fullChat;
        } catch (error) {
            console.log("error", error)
        }
    }
}

async function fetchChat(req) {
    const authorId = req.params.id;
    try {
        const query = {
            isBlock: false,
            'chatUsers.id': authorId
        };

        const fieldsToSelect = "id chatName isGroupChat isBlock chatUsers latestMessage";
        let result = await Chat.find(query).sort({ createdAt: "desc" }).select(fieldsToSelect)
            .populate({
                path: 'latestMessage',
                match: { isVisible: true },
                select: 'messageContent mediaContent timestamp'
            });
        // console.log("result", result)

        result = result.sort((a, b) => {
            if (a.latestMessage && b.latestMessage) {
                return new Date(b.latestMessage.timestamp) - new Date(a.latestMessage.timestamp);
            } else if (a.latestMessage) {
                return -1;
            } else if (b.latestMessage) {
                return 1;
            } else {
                return 0;
            }
        });

        return result;
    } catch (error) {
        console.log(error);
    }
}

async function fetchBlockChat(req) {
    const authorId = req.params.id;
    try {
        const query = {
            isBlock: true,
            'chatUsers.id': authorId
        };

        const fieldsToSelect = "id chatName isGroupChat isBlock blockByUser chatUsers";
        const result = await Chat.find(query).sort({ createdAt: "desc" }).select(fieldsToSelect);
        // console.log("result", result)
        return result;
    } catch (error) {
        console.log(error);
    }
}


async function sendMessage(req) {
    const { authorId, messageContent, chatId, mediaContent } = req.body;

    if (!chatId || !authorId) {
        console.log("Invalid Data pass")
    }

    var newMessage = {
        sender: authorId,
        messageContent: messageContent,
        mediaContent: mediaContent,
        chat: chatId
    }

    try {
        var message = await ChatMessage.create(newMessage);
        message = await message.populate({
            path: "chat",
            model: Chat,
        })
        // .populate({
        //   path: "latestMessage",
        //   model: ChatMessage,
        // })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });
        // console.log("message", message)
        return message

    } catch (error) {
        console.log(error)
    }
}


async function allMessages(req) {
    const chatId = req.params.id;

    try {
        const message = await ChatMessage.find({ chat: chatId, isVisible: true })
            .populate({
                path: "chat",
                model: Chat,
            })
        // console.log("All message", message)
        return message

    } catch (error) {
        console.log(error)
    }
}


async function userChatBlock(req) {
    const chatId = req.params.id;
    const { isBlock, blockByUser } = req.body;
    try {
        const chat = await Chat.findByIdAndUpdate(chatId, { isBlock, blockByUser }, { new: true });
        //  console.log("update banner", banner)
        return chat;
    } catch (error) {
        console.log(error)
    }
}


async function userUnblockChat(req) {
    const chatId = req.params.id;
    const { isBlock, blockByUser } = req.body;
    try {
        const chat = await Chat.findByIdAndUpdate(chatId, { isBlock, blockByUser }, { new: true });
        //  console.log("update banner", banner)
        return chat;
    } catch (error) {
        console.log(error)
    }
}

// User Block chat..
async function chatMessageDelete(req) {
    const id = req.params.id;
    const { isVisible } = req.body;
    try {
        const chatMessage = await ChatMessage.findByIdAndUpdate(id, { isVisible }, { new: true });
        //  console.log("update banner", banner)
        return chatMessage;
    } catch (error) {
        console.log(error)
    }
}

// remove from group
async function removeFromGroup(req) {
    const { chatId, userId } = req.body;
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { chatUsers: { id: userId } } },
            { new: true }
        );
        return updatedChat;
    } catch (error) {
        console.log(error)
    }
}


async function addGroupMember(req) {
    const chatId = req.params.id;
    const { id, name, image_url, isGroupAdmin } = req.body;
    try {
        const addUser = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { chatUsers: { id, name, image_url, isGroupAdmin } } },
            { new: true });
        //  console.log("update banner", banner)
        return addUser;
    } catch (error) {
        console.log(error)
    }
}


async function createGroupChat(req) {
    const { authorId, receiverId, groupName } = req.body;

    if (!receiverId || !Array.isArray(receiverId) || receiverId.length === 0) {
        console.log("Please field add details....")
    }


    // const finalChatdata = await Chat.findOne({ authorId: authorId.name, receiverId: receiverId.name });

    var isChat = await Chat.find({
        isGroupChat: true,
        chatName: groupName,
    }).sort({ createdAt: "desc" });

    // console.log("isChat", isChat.length)

    if (isChat.length > 0) {
        return isChat[0];
    } else {

        const receiverData = receiverId.map(receiver => ({
            id: receiver.id,
            name: receiver.name,
            image_url: receiver.image_url
        }));

        receiverData.push(authorId)



        // console.log("receiverData", receiverData);

        var chatData = {
            chatName: groupName,
            isGroupChat: true,
            chatUsers: receiverData,

            // usersAll: [{
            //   authorId: authorId,
            //   users: receiverData
            // }],
        };
        try {
            // console.log("chatData :  ", chatData)
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id })
            // console.log("fullChatData", fullChat)
            return fullChat;
        } catch (error) {
            console.log("error", error)
        }
    }
}

async function updateGroupName(req) {
    // const chatId = req.params.id;
    const { chatId, groupName } = req.body;

    // console.log("chatId", chatId);
    // console.log("groupName", groupName);
    try {
        const chatData = await Chat.findByIdAndUpdate(chatId,
            { $set: { chatName: groupName } },
            { new: true }
        );
        return chatData;
    } catch (error) {
        console.log(error);
    }
}