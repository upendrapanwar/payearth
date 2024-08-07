const config = require('../config/index');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require('ffmpeg-static');

const { Post, FollowRequest, PostImages, PostVideos, PostLike, PostComment, Category, Product, User, Seller, Admin } = require("../helpers/db");

module.exports = {
    getPosts,
    createPost,
    addPostImages,
    addPostVideos,
    addPostLike,
    getPostComments,
    addPostComment,
    followUser,
    unfollowUser,
    postDelete,
    updatePost,
    // sendFollowRequest,
    setFollow,
    getCategories,
    getProductsByCatId,
};

async function getPosts(req) {
    const authorId = req.params.id;
    // console.log("authorId", authorId)
    const user = await User.findById(authorId).populate('community.followingData');
    // console.log("user", user)
    if (!user) {
        return { success: false, message: "User not found" };
    }
    const followerIds = user.community.followingData.map(follower => follower._id);
    // console.log("followerIds", followerIds)

    const posts = await Post.find({
        $or: [
            { postStatus: "Public" },
            {
                postStatus: "Followers",
                userId: { $in: followerIds }
            },
            { userId: authorId }
        ],
        isActive: true
    })
        .sort({ createdAt: 'desc' })
        .populate([
            {
                path: "sellerId",
                model: Seller,
                select: "name image_url community",
                match: { isActive: true },
            },
            {
                path: "userId",
                model: User,
                select: "name image_url community",
                match: { isActive: true },
            },
            {
                path: "postImages",
                model: PostImages,
                select: "url",
                match: { isActive: true }
            },
            {
                path: "postVideos",
                model: PostVideos,
                select: "url",
                match: { isActive: true }
            },
            {
                path: "categoryId",
                model: Category,
                select: "categoryName isService"
                //match: { isActive: true }
            },
            {
                path: "productId",
                model: Product,
                select: "name isService"
                //match: { isActive: true }
            },
            {
                path: "likes",
                model: PostLike,
                select: "-isActive -postId",
                match: { isActive: true },
                populate: [{
                    path: "sellerId",
                    model: Seller,
                    select: "name image_url",
                    match: { isActive: true },
                },
                {
                    path: "userId",
                    model: User,
                    select: "name image_url",
                    match: { isActive: true },
                },
                ]
            },
            {
                path: "comments",
                model: PostComment,
                select: "-isActive -postId",
                match: { isActive: true },
                populate: [{
                    path: "sellerId",
                    model: Seller,
                    select: "name image_url",
                    match: { isActive: true },
                },
                {
                    path: "userId",
                    model: User,
                    select: "name image_url",
                    match: { isActive: true },
                },
                ]
            },
            {
                path: "parentId",
                model: Post,
                match: { isActive: true },
                populate: [{
                    path: "postImages",
                    model: PostImages,
                    select: "url",
                    match: { isActive: true }
                },
                {
                    path: "postVideos",
                    model: PostVideos,
                    select: "url",
                    match: { isActive: true }
                },
                {
                    path: "categoryId",
                    model: Category,
                    select: "categoryName isService"
                    //match: { isActive: true }
                },
                {
                    path: "productId",
                    model: Product,
                    select: "name isService"
                    //match: { isActive: true }
                },
                {
                    path: "sellerId",
                    model: Seller,
                    select: "name image_url",
                    match: { isActive: true },
                },
                {
                    path: "userId",
                    model: User,
                    select: "name image_url",
                    match: { isActive: true },
                },
                {
                    path: "likes",
                    model: PostLike,
                    select: "-isActive -postId",
                    match: { isActive: true },
                    populate: [{
                        path: "sellerId",
                        model: Seller,
                        select: "name image_url",
                        match: { isActive: true },
                    },
                    {
                        path: "userId",
                        model: User,
                        select: "name image_url",
                        match: { isActive: true },
                    },
                    ]
                }
                ]
            }
        ]);
    // console.log("posts", posts)
    if (posts && posts.length > 0) {
        return posts;
    }
    return false;
}


