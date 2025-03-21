//const { array } = require('@hapi/joi');
const express = require('express');
const router = express.Router();
const frontService = require('../services/front.service');
const msg = require('../helpers/messages.json');


//Product Reviews
router.get('/product/reviews/:id', getReviews);
router.get('/product/rating-count/:id', getRatingCount);
router.get('/product/similar-products/:id', getSimilarProducts);
router.get('/popular-brands', getPopularBrands);
router.get('/allProductBrands', getProductBrands);
router.get('/allProductCategory', getProductCategory);
router.get('/product/trending/:limit', getTrendingProducts);
router.get('/product/popular/:limit', getPopularProducts);
router.get('/product/recent-search/:limit', getRecentSearchProducts);
router.get('/product/today-deals', getTodayDeals);
router.get('/banner-images/:page', getBannerImages);

//Common for products and services
router.post('/product/categories/menu', getCategoriesMenu);
router.post('/product/categories/search', getCategoriesSearch);
router.post('/product/listing/categories/:id', getFilterCategories);
router.get('/product/detail/:id', getProductById);

//For products only
router.post('/products/listing', getProductsListing);
router.post("/getProductSubCat", getSubCateProduct);
router.get("/getProductMaxPrice", getProductMaxPrice);

router.post('/product/listing/brands', getBrandsListByProducts);
router.post('/product/listing/colors', getColorsListByProducts);

//For services only
router.post('/service/listing', getServiceListing);
router.get('/service/detail/:id', getServiceById);
router.get("/getServiceMaxPrice", getServiceMaxPrice);

//For Publish Blog
router.get('/publishBlog/:status', cmsPublishBlog);
router.get('/blogDetail/:slug', cmsBlogDetailBySlug);

// For Publish Page
router.get('/publishPage/:status', cmsPublishPage);
router.get('/pageDetail/:slug', cmsPageDetails);


// For banner data show through keywords..

router.get('/advertisement/:slug', advertismentBySlug);
router.get('/advBanner-list/:keywords', getAllBannersData);
router.get('/getAllAdvBanner-list', getAllAdvBannerData);
router.post('/advertiseEventcount', advertiseEventcount);

router.get("/searchFilterProducts", searchFilterProducts);
router.get("/searchFilterServices", searchFilterServices);
router.get("/getServiceCategory", getServiceCategory);
router.get("/getServicesByCategory/:categoryId", getServicesByCategory);

router.post('/notifications', saveNotifications);
router.get('/notifications/:id', getNotifications);
router.put('/updateNotifications/:id', updateNotifications);
router.put('/setNotificationSeen', setNotificationSeen);

router.get('/product/today-dealsById/:id', getTodayDealsProductById)
router.get('/discount-status/:id', getdiscountStatusById)
router.get("/getDisplayedProductTax", getDisplayedProductTax);


module.exports = router;

