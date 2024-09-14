const config = require('../config/index');
const express = require('express');
const router = express.Router();
const communityService = require('../services/community.service');
const msg = require('../helpers/messages.json');
const multer = require('multer');


//Post Images Upload
var storagePostImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadDir + '/posts/images');
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newName = "IMG-" + Math.floor(Math.random() * 1000000) + "-" + Date.now() + "." + extension;
        cb(null, newName);
    }
});

const fileFilterPost = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var uploadPostImages = multer({ storage: storagePostImage, fileFilter: fileFilterPost, limits: { fileSize: 1024 * 1024 * 5 }, }).any();


//Post Videos Upload
var storagePostVideo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadDir + '/posts/videos');
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newName = "VID-" + Math.floor(Math.random() * 10000000) + "-" + Date.now() + "." + extension;
        cb(null, newName);
    }
});

const fileFilterVideo = function (req, file, cb) {
    // Accept videos only
    if (!file.originalname.match(/\.(MP4|MOV|WMV|AVI|MKV|MPEG|mp4|mov|wmv|avi|mkv|mpeg)$/)) {
        req.fileValidationError = 'Only video files are allowed!';
        return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
};

var uploadPostVideos = multer({ storage: storagePostVideo, fileFilter: fileFilterVideo }).any();

//Routes
router.get('/front/profile/posts/:id', getProfilePosts);
router.get('/front/posts/:id', getPosts);
router.post('/posts', addPost);
router.post('/postImages/:id', uploadPostImages, addPostImages);
router.post('/postVideos/:id', uploadPostVideos, addPostVideos);
router.post('/postLikes/:id', addPostLike);
router.get('/postComments/:id', getPostComments);
router.post('/postComments/:id', addPostComment);
router.post('/follow-user', followUser);
router.post('/unfollowUser', unfollowUser);
router.put('/postRemoved', postDelete);
router.put('/updatePost', updatePost);
router.get("/getPostById/:id", getPostById);
router.post("/createPostReport", createPostReport)

// router.post('/follow-request', sendFollowRequest);
router.get('/front/categories', getCategories);
router.get('/front/products/:id', getProductsByCatId);


module.exports = router;

function getProfilePosts(req, res, next) {
    console.log('api run')
    communityService.getProfilePosts(req)
        .then(result => result ? res.status(200).json({ status: true, data: result }) : res.status(400).json({ status: false, message:'No data found', data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getPosts(req, res, next) {

    communityService.getPosts(req)
        .then(result => result ? res.status(200).json({ status: true, data: result }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function addPost(req, res, next) {

    communityService.createPost(req)
        .then(result => result ? res.status(201).json({ status: true, message: msg.post.add.success, data: result }) : res.status(400).json({ status: false, message: msg.post.add.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function addPostImages(req, res, next) {

    if (req.files && req.files.fileValidationError) {
        return res.status(400).json({ status: false, message: req.files.fileValidationError });
    }

    communityService.addPostImages(req)
        .then(result => result ? res.status(201).json({ status: true, message: msg.postimage.add.success }) : res.status(400).json({ status: false, message: msg.postimage.add.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function addPostVideos(req, res, next) {

    if (req.files && req.files.fileValidationError) {
        return res.status(400).json({ status: false, message: req.files.fileValidationError });
    }

    communityService.addPostVideos(req)
        .then(result => result ? res.status(201).json({ status: true, message: msg.postvideo.add.success }) : res.status(400).json({ status: false, message: msg.postvideo.add.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function addPostLike(req, res, next) {

    communityService.addPostLike(req)
        .then(result => result ? res.status(201).json({ status: true, message: req.body.isLike ? msg.postlike.yes.success : msg.postlike.no.success }) : res.status(400).json({ status: false, message: req.body.isLike ? msg.postlike.yes.error : msg.postlike.no.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function getPostComments(req, res, next) {

    communityService.getPostComments(req)
        .then(result => result ? res.status(200).json({ status: true, data: result }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function addPostComment(req, res, next) {

    communityService.addPostComment(req)
        .then(result => result ? res.status(201).json({ status: true, message: msg.postcomment.add.success, data: result }) : res.status(400).json({ status: false, message: msg.postcomment.add.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function followUser(req, res, next) {
    communityService.followUser(req)
        .then(result => result ? res.status(201).json({ status: true, message: "Followed successfully....!" }) : res.status(400).json({ status: false, message: msg.follow.yes.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function unfollowUser(req, res, next) {
    communityService.unfollowUser(req)
        .then(result => result ? res.status(201).json({ status: true, message: "Unfollowed successfully....!" }) : res.status(400).json({ status: false, message: msg.follow.yes.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function postDelete(req, res, next) {
    communityService.postDelete(req)
        .then(result => result ? res.status(201).json({ status: true, message: "Post Removed..!" }) : res.status(400).json({ status: false, message: msg.follow.yes.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function updatePost(req, res, next) {
    communityService.updatePost(req)
        .then(result => result ? res.status(201).json({ status: true, message: "Updated...!" }) : res.status(400).json({ status: false, message: msg.follow.yes.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function getPostById(req, res, next) {

    communityService.getPostById(req)
        .then(result => result ? res.status(200).json({ status: true, data: result }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function createPostReport(req, res, next) {

    communityService.createPostReport(req)
        .then(result => result ? res.status(201).json({ status: true, data: result }) : res.status(400).json({ status: false, message: msg.post.add.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function sendFollowRequest(req, res, next) {

    communityService.sendFollowRequest(req)
        .then(result => result ? res.status(201).json({ status: true, message: msg.follow.yes.success }) : res.status(400).json({ status: false, message: msg.follow.yes.error }))
        .catch(err => next(res.status(400).json({ status: false, message: err })));
}

function getCategories(req, res, next) {

    communityService.getCategories()
        .then(result => result ? res.status(200).json({ status: true, data: result }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}

function getProductsByCatId(req, res, next) {

    communityService.getProductsByCatId(req)
        .then(result => result ? res.status(200).json({ status: true, data: result }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
        .catch(err => next(res.json({ status: false, message: err })));
}