const config = require('../config/index');
const { array } = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const sellerService = require('../services/seller.service');
const { registerValidation, loginValidation, changePassValidation, forgotPassValidation, resetPassValidation, addProductValidation, editProductValidation, addServiceValidation, editServiceValidation, needHelpValidation, contactUsValidation } = require('../validations/seller.validation');
const msg = require('../helpers/messages.json');
const multer = require('multer');


//Product Images Upload
var storageProduct = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, config.uploadDir + '/products');
    },
    filename: function(req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newName = "IMG-" + Math.floor(Math.random() * 1000000) + "-" + Date.now() + "." + extension;
        cb(null, newName);
    }
});

const fileFilterProduct = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var uploadProduct = multer({ storage: storageProduct, fileFilter: fileFilterProduct, limits: { fileSize: 1024 * 1024 * 5 }, }).any();


//Service Videos Upload
var storageVideo = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'secure_files/product_videos');
    },
    filename: function(req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newName = "VID-" + Math.floor(Math.random() * 10000000) + "-" + Date.now() + "." + extension;
        cb(null, newName);
    }
});

const fileFilterVideo = function(req, file, cb) {
    // Accept videos only
    if (!file.originalname.match(/\.(MP4|MOV|WMV|AVI|MKV|MPEG|mp4|mov|wmv|avi|mkv|mpeg)$/)) {
        req.fileValidationError = 'Only video files are allowed!';
        return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
};

var uploadVideo = multer({ storage: storageVideo, fileFilter: fileFilterVideo }).any();

//Featured Image Upload for products
var storageFeaturedImage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, config.uploadDir + '/products/featured');
    },
    filename: function(req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newName = "IMG-" + Math.floor(Math.random() * 1000000) + "-" + Date.now() + "." + extension;
        cb(null, newName);
    }
});

//Featured Image Upload for services
var storageFeaturedImage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, config.uploadDir + '/services/featured');
    },
    filename: function(req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newName = "IMG-" + Math.floor(Math.random() * 1000000) + "-" + Date.now() + "." + extension;
        cb(null, newName);
    }
});

const imageFilterFeaturedImage = function(req, file, cb) {
    // Accept image only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image file is allowed!';
        return cb(new Error('Only image file is allowed!'), false);
    }
    cb(null, true);
};

var uploadFeaturedImage = multer({ storage: storageFeaturedImage, fileFilter: imageFilterFeaturedImage, limits: { fileSize: 1024 * 1024 * 5 }, }).single("file");

// User Routes
router.post('/login', loginValidation, authenticate);
router.post('/signup', registerValidation, register);
router.get('/countries', getCountries);
router.post('/states', getStatesByCountry);
router.post('/social-login', socialLogin);
router.post('/forgot-password', forgotPassValidation, forgotPass);
router.put('/reset-password', resetPassValidation, resetPass);
router.put('/change-password/:id', changePassValidation, changePass);

//Product Routes
router.post('/products', uploadProduct, addProductValidation, addProduct);
router.put('/products/:id', uploadProduct, editProductValidation, editProduct);
router.post('/products/list/:id', getListedProducts);
router.get('/products/:id', getProductById);
router.post('/products/featured-image', uploadFeaturedImage, addFeaturedImage);
router.get('/colors', getColors);
router.post('/categories', getCategories);
router.get('/brands', getBrands);

//Stock Management
router.post('/stock/items/:id', getStockItems); //product or service  - added / pending / reject
router.put('/stock/items/status-update', productStatusUpdate);

//Orders Management
router.post('/orders/:id', getOrders);
router.get('/orders/:id', getOrderById);
router.post('/saveorder', saveOrder);
router.post('/saveordertracking', saveOrdertrackingTime);
router.post('/saveorderdetails', saveorderdetails);
router.post('/updateorderstatus', updateOrderStatus); 
router.get('/orderstatus', getOrderStatus);
router.post('/coupons/new', getNewCoupons);

//Payments
router.post('/payments/:id', getPayments);
router.post('/savepayment', savepaymentdata);
router.post('/need-help', needHelpValidation, needHelp);
router.post('/contact-us', contactUsValidation, contactUs);

//Dashboard Management
router.get('/dashboard-counters/:id', getDashboardCounters);
router.post('/product-sales/:id', getProductSales);
router.post('/sales-line-chart/:id', getSalesLineChartData);
router.get('/selling-category-donut-chart/:id', getTopSellingCategoryChartData);

//Service Routes
router.post('/services/list/:id', getListedServices);
router.get('/services/:id', getServiceById);
router.post('/create-subscription', createSubscription); 
 
//Service Management
router.post('/services', addService);
router.get('/service/items/:id', getServiceItems); //Service  - added / pending / reject
router.put('/service/items/status-update/:id', serviceStatusUpdate);
router.put('/service/edit/:id', editService);
router.get("/service/getServiceData", getServiceData)
router.get("/service/getServiceStatus/:meetingStatus", getServiceStatus);
router.post("/service/save-calendar-events", saveCalendarEvents);
router.get("/service/get-calendar-events", getCalendarEvents);




