var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: false, default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: false, default: null },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: false, default: null },
    isSeller: { type: Boolean, required: false, default: false },
    isAdmin: { type: Boolean, required: false, default: false },
    content: { type: String, required: false, default: '' },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("PostComment", schema);