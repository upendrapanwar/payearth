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
router.post('/product/listing', getProductListing);
router.post('/product/listing/brands', getBrandsListByProducts);
router.post('/product/listing/colors', getColorsListByProducts);

//For services only
router.post('/service/listing', getServiceListing);
router.get('/service/detail/:id', getServiceById);


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


function getProductListing(req, res, next) {
    frontService.getProductListing(req)
        .then(products => products ? res.status(200).json({ status: true, data: products }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
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

function getServiceById(req, res, next) {
    frontService.getServiceById(req.params.id)
        .then(service => service ? res.status(200).json({ status: true, data: service }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
        .catch(err => next(res.json({ status: false, message: err })));
}