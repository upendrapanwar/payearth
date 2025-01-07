var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    dealName: { type: String, required: false, default: '' },
    discount: { type: Number, required: false, default: '' },
    productId: [{ type: Schema.Types.ObjectId, ref: "Product", required: false }],
    dealImage: { type: String, required: false, default: '' },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: false },
    dealEndDate: { type: Date, required: false },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("TodayDeal", schema);