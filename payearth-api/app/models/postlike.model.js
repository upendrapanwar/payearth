var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: false, default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: false, default: null },
    isSeller: { type: Boolean, required: false, default: true },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("PostLike", schema);