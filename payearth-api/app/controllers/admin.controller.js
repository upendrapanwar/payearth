const config = require('../config/index');
const { array } = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const adminService = require('../services/admin.service');
const { registerValidation, loginValidation } = require('../validations/admin.validation');
const msg = require('../helpers/messages.json');
const multer = require('multer');


//Brand File Upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadDir + '/brands');
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newName = file.fieldname + "-" + Math.floor(Math.random() * 10000) + "-" + Date.now() + "." + extension;
        cb(null, newName);
    }
});

const imageFilter = function (req, file, cb) {
    // Accept image only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image file is allowed!';
        return cb(new Error('Only image file is allowed!'), false);
    }
    cb(null, true);
};

var uploadBrand = multer({ storage: storage, fileFilter: imageFilter, limits: { fileSize: 1024 * 1024 * 5 }, }).single("file");



//Deal File Upload
var storageDeal = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadDir + '/deals');
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newName = file.fieldname + "-" + Math.floor(Math.random() * 10000) + "-" + Date.now() + "." + extension;
        cb(null, newName);
    }
});

const imageFilterDeal = function (req, file, cb) {
    // Accept image only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image file is allowed!';
        return cb(new Error('Only image file is allowed!'), false);
    }
    cb(null, true);
};

var uploadDeal = multer({ storage: storageDeal, fileFilter: imageFilterDeal, limits: { fileSize: 1024 * 1024 * 5 }, }).single("file");

//Multi Banner Files Upload
var storageBannerMultiple = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadDir + '/banner');
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newName = "IMG-" + Math.floor(Math.random() * 1000000) + "-" + Date.now() + "." + extension;
        cb(null, newName);
    }
});

const fileFilterBannerMultiple = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var uploadBannerMultiple = multer({ storage: storageBannerMultiple, fileFilter: fileFilterBannerMultiple, limits: { fileSize: 1024 * 1024 * 5 }, });



// Routes
router.post('/login', loginValidation, authenticate);
router.post('/signup', registerValidation, register);
router.post('/users', getUsers);
router.post('/userDetails', getUserDetails);
router.post('/sellers', getSellers);
router.post('/coupons', createCoupon);
router.post('/coupons/new', getNewCoupons);
router.post('/coupons/expired', getExpiredCoupons);
router.post('/forgot-password', forgotPass);
router.put('/reset-password', resetPass);
router.put('/change-password/:id', changePass);
router.get('/users/:id', getUserById);
router.get('/sellers/:id', getSellerById);
// router.put('/status-update/:id', statusUpdate);
// router.delete('/:id', _delete);

//Category
router.post('/categories', createCategory);
router.put('/categories/:id', editCategory);
router.put('/categories/status/:id', statusCategory);
router.get('/categories', listCategory);
router.get('/service-categories-list', ServiceCategorylist);
router.get('/categorybyid/:id', getCategoryById);
router.delete('/categories/:id', deleteCategory);

//Brand
router.post('/brands', uploadBrand, createBrand);
router.put('/brands/:id', uploadBrand, editBrand);
router.put('/brands/status/:id', statusBrand);
router.get('/brands', listBrand);
router.get('/brandbyid/:id', getBrand);
router.delete('/brands/:id', deleteBrand);

//Deal
router.post('/deals', uploadDeal, createDeal);
router.put('/deals/:id', uploadDeal, editDeal);
router.put('/deals/status/:id', statusDeal);
router.get('/deals', listDeal);
router.delete('/deals/:id', deleteDeal);


//Banner
router.post('/banners', uploadBannerMultiple.array('banner_images', 10), createBanner);
router.put('/banners/:id', uploadBannerMultiple.array('banner_images', 10), editBanner);
router.put('/banners/status/:id', statusBanner);
router.get('/banners', listBanner);
router.delete('/banners/:id', deleteBanner);