async function createPost(req) {
    const param = req.body;

    let input = {
        postContent: param.content,
        categoryId: param.category_id ? param.category_id : null,
        productId: param.product_id ? param.product_id : null,
        userId: param.user_id ? param.user_id : null,
        sellerId: param.seller_id ? param.seller_id : null,
        isSeller: param.is_seller,
        postStatus: param.post_status,
        postImages: [],
        postVideos: [],
        likeCount: 0,
        likes: [],
        commentCount: 0,
        comments: [],
        parentId: param.parent_id ? param.parent_id : null,
        isActive: true
    };

    const post = new Post(input);

    const data = await post.save();

    if (data) {

        let res = await Post.findById(data.id).select();

        if (res) {
            return res;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

async function addPostImages(req) {
    const { images } = req.body;
    const postId = req.params.id;

    if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ success: false, message: "No videos provided" });
    }

    try {
        var postImages = [];
        var allImagesSaved = true;
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            let input = {
                postId: postId,
                url: image.url,
                isActive: true
            };
            let postImage = new PostImages(input);
            let data = await postImage.save();
            if (data) {
                postImages.push(data.id);
            } else {
                allImagesSaved = false;
                break; // Exit loop if save fails
            }
        }
        if (allImagesSaved) {
            const filter = { _id: postId };
            const updateData = { $push: { postImages: { $each: postImages } } };
            await Post.findOneAndUpdate(filter, updateData, { new: true });
            return postImages
        } else {
            return { success: false, message: "Failed to save" };
        }
    } catch (error) {
        console.log("error", error)
    }

}

async function addPostVideos(req, res) {
    const { videos } = req.body;
    const postId = req.params.id;

    if (!Array.isArray(videos) || videos.length === 0) {
        return res.status(400).json({ success: false, message: "No videos provided" });
    }
    try {
        var postVideos = [];
        var allVideosSaved = true;
        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            let input = {
                postId: postId,
                url: video.url,
                isActive: true
            };
            let postVideo = new PostVideos(input);
            let data = await postVideo.save();
            if (data) {
                postVideos.push(data.id);
            } else {
                allVideosSaved = false;
                break; // Exit loop if save fails
            }
        }
        if (allVideosSaved) {
            const filter = { _id: postId };
            const updateData = { $push: { postVideos: { $each: postVideos } } };
            await Post.findOneAndUpdate(filter, updateData, { new: true });
            return postVideos
        } else {
            return { success: false, message: "Failed to save" };
        }
    } catch (error) {
        console.log("error", error)
    }
}

