var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    postContent: { type: String, required: false, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: false, default: null },
    isSeller: { type: Boolean, required: false, default: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: false, default: null },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: false, default: null },
    postImages: [{ type: Schema.Types.ObjectId, ref: 'PostImages' }],
    postVideos: [{ type: Schema.Types.ObjectId, ref: 'PostVideos' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'PostLike' }],
    likeCount: { type: Number, required: false, default: 0 },
    commentCount: { type: Number, required: false, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: 'PostComment' }],
    parentId: { type: Schema.Types.ObjectId, ref: 'Post', required: false, default: null },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("Post", schema);