function getReviews(req, res, next) {
    frontService.getReviews(req.params.id)
        .then(reviews => reviews ? res.status(200).json({ status: true, data: reviews }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getRatingCount(req, res, next) {
    frontService.getRatingCount(req.params.id)
        .then(rating => rating ? res.status(200).json({ status: true, data: rating }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getSimilarProducts(req, res, next) {
    frontService.getSimilarProducts(req.params.id)
        .then(products => products ? res.status(200).json({ status: true, data: products }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getPopularBrands(req, res, next) {
    frontService.getPopularBrands()
        .then(brands => brands ? res.status(200).json({ status: true, data: brands }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getProductBrands(req, res, next) {
    frontService.getProductBrands()
        .then(brands => brands ? res.status(200).json({ status: true, data: brands }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getProductCategory(req, res, next) {
    frontService.getProductCategory()
        .then(brands => brands ? res.status(200).json({ status: true, data: brands }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getSubCateProduct(req, res, next) {
    frontService.getSubCateProduct(req)
        .then((result) => { if (!result.status) { return res.json({ status: false, message: result.message }); } return res.json({ status: true, data: result.data, message: result.message }); })
        .catch((err) => next(res.json({ status: false, message: err.message })));
}

function getCategoriesWithSubcategories(req, res, next) {
    frontService.getCategoriesWithSubcategories(req)
        .then((result) => { if (!result.status) { return res.json({ status: false, message: result.message }); } return res.json({ status: true, data: result.data, message: result.message }); })
        .catch((err) => next(res.json({ status: false, message: err.message })));
}

function getTrendingProducts(req, res, next) {
    frontService.getTrendingProducts(req)
        .then(products => products ? res.status(200).json({ status: true, data: products }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getPopularProducts(req, res, next) {
    frontService.getPopularProducts(req)
        .then(products => products ? res.status(200).json({ status: true, data: products }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getTodayDeals(req, res, next) {
    frontService.getTodayDeals()
        .then(deals => deals ? res.status(200).json({ status: true, data: deals }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getRecentSearchProducts(req, res, next) {
    frontService.getRecentSearchProducts(req)
        .then(products => products ? res.status(200).json({ status: true, data: products }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getBannerImages(req, res, next) {
    frontService.getBannerImages(req.params.page)
        .then(banner => banner ? res.status(200).json({ status: true, data: banner }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getCategoriesSearch(req, res, next) {
    frontService.getCategoriesSearch(req)
        .then(categories => categories ? res.status(200).json({ status: true, data: categories }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getCategoriesMenu(req, res, next) {
    frontService.getCategoriesMenu(req)
        .then(categories => categories ? res.status(200).json({ status: true, data: categories }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}


function getProductsListing(req, res, next) {
    frontService.getProductsListing(req)
        .then(products => products ? res.status(200).json({ status: true, data: products }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: "No data found.", data: [] })));
}

function getProductMaxPrice(req, res, next) {
    frontService.getProductMaxPrice(req)
        .then(max => max ? res.status(200).json({ status: true, data: max }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: "No data found.", data: [] })));
}

function getFilterCategories(req, res, next) {
    frontService.getFilterCategories(req)
        .then(categories => categories && categories.length > 0 ? res.status(200).json({ status: true, data: categories }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getBrandsListByProducts(req, res, next) {
    frontService.getBrandsListByProducts(req)
        .then(brands => brands && brands.length > 0 ? res.status(200).json({ status: true, data: brands }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, data: [], message: err })));
}

function getColorsListByProducts(req, res, next) {
    frontService.getColorsListByProducts(req)
        .then(colors => colors && colors.length > 0 ? res.status(200).json({ status: true, data: colors }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, data: [], message: err })));
}

function getProductById(req, res, next) {
    frontService.getProductById(req.params.id)
        .then(product => product ? res.status(200).json({ status: true, data: product }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getServiceListing(req, res, next) {
    frontService.getServiceListing(req)
        .then(services => services ? res.status(200).json({ status: true, data: services }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: "No data found.", data: [] })));
}

function getServiceMaxPrice(req, res, next) {
    frontService.getServiceMaxPrice(req)
        .then(max => max ? res.status(200).json({ status: true, data: max }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: "No data found.", data: [] })));
}

function getServiceById(req, res, next) {
    frontService.getServiceById(req.params.id)
        .then(service => service ? res.status(200).json({ status: true, data: service }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsPublishBlog(req, res, next) {
    frontService.cmsPublishBlog(req.params.status)
        .then(blog => blog ? res.status(200).json({ status: true, data: blog }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// cmsDetailBySlug
function cmsBlogDetailBySlug(req, res, next) {
    frontService.cmsBlogDetailBySlug(req)
        .then(blog => blog ? res.status(200).json({ status: true, data: blog }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsPublishPage(req, res, next) {
    frontService.cmsPublishPage(req.params.status)
        .then(page => page ? res.status(200).json({ status: true, data: page }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function cmsPageDetails(req, res, next) {
    frontService.cmsPageDetails(req)
        .then(page => page ? res.status(200).json({ status: true, data: page }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// advertisment by slug
function advertismentBySlug(req, res, next) {
    frontService.advertismentBySlug(req)
        .then(adv => adv ? res.status(200).json({ status: true, data: adv }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// BANNER DATA GET WITH KEYWORDS MATCH
function getAllBannersData(req, res, next) {
    frontService.getAllBannersData(req)
        .then(banner => banner ? res.status(200).json({ status: true, data: banner }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// getAllAdvBannerData
function getAllAdvBannerData(req, res, next) {
    frontService.getAllAdvBannerData(req)
        .then(banner => banner ? res.status(200).json({ status: true, data: banner }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// 
function advertiseEventcount(req, res, next) {
    frontService.advertiseEventcount(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// filter & search searchFilterproducts
function searchFilterProducts(req, res, next) {
    frontService.searchFilterProducts(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

// filter & search searchFilterServices
function searchFilterServices(req, res, next) {
    frontService.searchFilterServices(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

//getServiceCategory
function getServiceCategory(req, res, next) {
    frontService.getServiceCategory(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getServicesByCategory(req, res, next) {
    frontService.getServicesByCategory(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function saveNotifications(req, res, next) {
    frontService.saveNotifications(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getNotifications(req, res, next) {
    frontService.getNotifications(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function updateNotifications(req, res, next) {
    frontService.updateNotifications(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function setNotificationSeen(req, res, next) {
    frontService.setNotificationSeen(req)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}


function getTodayDealsProductById(req, res, next) {
    frontService.getTodayDealsProductById(req.params)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getdiscountStatusById(req, res, next) {
    frontService.getdiscountStatusById(req.params)
        .then(data => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getDisplayedProductTax(req, res, next) {
    frontService.getDisplayedProductTax(req)
        .then((result) => result ? res.status(200).json({ status: true, data: result, message: "Data Get Successfully", }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
        .catch((err) => next(res.json({ status: false, message: err })));
}