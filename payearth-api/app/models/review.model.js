var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    review: {
        title: { type: String, required: false, default: '' },
        description: { type: String, required: false, default: '' },
    },
    reviewImages: { type: Array, required: false, default: [] },
    rating: { type: Number, min: 1, max: 5, required: true, default: 1 },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("Review", schema);