async function addPostLike(req) {

    const param = req.body;
    const postId = req.params.id;
    const isSeller = param.isSeller;
    const isLike = param.isLike;
    var where = { postId: postId };
    var input = { postId: postId, isActive: true, isSeller: isSeller };

    if (isSeller == true) {
        where['sellerId'] = param.seller_id;
        input['sellerId'] = param.seller_id;
        input['userId'] = null;
    } else {
        where['userId'] = param.user_id;
        input['userId'] = param.user_id;
        input['sellerId'] = null;
    }

    var postLikeData = await PostLike.findOne(where);

    if (postLikeData && isLike == true) {
        throw 'This post is already liked.';
    }

    if (isLike == true) {
        //add row into collection
        const postlike = new PostLike(input);

        const data = await postlike.save();

        if (data) {

            //update in post
            const filter = { _id: postId };
            const updateData = { $push: { likes: data.id }, $inc: { likeCount: 1 } };

            await Post.findOneAndUpdate(filter, updateData, { new: true });

            let result = await PostLike.findById(data.id).select();
            if (result) {
                return result;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {

        //update in post
        const filter = { _id: postId };
        const updateData = { $pull: { likes: postLikeData._id }, $inc: { likeCount: -1 } };

        await Post.findOneAndUpdate(filter, updateData, { new: true });

        //delete row from collection
        await PostLike.findByIdAndRemove(postLikeData._id);

        return true;

    }
}

async function getPostComments(req) {
    const postId = req.params.id;
    const comments = await PostComment.find({ postId: postId, isActive: true })
        .sort({ createdAt: 'desc' });
    if (comments && comments.length > 0) {
        return comments;
    }
    return false;
}


async function addPostComment(req) {

    const param = req.body;
    const postId = req.params.id;
    const isSeller = param.isSeller;
    const content = param.content;

    var input = {
        postId: postId,
        isActive: true,
        isSeller: isSeller,
        content: content
    };

    if (isSeller == true) {
        input['sellerId'] = param.seller_id;
        input['userId'] = null;
    } else {
        input['userId'] = param.user_id;
        input['sellerId'] = null;
    }

    //add row into collection
    const postcomment = new PostComment(input);

    const data = await postcomment.save();

    if (data) {

        //update in post
        const filter = { _id: postId };
        const updateData = { $push: { comments: data.id }, $inc: { commentCount: 1 } };

        await Post.findOneAndUpdate(filter, updateData, { new: true });

        let result = await PostComment.findById(data.id).select();
        if (result) {
            return result;
        } else {
            return false;
        }
    } else {
        return false;
    }

}

async function followUser(req) {
    try {
        const param = req.body;
        const currentUserId = param.currentUserId;
        const userIdToFollow = param.userIdToFollow;
        const role = param.role;


        if (role === "seller") {
            // If a seller is following someone (another seller or a user)
            await User.updateOne(
                { _id: currentUserId },
                {
                    $addToSet: { 'community.followingData': userIdToFollow },
                    $inc: { 'community.following': 1 }
                }
            );

            const isFollowingSeller = await Seller.exists({ _id: userIdToFollow });
            if (isFollowingSeller) {
                await Seller.updateOne(
                    { _id: userIdToFollow },
                    {
                        $addToSet: { 'community.followerData': currentUserId },
                        $inc: { 'community.followers': 1 }
                    }
                );
            } else {
                await User.updateOne(
                    { _id: userIdToFollow },
                    {
                        $addToSet: { 'community.followerData': currentUserId },
                        $inc: { 'community.followers': 1 }
                    }
                );
            }

            return { success: true, message: 'Followed successfully....!' };

        } else if (role === "user") {
            // Buyer follow to another Buyer...
            await User.updateOne(
                { _id: currentUserId },
                {
                    $addToSet: { 'community.followingData': userIdToFollow },
                    $inc: { 'community.following': 1 }
                }
            );

            const isFollowingSeller = await Seller.exists({ _id: userIdToFollow });
            if (isFollowingSeller) {
                await Seller.updateOne(
                    { _id: userIdToFollow },
                    {
                        $addToSet: { 'community.followerData': currentUserId },
                        $inc: { 'community.followers': 1 }
                    }
                );
            } else {
                await User.updateOne(
                    { _id: userIdToFollow },
                    {
                        $addToSet: { 'community.followerData': currentUserId },
                        $inc: { 'community.followers': 1 }
                    }
                );
            }

            return { success: true, message: 'Followed successfully....!' };
        }

        // if (role === "seller") {
        //     console.log("seller follow function run..")

        //     await Seller.updateOne(
        //         { _id: currentUserId },
        //         {
        //             $addToSet: { 'community.followingData': userIdToFollow },
        //             $inc: { 'community.following': 1 }
        //         }
        //     );

        //     await Seller.updateOne(
        //         { _id: userIdToFollow },
        //         {
        //             $addToSet: { 'community.followerData': currentUserId },
        //             $inc: { 'community.followers': 1 }
        //         }
        //     );
        //     return { success: true, message: 'Followed successfully....!' };

        // } else if (role === "user") {
        //     console.log("user follow function run..")
        //     await User.updateOne(
        //         { _id: currentUserId },
        //         {
        //             $addToSet: { 'community.followingData': userIdToFollow },
        //             $inc: { 'community.following': 1 }
        //         }
        //     );

        //     await User.updateOne(
        //         { _id: userIdToFollow },
        //         {
        //             $addToSet: { 'community.followerData': currentUserId },
        //             $inc: { 'community.followers': 1 }
        //         }
        //     );
        //     return { success: true, message: 'Followed successfully....!' };
        // }

        // test*****************************************end

        // await User.updateOne(
        //     { _id: currentUserId },
        //     {
        //         $addToSet: { 'community.followingData': userIdToFollow },
        //         $inc: { 'community.following': 1 }
        //     }
        // );

        // await User.updateOne(
        //     { _id: userIdToFollow },
        //     {
        //         $addToSet: { 'community.followerData': currentUserId },
        //         $inc: { 'community.followers': 1 }
        //     }
        // );


    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function unfollowUser(req) {
    try {
        const param = req.body;
        const currentUserId = param.currentUserId;
        const userIdToUnfollow = param.userIdToUnfollow;
        const role = param.role;
        console.log("role", role)

        await User.updateOne(
            { _id: currentUserId },
            {
                $pull: { 'community.followingData': userIdToUnfollow },
                $inc: { 'community.following': -1 }
            }
        );

        await User.updateOne(
            { _id: userIdToUnfollow },
            {
                $pull: { 'community.followerData': currentUserId },
                $inc: { 'community.followers': -1 }
            }
        );
        return { success: true, message: 'Unfollowed successfully....!' };

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function postDelete(req) {
    try {
        const param = req.body;
        const postId = param.postId;

        const result = await Post.updateOne(
            { _id: postId },
            { $set: { isActive: false } }
        );
        return result;

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}

async function updatePost(req) {
    try {
        const param = req.body;
        // console.log("param", param);
        const result = await Post.updateOne(
            { _id: param.postId },
            {
                $set: {
                    postContent: param.content,
                    productId: param.product_id,
                    categoryId: param.category_id,
                    postStatus: param.post_status
                }
            }
        );
        return result;

    } catch (err) {
        console.log('Error', err);
        return false;
    }
}



async function sendFollowRequest(req) {

    try {
        const param = req.body;
        console.log("param", param)
        const Follower = param.follower; //self
        const Following = param.following; // the one, you want to follow/unfollow

        console.log("Follower", Follower);
        console.log("Following", Following);

        var followingData;
        var followerData;

        if (Following.is_seller == true) {
            followingData = await Seller.findById(Following.seller_id).select('community');
        } else {
            followingData = await User.findById(Following.user_id).select('community');
        }

        // console.log(followingData);
        //return false;
        if (Follower.is_seller == true) {
            followerData = await Seller.findById(Follower.seller_id).select('community');
        } else {
            followerData = await User.findById(Follower.user_id).select('community');
        }

        if (!followingData) {

        } else {

            let check = await FollowRequest.findOne({ recieverId: followingData._id, senderId: followerData._id }).exec();

            if (check) {
                throw 'Follow request can not be sent.';
            } else {

                let input = {
                    senderId: followerData._id,
                    recieverId: followingData._id,
                    isActive: false
                };

                const followrequest = new FollowRequest(input);

                const data = await followrequest.save();

                if (data) {

                    let res = await FollowRequest.findById(data.id).select();

                    if (res) {
                        return res;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }

            }
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }

}

async function setFollow(req) {

    try {
        const param = req.body;
        const Follower = param.follower; //self
        const Following = param.following; // the one, you want to follow/unfollow
        var followingData;
        var followerData;

        if (Following.isSeller == true) {
            followingData = await Seller.findById(Following.seller_id).select('community');
        } else {
            followingData = await User.findById(Following.user_id).select('community');
        }

        if (Follower.isSeller == true) {
            followerData = await Seller.findById(Follower.seller_id).select('community');
        } else {
            followerData = await User.findById(Follower.user_id).select('community');
        }

        if (!followingData) {
            throw 'This user is not found';
        } else {

            if (followingData.community.followerData.includes(followerData._id) == true) {
                throw 'You are already following this user.';
            } else {

                var res1 = false;
                var res2 = false;
                let filter = { _id: followingData._id };
                let updateData = { $push: { "community.followerData": followerData._id }, $inc: { "community.followers": 1 } };

                let filter2 = { _id: followerData._id };
                let updateData2 = { $push: { "community.followingData": followingData._id }, $inc: { "community.following": 1 } };

                //following update
                if (Following.isSeller == true) {
                    res1 = await Seller.findOneAndUpdate(filter, updateData, { new: true });
                } else {
                    res1 = await User.findOneAndUpdate(filter, updateData, { new: true });
                }

                //follower update
                if (Follower.isSeller == true) {
                    res2 = await Seller.findOneAndUpdate(filter2, updateData2, { new: true });
                } else {
                    res2 = await User.findOneAndUpdate(filter2, updateData2, { new: true });
                }

                if (res1 && res2) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    } catch (err) {
        console.log('Error', err);
        return false;
    }

}


async function getCategories() {
    var whereCondition = { isActive: true, parent: null };

    let sortOption = { isService: 'asc', categoryName: 'asc' };
    const categories = await Category.find(whereCondition)
        .select("id categoryName isService")
        .sort(sortOption);

    if (categories && categories.length > 0) {
        return categories;
    }
    return false;
}

async function getProductsByCatId(req) {
    let id = req.params.id;
    var whereCondition = { category: id, isActive: true };

    let sortOption = { isService: 'asc', name: 'asc' };
    const products = await Product.find(whereCondition)
        .select("id name isService")
        .sort(sortOption);

    if (products && products.length > 0) {
        return products;
    }
    return false;
}