var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, required: false, default: 1 },
        price: { type: Number, required: false, default: 0 },
        amount: { type: Number, required: false, default: 0 },
        color: { type: String, required: false, default: "" },
        size: { type: String, required: false, default: "" }
    }],
    subTotal: { type: Number, required: false, default: 0 },
    isActive: { type: Boolean, required: false, default: true }
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Cart", schema);