//TrendingProduct
router.post('/trendingproducts', createTrendingProduct);
router.put('/trendingproducts/status/:id', statusTrendingProduct);
router.get('/trendingproducts', listTrendingProduct);
router.delete('/trendingproducts/:id', deleteTrendingProduct);

//PopularProduct
router.post('/popularproducts', createPopularProduct);
router.put('/popularproducts/status/:id', statusPopularProduct);
router.get('/popularproducts', listPopularProduct);
router.delete('/popularproducts/:id', deletePopularProduct);

//Color
router.post('/colors', createColor);
router.put('/colors/:id', editColor);
router.put('/colors/status/:id', statusColor);
router.get('/colors', listColor);
router.delete('/colors/:id', deleteColor);

//Orders Management
router.post('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.post('/user-orders', getUserOrders);

//Order status Management
router.post('/getorderstatus', getOrderstatus);

//Payments Management
router.post('/payments', getPayments);
router.get('/payments/:id', getPaymentById);

//Dashboard Management
router.get('/dashboard-counters', getDashboardCounters);
router.post('/product-sales', getProductSales);

router.get('/orderdatabypayid/:id', getOrderDataBypaymentId);
router.get('/productbyid/:id', getproductData);

router.post('/cmsPost', createCmsPost);
router.get("/getCmsAllPost", getCmsPost);
router.delete('/deletePost/:id', deletePost);
router.put("/cmsUpdatePost/:id", cmsUpdatePost);
router.get("/cmsGetPostById/:id", cmsGetPostById)
router.get("/cmsGetByStatus/:status", cmsGetByStatus);
router.get('/postSlug', getAllPostSlug)
router.post("/cmsPage", createCmsPage);
router.get("/cmsPageByStatus/:status", cmsPageGetByStatus);
router.get("/cmsGetPageById/:id", cmsGetPageById);
router.put("/cmsUpdatePage/:id", cmsUpdatePage);
router.delete("/deletePage/:id", deletePage);
router.get('/pageSlug', getAllPageSlug)
router.post("/cmsCategory", createCmsCategory);
router.get("/getCmsAllCategory", getCmsCategoryData);
router.get("/cmsGetCategoryById/:id", cmsGetCategoryById);
router.put("/cmsUpdateCategory/:id", cmsUpdateCategory);
router.delete("/categoryDelete/:id", categoryDelete);
router.get("/banner-list", getAllBannersData);
router.delete("/banner/:id", deleteBannerAdv);
router.get("/getBannerById/:id", getBannerById);
router.put("/updateBanner/:id", updateBanner);
router.post("/createNewBanner", createNewBanner);

router.post("/services", addService);                             //$$$$$$$$$$$$$$$$$$$
router.get("/services", allServiceData);
router.get("/service/items/:id", getServiceItems);
router.get("/getcategories", getAdminCategories);            //  change
router.put('/service/edit/:id', editService);
router.delete("/services/delete/:id", deleteService);
router.put("/service/status/:id", statusChange);
router.get("/service-order", userServiceOrders);

router.get("/getAllUser", getAllUser);
router.post("/accessChat", accessChat);
router.post("/createGroupChat", createGroupChat);
router.get("/fetchChat/:id", fetchChat);
router.get("/fetchBlockChat/:id", fetchBlockChat);
router.post("/sendMessage", sendMessage)
router.get("/allMessages/:id", allMessages);
router.put("/userChatBlock/:id", userChatBlock);
router.put("/userUnblockChat/:id", userUnblockChat);
router.put("/messageDelete/:id", chatMessageDelete);
router.put("/removeFromGroup", removeFromGroup)
router.put("/addGroupMember/:id", addGroupMember);
router.put("/updateGroupName", updateGroupName);


module.exports = router;

function register(req, res, next) {
    adminService.signup(req.body)
        .then(admin => admin ? res.status(201).json({ status: true, message: msg.admin.signup.success, data: admin }) : res.status(400).json({ status: false, message: msg.admin.signup.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function authenticate(req, res, next) {

    adminService.authenticate(req.body)
        .then(admin => admin ? (admin && admin.isActive == true ? res.json({ status: true, message: msg.admin.login.success, data: admin }) : res.json({ status: false, message: msg.admin.login.active })) : res.json({ status: false, message: msg.admin.login.error }))
        .catch(err => next(err));
}

function forgotPass(req, res, next) {
    adminService.forgotPass(req.body)
        .then(admin => admin ? res.status(200).json({ status: true, message: msg.admin.password.verif_link }) : res.status(400).json({ status: false, message: msg.admin.password.email_exist }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function resetPass(req, res, next) {
    adminService.resetPass(req.body)
        .then(admin => admin ? res.status(200).json({ status: true, message: msg.admin.password.reset_success }) : res.status(400).json({ status: false, message: msg.admin.password.verif_link_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function changePass(req, res, next) {
    adminService.changePass(req.params.id, req.body)
        .then(admin => admin ? res.json({ status: true, message: msg.admin.password.update_success }) : res.json({ status: false, message: msg.common.no_user_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}


function getUsers(req, res, next) {
    adminService.getUsers(req)
        .then(users => users ? res.status(200).json({ status: true, data: users }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getUserDetails(req, res, next) {
    adminService.getUserDetails(req)
        .then(users => users ? res.status(200).json({ status: true, data: users }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getSellers(req, res, next) {
    adminService.getSellers(req)
        .then(sellers => sellers ? res.status(200).json({ status: true, data: sellers }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function createCoupon(req, res, next) {
    adminService.createCoupon(req.body)
        .then(coupon => coupon ? res.status(200).json({ status: true, message: msg.admin.coupon.success, data: coupon }) : res.status(400).json({ status: false, message: msg.admin.coupon.error }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getNewCoupons(req, res, next) {
    adminService.getNewCoupons(req)
        .then(coupons => coupons ? res.status(200).json({ status: true, data: coupons }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getExpiredCoupons(req, res, next) {
    adminService.getExpiredCoupons(req)
        .then(coupons => coupons ? res.status(200).json({ status: true, data: coupons }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// function getById(req, res, next) {
//     adminService.getById(req.params.id)
//         .then(admin => admin ? res.json({ status: true, data: admin }) : res.json({ status: false, message: msg.common.no_user_err }))
//         .catch(err => next(res.json({ status: false, message: err })));
// }


// function statusUpdate(req, res, next) {

//     adminService.statusUpdate(req.params.id, req.body)
//         .then(admin => admin ? res.json({ status: true, message: msg.admin.users.status_update, data: admin }) : res.json({ status: false, message: msg.common.no_user_err }))
//         .catch(err => next(res.json({ status: false, message: err })));
// }

// function _delete(req, res, next) {
//     adminService.delete(req.params.id)
//         .then(admin => admin ? res.json({ status: true, message: msg.admin.users.delete }) : res.json({ status: false, message: msg.common.no_user_err }))
//         .catch(err => next(res.json({ status: false, message: err })));
// }


//Category

function createCategory(req, res, next) {
    adminService.createCategory(req.body)
        .then(category => category ? res.status(201).json({ status: true, message: msg.admin.category.add.success, data: category }) : res.status(400).json({ status: false, message: msg.admin.category.add.error }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function editCategory(req, res, next) {
    adminService.editCategory(req)
        .then(category => category ? res.status(200).json({ status: true, message: msg.admin.category.edit.success, data: category }) : res.status(400).json({ status: false, message: msg.admin.category.edit.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function listCategory(req, res, next) {
    adminService.getCateogries()
        .then(categories => categories ? res.status(200).json({ status: true, data: categories }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function ServiceCategorylist(req, res, next) {
    adminService.getServiceCategorylist()
        .then(categories => categories ? res.status(200).json({ status: true, data: categories }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getCategoryById(req, res, next) {
    adminService.getCateogyById(req.params.id)
        .then(categories => categories ? res.status(200).json({ status: true, data: categories }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
function deleteCategory(req, res, next) {
    adminService.deleteCategory(req.params.id)
        .then(category => category ? res.json({ status: true, message: msg.admin.category.delete }) : res.json({ status: false, message: msg.common.no_data_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function statusCategory(req, res, next) {
    adminService.statusCategory(req)
        .then(category => category ? res.status(201).json({ status: true, message: msg.admin.category.status.success, data: category }) : res.status(400).json({ status: false, message: msg.admin.category.status.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

//Brand

function createBrand(req, res, next) {
    adminService.createBrand(req)
        .then(brand => brand ? res.status(201).json({ status: true, message: msg.admin.brand.add.success, data: brand }) : res.status(400).json({ status: false, message: msg.admin.brand.add.error }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function editBrand(req, res, next) {
    adminService.editBrand(req)
        .then(brand => brand ? res.status(200).json({ status: true, message: msg.admin.brand.edit.success, data: brand }) : res.status(400).json({ status: false, message: msg.admin.brand.edit.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function listBrand(req, res, next) {
    adminService.getBrands()
        .then(brands => brands ? res.status(200).json({ status: true, data: brands }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
function getBrand(req, res, next) {
    adminService.getBrandById(req.params.id)
        .then(brands => brands ? res.status(200).json({ status: true, data: brands }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
function deleteBrand(req, res, next) {
    adminService.deleteBrand(req.params.id)
        .then(brand => brand ? res.json({ status: true, message: msg.admin.brand.delete }) : res.json({ status: false, message: msg.common.no_data_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function statusBrand(req, res, next) {
    adminService.statusBrand(req)
        .then(brand => brand ? res.status(201).json({ status: true, message: msg.admin.brand.status.success, data: brand }) : res.status(400).json({ status: false, message: msg.admin.brand.status.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}


//Deal

function createDeal(req, res, next) {
    adminService.createDeal(req)
        .then(deal => deal ? res.status(201).json({ status: true, message: msg.admin.deal.add.success, data: deal }) : res.status(400).json({ status: false, message: msg.admin.deal.add.error }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function editDeal(req, res, next) {
    adminService.editDeal(req)
        .then(deal => deal ? res.status(200).json({ status: true, message: msg.admin.deal.edit.success, data: deal }) : res.status(400).json({ status: false, message: msg.admin.deal.edit.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function listDeal(req, res, next) {
    adminService.getDeals()
        .then(deals => deals ? res.status(200).json({ status: true, data: deals }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function deleteDeal(req, res, next) {
    adminService.deleteDeal(req.params.id)
        .then(deal => deal ? res.json({ status: true, message: msg.admin.deal.delete }) : res.json({ status: false, message: msg.common.no_data_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function statusDeal(req, res, next) {
    adminService.statusDeal(req)
        .then(deal => deal ? res.status(201).json({ status: true, message: msg.admin.deal.status.success, data: deal }) : res.status(400).json({ status: false, message: msg.admin.deal.status.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

//Banner

function createBanner(req, res, next) {
    adminService.createBanner(req)
        .then(banner => banner ? res.status(201).json({ status: true, message: msg.admin.banner.add.success, data: banner }) : res.status(400).json({ status: false, message: msg.admin.banner.add.error }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function editBanner(req, res, next) {
    adminService.editBanner(req)
        .then(banner => banner ? res.status(200).json({ status: true, message: msg.admin.banner.edit.success, data: banner }) : res.status(400).json({ status: false, message: msg.admin.banner.edit.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function listBanner(req, res, next) {
    adminService.getBanners()
        .then(banners => banners ? res.status(200).json({ status: true, data: banners }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function deleteBanner(req, res, next) {
    adminService.deleteBanner(req.params.id)
        .then(banner => banner ? res.json({ status: true, message: msg.admin.banner.delete }) : res.json({ status: false, message: msg.common.no_data_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function statusBanner(req, res, next) {
    adminService.statusBanner(req)
        .then(banner => banner ? res.status(201).json({ status: true, message: msg.admin.banner.status.success, data: banner }) : res.status(400).json({ status: false, message: msg.admin.banner.status.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

//TrendingProduct

function createTrendingProduct(req, res, next) {
    adminService.createTrendingProduct(req.body)
        .then(trendingproduct => trendingproduct ? res.status(201).json({ status: true, message: msg.admin.trendingproduct.add.success, data: trendingproduct }) : res.status(400).json({ status: false, message: msg.admin.trendingproduct.add.error }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function listTrendingProduct(req, res, next) {
    adminService.getTrendingProducts()
        .then(trendingproducts => trendingproducts ? res.status(200).json({ status: true, data: trendingproducts }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function deleteTrendingProduct(req, res, next) {
    adminService.deleteTrendingProduct(req.params.id)
        .then(trendingproduct => trendingproduct ? res.json({ status: true, message: msg.admin.trendingproduct.delete }) : res.json({ status: false, message: msg.common.no_data_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function statusTrendingProduct(req, res, next) {
    adminService.statusTrendingProduct(req)
        .then(trendingproduct => trendingproduct ? res.status(201).json({ status: true, message: msg.admin.trendingproduct.status.success, data: trendingproduct }) : res.status(400).json({ status: false, message: msg.admin.trendingproduct.status.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}


//PopularProduct

function createPopularProduct(req, res, next) {
    adminService.createPopularProduct(req.body)
        .then(popularproduct => popularproduct ? res.status(201).json({ status: true, message: msg.admin.popularproduct.add.success, data: popularproduct }) : res.status(400).json({ status: false, message: msg.admin.popularproduct.add.error }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function listPopularProduct(req, res, next) {
    adminService.getPopularProducts()
        .then(popularproducts => popularproducts ? res.status(200).json({ status: true, data: popularproducts }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function deletePopularProduct(req, res, next) {
    adminService.deletePopularProduct(req.params.id)
        .then(popularproduct => popularproduct ? res.json({ status: true, message: msg.admin.popularproduct.delete }) : res.json({ status: false, message: msg.common.no_data_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function statusPopularProduct(req, res, next) {
    adminService.statusPopularProduct(req)
        .then(popularproduct => popularproduct ? res.status(201).json({ status: true, message: msg.admin.popularproduct.status.success, data: popularproduct }) : res.status(400).json({ status: false, message: msg.admin.popularproduct.status.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}


//Color

function createColor(req, res, next) {
    adminService.createColor(req)
        .then(color => color ? res.status(201).json({ status: true, message: msg.admin.color.add.success, data: color }) : res.status(400).json({ status: false, message: msg.admin.color.add.error }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function editColor(req, res, next) {
    adminService.editColor(req)
        .then(color => color ? res.status(200).json({ status: true, message: msg.admin.color.edit.success, data: color }) : res.status(400).json({ status: false, message: msg.admin.color.edit.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function listColor(req, res, next) {
    adminService.getColors()
        .then(colors => colors ? res.status(200).json({ status: true, data: colors }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function deleteColor(req, res, next) {
    adminService.deleteColor(req.params.id)
        .then(color => color ? res.json({ status: true, message: msg.admin.color.delete }) : res.json({ status: false, message: msg.common.no_data_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function statusColor(req, res, next) {
    adminService.statusColor(req)
        .then(color => color ? res.status(201).json({ status: true, message: msg.admin.color.status.success, data: color }) : res.status(400).json({ status: false, message: msg.admin.color.status.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

//Orders 

function getOrders(req, res, next) {
    adminService.getOrders(req)
        .then(orders => orders ? res.status(200).json({ status: true, data: orders }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
function getUserOrders(req, res, next) {
    adminService.getUserOrders(req)
        .then(orders => orders ? res.status(200).json({ status: true, data: orders }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}


function getOrderById(req, res, next) {
    adminService.getOrderById(req.params.id)
        .then(order => order ? res.status(200).json({ status: true, data: order }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}
/******************************************************************************/
/******************************************************************************/

/**
 * Get the order status 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @returns JSON| boolean
 */
function getOrderstatus(req, res, next) {
    adminService.getOrderstatus(req)
        .then(orderstatus => orderstatus ? res.status(200).json({ status: true, data: orderstatus }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
/******************************************************************************/
/******************************************************************************/
/**
 * Get the order data by payment Id
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @returns JSON| boolean
 */
function getOrderDataBypaymentId(req, res, next) {
    adminService.getOrderDataBypaymentId(req.params.id)
        .then(orderData => orderData ? res.status(200).json({ status: true, data: orderData }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })))
}
/******************************************************************************/
/******************************************************************************/
/**
 * Get the product data by id
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @returns JSON| boolean
 */
function getproductData(req, res, next) {
    adminService.getproductData(req.params.id)
        .then(products => products ? res.status(200).json({ status: true, data: products }) : res.status(400).json({ status: false, message: msg.commom.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
/******************************************************************************/
/******************************************************************************/
function getPayments(req, res, next) {
    //console.log(req);
    adminService.getPayments(req)
        .then(payments => payments ? res.status(200).json({ status: true, data: payments }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getPaymentById(req, res, next) {
    //var _id = ObjectId.fromString( req.params.id );
    adminService.getPaymentById(req.params.id)
        .then(payment => payment ? res.status(200).json({ status: true, data: payment }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getUserById(req, res, next) {
    adminService.getUserById(req.params.id)
        .then(user => user ? res.status(200).json({ status: true, data: user }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getSellerById(req, res, next) {
    adminService.getSellerById(req.params.id)
        .then(seller => seller ? res.status(200).json({ status: true, data: seller }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getDashboardCounters(req, res, next) {
    adminService.getDashboardCounters()
        .then(counters => counters ? res.status(200).json({ status: true, data: counters }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getProductSales(req, res, next) {
    adminService.getProductSales(req)
        .then(sales => sales ? res.status(200).json({ status: true, data: sales }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// CMS..................
function createCmsPost(req, res, next) {
    adminService.createCmsPost(req)
        .then(posts => posts ? res.status(200).json({ status: true, data: posts }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
function getCmsPost(req, res, next) {
    adminService.getCmsPostData(req)
        .then(posts => posts ? res.status(200).json({ status: true, data: posts }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
function deletePost(req, res, next) {
    adminService.cmsDeletePost(req)
        .then(post => post ? res.json({ status: true, message: "Successfull Delete" }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}
function cmsUpdatePost(req, res, next) {
    adminService.cmsUpdatePost(req)
        .then(post => post ? res.json({ status: true, message: "Successfull Update" }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsGetPostById(req, res, next) {
    adminService.cmsGetPostById(req)
        .then(posts => posts ? res.status(200).json({ status: true, data: posts }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsGetByStatus(req, res, next) {
    adminService.cmsGetByStatus(req)
        .then(posts => posts ? res.status(200).json({ status: true, data: posts }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// CMS POST..................
function createCmsPost(req, res, next) {
    adminService.createCmsPost(req)
        .then(posts => posts ? res.status(200).json({ status: true, data: posts }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getCmsPost(req, res, next) {
    adminService.getCmsPostData(req)
        .then(posts => posts ? res.status(200).json({ status: true, data: posts }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function deletePost(req, res, next) {
    adminService.cmsDeletePost(req)
        .then(post => post ? res.json({ status: true, message: "Successfull Delete" }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsUpdatePost(req, res, next) {
    adminService.cmsUpdatePost(req)
        .then(post => post ? res.json({ status: true, message: "Successfull Update" }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsGetPostById(req, res, next) {
    adminService.cmsGetPostById(req)
        .then(posts => posts ? res.status(200).json({ status: true, data: posts }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsGetByStatus(req, res, next) {
    adminService.cmsGetByStatus(req)
        .then(posts => posts ? res.status(200).json({ status: true, data: posts }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getAllPostSlug(req, res, next) {
    adminService.getAllPostSlug(req)
        .then(slug => slug ? res.status(200).json({ status: true, data: slug }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// CMS PAGE.....
function createCmsPage(req, res, next) {
    adminService.createCmsPage(req)
        .then(pages => pages ? res.status(200).json({ status: true, data: pages }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsPageGetByStatus(req, res, next) {
    adminService.cmsPageGetByStatus(req)
        .then(pages => pages ? res.status(200).json({ status: true, data: pages }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsGetPageById(req, res, next) {
    adminService.cmsGetPageById(req)
        .then(pages => pages ? res.status(200).json({ status: true, data: pages }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsUpdatePage(req, res, next) {
    adminService.cmsUpdatePage(req)
        .then(page => page ? res.json({ status: true, message: "Successfull Update" }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function deletePage(req, res, next) {
    adminService.cmsDeletePage(req)
        .then(page => page ? res.json({ status: true, message: "Successfull Delete" }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getAllPageSlug(req, res, next) {
    adminService.getAllPageSlug(req)
        .then(slug => slug ? res.status(200).json({ status: true, data: slug }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// category
function createCmsCategory(req, res, next) {
    adminService.createCmsCategory(req)
        .then(category => category ? res.status(200).json({ status: true, data: category }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}



function getCmsCategoryData(req, res, next) {
    adminService.getCmsCategoryData(req)
        .then(cate => cate ? res.status(200).json({ status: true, data: cate }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsGetCategoryById(req, res, next) {
    adminService.cmsGetCategoryById(req)
        .then(cate => cate ? res.status(200).json({ status: true, data: cate }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsUpdateCategory(req, res, next) {
    adminService.cmsUpdateCategory(req)
        .then(cate => cate ? res.json({ status: true, message: "Successfull Update" }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function categoryDelete(req, res, next) {
    adminService.categoryDelete(req)
        .then(cate => cate ? res.json({ status: true, message: "Successfull Delete" }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}

//Banner
function getAllBannersData(req, res, next) {
    adminService.getAllBannersData(req)
        .then(banner => banner ? res.status(200).json({ status: true, data: banner }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function deleteBannerAdv(req, res, next) {
    adminService.deleteBannerAdv(req)
        .then(banner => banner ? res.json({ status: true, message: "Successfull Delete" }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}
function getBannerById(req, res, next) {
    adminService.getBannerById(req)
        .then(banner => banner ? res.status(200).json({ status: true, data: banner }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
function updateBanner(req, res, next) {
    adminService.updateBanner(req)
        .then(banner => banner ? res.json({ status: true, message: "Banner Update Successfully...." }) : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function createNewBanner(req, res, next) {
    adminService.createNewBanner(req)
        .then(banner => banner ? res.status(200).json({ status: true, data: banner }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

//Services

function addService(req, res, next) {
    // console.log('Hello there how are you....');
    // console.log('Req*********', req.body);
    if (req.files && req.files.fileValidationError) {
        return res.status(400).json({ status: false, message: req.files.fileValidationError });
    }

    adminService.addService(req)
        .then(service => {
            if (service) {
                res.status(201).json({ status: true, message: msg.service.add.success, data: service });
            } else {
                res.status(400).json({ status: false, message: msg.service.add.error });
            }
        })
        .catch(err => {
            console.error('Error in addService:', err);
            res.status(500).json({ status: false, message: 'Internal server error' });
        });
}


function allServiceData(req, res, next) {
    adminService.allServiceData(req)
        .then((Service => Service ? res.status(200).json({ status: true, data: Service }) : res.status(400).json({ status: false, message: "ERROR ", data: [] })))
        .catch(err => next(res.json({ status: false, message: err })))
}

function getServiceItems(req, res, next) {
    adminService.getServiceItems(req)
        .then((items) => items
            ? res.status(200).json({ status: true, data: items })
            : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function getAdminCategories(req, res, next) {
    adminService.getAdminCategories(req)
        .then((categories) => categories
            ? res.status(200).json({ status: true, data: categories })
            : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function editService(req, res, next) {
    adminService.editService(req)
        .then((service) => service
            ? res.status(201).json({ status: true, message: msg.service.edit.success, data: service, })
            : res.status(400).json({ status: false, message: msg.service.edit.error }))
        .catch((err) => next(res.status(400).json({ status: false, message: err })));
}

function deleteService(req, res, next) {
    adminService.deleteService(req)
        .then((deleted) => deleted
            ? res.json({ status: true, message: "Successful Delete" })
            : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err.message })));
}

function statusChange(req, res, next) {
    adminService.statusChange(req)
        .then((status) => status
            ? res.json({ status: true, message: "Successful Changed" })
            : res.json({ status: false, message: "ERROR" }))
        .catch(err => next(res.json({ status: false, message: err.message })));
}

// Chat
function getAllUser(req, res, next) {
    adminService.getAllUser(req)
        .then((user) => user ? res.status(200).json({ status: true, data: user }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function accessChat(req, res, next) {
    adminService.accessChat(req)
        .then((chat) => chat ? res.status(201).json({ status: true, data: chat }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch((err) => next(res.status(400).json({ status: false, message: err })));
}

function createGroupChat(req, res, next) {
    adminService.createGroupChat(req)
        .then((chat) => chat ? res.status(201).json({ status: true, data: chat }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch((err) => next(res.status(400).json({ status: false, message: err })));
}

function fetchChat(req, res, next) {
    adminService.fetchChat(req)
        .then((chat) => chat ? res.status(200).json({ status: true, data: chat }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function fetchBlockChat(req, res, next) {
    adminService.fetchBlockChat(req)
        .then((chat) => chat ? res.status(200).json({ status: true, data: chat }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function sendMessage(req, res, next) {
    adminService.sendMessage(req)
        .then((sendChat) => sendChat ? res.status(201).json({ status: true, data: sendChat }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch((err) => next(res.status(400).json({ status: false, message: err })));
}

function allMessages(req, res, next) {
    adminService.allMessages(req)
        .then((allChat) => allChat ? res.status(200).json({ status: true, data: allChat }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function userChatBlock(req, res, next) {
    adminService.userChatBlock(req)
        .then((chatBlock) => chatBlock ? res.json({ status: true, message: "User Block Successfully...." }) : res.json({ status: false, message: "ERROR" }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function userUnblockChat(req, res, next) {
    adminService.userUnblockChat(req)
        .then((chatUnblock) => chatUnblock ? res.json({ status: true, message: "User Unblock Successfully...." }) : res.json({ status: false, message: "ERROR" }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function chatMessageDelete(req, res, next) {
    adminService.chatMessageDelete(req)
        .then((chatMessage) => chatMessage ? res.json({ status: true, message: "Status Change Successfully...." }) : res.json({ status: false, message: "ERROR" }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function removeFromGroup(req, res, next) {
    adminService.removeFromGroup(req)
        .then((removeMember) => removeMember ? res.json({ status: true, message: removeMember }) : res.json({ status: false, message: "ERROR" }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function addGroupMember(req, res, next) {
    adminService.addGroupMember(req)
        .then((addMember) => addMember ? res.json({ status: true, message: "Add Successfully...." }) : res.json({ status: false, message: "ERROR" }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

function updateGroupName(req, res, next) {
    adminService.updateGroupName(req)
        .then((name) => name ? res.json({ status: true, data: name }) : res.json({ status: false, message: "ERROR" }))
        .catch((err) => next(res.json({ status: false, message: err })));
}

//Admin
function userServiceOrders(req, res, next) {
    adminService.userServiceOrders(req)
        .then((items) => items
            ? res.status(200).json({ status: true, data: items })
            : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch((err) => next(res.json({ status: false, message: err })));
}