module.exports = router;


function register(req, res, next) {
    sellerService.signup(req)
        .then(seller => seller ? res.status(201).json({ status: true, message: msg.seller.signup.success, data: seller }) : res.status(400).json({ status: false, message: msg.seller.signup.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function authenticate(req, res, next) {
    sellerService.authenticate(req.body)
        .then(seller => seller ? (seller && seller.isActive == true ? res.json({ status: true, message: msg.seller.login.success, data: seller }) : res.status(401).json({ status: false, message: msg.seller.login.active })) : res.status(401).json({ status: false, message: msg.seller.login.error }))
        .catch(err => next(err));
}

function getCountries(req, res, next) {
    sellerService.getCountries()
        .then(countries => countries ? res.status(200).json({ status: true, data: countries }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getStatesByCountry(req, res, next) {
    sellerService.getStatesByCountry(req)
        .then(states => states ? res.status(200).json({ status: true, data: states }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}


function socialLogin(req, res, next) {
    sellerService.socialLogin(req)
        .then(seller => seller ? (seller && seller.isActive == true ? res.json({ status: true, message: msg.seller.login.success, data: seller }) : res.status(400).json({ status: false, message: msg.seller.login.active })) : res.status(400).json({ status: false, message: msg.seller.login.error }))
        .catch(err => next(err));
}

function forgotPass(req, res, next) {
    sellerService.forgotPass(req.body)
        .then(seller => seller ? res.status(200).json({ status: true, message: msg.seller.password.verif_link }) : res.status(400).json({ status: false, message: msg.seller.password.email_exist }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function resetPass(req, res, next) {
    sellerService.resetPass(req.body)
        .then(seller => seller ? res.status(200).json({ status: true, message: msg.seller.password.reset_success }) : res.status(400).json({ status: false, message: msg.seller.password.verif_link_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

//Change password when seller is already login.
function changePass(req, res, next) {
    sellerService.changePass(req.params.id, req.body)
        .then(seller => seller ? res.json({ status: true, message: msg.seller.password.update_success }) : res.status(404).json({ status: false, message: msg.common.no_seller_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

//Products

function getListedProducts(req, res, next) {
    sellerService.getListedProducts(req)
        .then(products => products ? res.status(200).json({ status: true, data: products }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getProductById(req, res, next) {
    sellerService.getProductById(req.params.id)
        .then(product => product ? res.status(200).json({ status: true, data: product }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function addFeaturedImage(req, res, next) {
    sellerService.addFeaturedImage(req)
        .then(featuredImage => featuredImage ? res.status(200).json({ status: true, message: msg.featuredImage.success, data: featuredImage }) : res.status(400).json({ status: false, message: msg.featuredImage.error }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function addProduct(req, res, next) {

    if (req.files && req.files.fileValidationError) { return res.status(400).json({ status: false, message: req.files.fileValidationError }) }

    sellerService.addProduct(req)
        .then(product => product ? res.status(201).json({ status: true, message: msg.product.add.success, data: product }) : res.status(400).json({ status: false, message: msg.product.add.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function editProduct(req, res, next) {

    if (req.files && req.files.fileValidationError) { return res.status(400).json({ status: false, message: req.files.fileValidationError }) }

    sellerService.editProduct(req)
        .then(product => product ? res.status(201).json({ status: true, message: msg.product.edit.success, data: product }) : res.status(400).json({ status: false, message: msg.product.edit.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function getStockItems(req, res, next) {
    sellerService.getStockItems(req)
        .then(items => items ? res.status(200).json({ status: true, data: items }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function productStatusUpdate(req, res, next) {
    sellerService.productStatusUpdate(req)
        .then(product => product ? res.json({ status: true, message: msg.product.status.success }) : res.json({ status: false, message: msg.common.no_data_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getOrders(req, res, next) {
    sellerService.getOrders(req)
        .then(orders => orders ? res.status(200).json({ status: true, data: orders }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getPayments(req, res, next) {
    sellerService.getPayments(req)
        .then(payments => payments ? res.status(200).json({ status: true, data: payments }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function savepaymentdata(req, res, next) {
    sellerService.savepaymentdata(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })))
}

function saveOrder(req, res, next) {
    sellerService.saveOrder(req)
        .then(order => order ? res.status(201).json({ status: true, message: msg.user.order.add.success, data: order }) : res.status(400).json({ status: false, message: msg.user.order.add.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function saveOrdertrackingTime(req, res, next) {
    sellerService.saveOrdertrackingTime(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })))
}

function saveorderdetails(req, res, next) {
    sellerService.saveorderdetails(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })))
}

function updateOrderStatus(req, res, next) {
    sellerService.updateOrderStatus(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })))
}

function getOrderStatus(req, res, next) {
    sellerService.getOrderStatus()
        .then(orderstatus => orderstatus ? res.status(200).json({ status: true, data: orderstatus }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getNewCoupons(req, res, next) {
    sellerService.getNewCoupons(req)
        .then(coupons => coupons ? res.status(200).json({ status: true, data: coupons }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getOrderById(req, res, next) {
    sellerService.getOrderById(req.params.id)
        .then(order => order ? res.status(200).json({ status: true, data: order }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}


function getColors(req, res, next) {
    sellerService.getColors()
        .then(colors => colors ? res.status(200).json({ status: true, data: colors }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getCategories(req, res, next) {
    sellerService.getCategories(req)
        .then(categories => categories ? res.status(200).json({ status: true, data: categories }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getBrands(req, res, next) {
    sellerService.getBrands()
        .then(brands => brands ? res.status(200).json({ status: true, data: brands }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function needHelp(req, res, next) {
    sellerService.needHelp(req)
        .then(result => result ? res.status(201).json({ status: true, message: msg.seller.needhelp.success, data: result }) : res.status(400).json({ status: false, message: msg.seller.needhelp.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function contactUs(req, res, next) {
    sellerService.contactUs(req)
        .then(result => result ? res.status(201).json({ status: true, message: msg.seller.contactus.success, data: result }) : res.status(400).json({ status: false, message: msg.seller.contactus.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function getDashboardCounters(req, res, next) {
    sellerService.getDashboardCounters(req.params.id)
        .then(counters => counters ? res.status(200).json({ status: true, data: counters }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getProductSales(req, res, next) {
    sellerService.getProductSales(req)
        .then(sales => sales ? res.status(200).json({ status: true, data: sales }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getSalesLineChartData(req, res, next) {
    sellerService.getSalesLineChartData(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getTopSellingCategoryChartData(req, res, next) {
    sellerService.getTopSellingCategoryChartData(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

//Services

// function addService(req, res, next) {
//     console.log('Hello there how are you....'); 
//     console.log('Req*********', req.body); 
//     if (req.files && req.files.fileValidationError) {
//         return res.status(400).json({ status: false, message: req.files.fileValidationError });
//     }

//     sellerService.addService(req)
//         .then(service => {
//             if (service) {
//                 res.status(201).json({ status: true, message: msg.service.add.success, data: service });
//             } else {
//                 res.status(400).json({ status: false, message: msg.service.add.error });
//             }
//         })
//         .catch(err => {
//             console.error('Error in addService:', err);
//             res.status(500).json({ status: false, message: 'Internal server error' });
//         });
// }


function addService(req, res, next) {
    console.log('Hello there how are you....'); 
    if (req.files && req.files.fileValidationError) { return res.status(400).json({ status: false, message: req.files.fileValidationError }) }

    sellerService.addService(req)
        .then(service => service ? res.status(201).json({ status: true, data: service }) : res.status(400).json({ status: false, message: "Service data not found!" }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

// function addServicesFeaturedImage(req, res, next) {
//     sellerService.addFeaturedImage(req)
//         .then(featuredImage => featuredImage ? res.status(200).json({ status: true, message: msg.featuredImage.success, data: featuredImage }) : res.status(400).json({ status: false, message: msg.featuredImage.error }))
//         .catch(err => next(res.json({ status: false, message: err })));
// }

function editService(req, res, next) {
    sellerService.editService(req)
        .then(service => service ? res.status(201).json({ status: true, message: msg.service.edit.success, data: service }) : res.status(400).json({ status: false, message: msg.service.edit.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function getListedServices(req, res, next) {
    sellerService.getListedServices(req)
        .then(services => services ? res.status(200).json({ status: true, data: services }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getServiceItems(req, res, next) {
    sellerService.getServiceItems(req)
        .then(items => items ? res.status(200).json({ status: true, data: items }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function serviceStatusUpdate(req, res, next) {
    sellerService.serviceStatusUpdate(req)
        .then(product => product ? res.json({ status: true, message: msg.product.status.success }) : res.json({ status: false, message: msg.common.no_data_err }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getServiceById(req, res, next) {
    //console.log('iniside');
    sellerService.getServiceById(req.params.id)
        .then(service => service ? res.status(200).json({ status: true, data: service }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// stripePayment
function createSubscription(req, res, next) {
    console.log("seller controller working")
    sellerService.createSubscription(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

//getServiceData
function getServiceData(req, res, next) {
    sellerService.getServiceData(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getServiceStatus(req, res, next) {
    sellerService.getServiceStatus(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}


function saveCalendarEvents(req, res, next) {
    sellerService.saveCalendarEvents(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}


function getCalendarEvents(req, res, next) {
    sellerService.getCalendarEvents(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}
