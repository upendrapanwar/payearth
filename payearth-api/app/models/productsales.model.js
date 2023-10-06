var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const schema = new Schema({
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: false, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: false, index: true },
    profitAmount: { type: Number, required: false, default: 0 },
    revenueAmount: { type: Number, required: false, default: 0 },
    totalSalesCount: { type: Number, required: false, default: 0 },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("ProductSales", schema);