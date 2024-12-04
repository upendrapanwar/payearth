var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const schema = new Schema({
    orderCode: { type: String, unique: true, required: false, index: true, default: function () { return getRandomString(14); } },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: false },
    // sellerId: {
    //     productId: [{ type: Schema.Types.ObjectId, ref: "Product", required: false }],
    //     quantity: [{ type: Number, required: false, default: 0 }],
    //     price: { type: Number, required: false, default: 0 },
    //     color: { type: String, required: false, default: "" },
    //     size: { type: String, required: false, default: "" },
    //     sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: false },
    // },
    //product_sku: [{}],
    // product_sku: {
    //     quantity: [{ type: Number, required: false, default: 0 }],
    //     color: { type: String, required: false, default: "" },
    //     size: { type: String, required: false, default: "" }
    // },
    price: { type: Number, required: false, default: 0 },
    billingFirstName: { type: String, required: false, default: "" },
    billingLastName: { type: String, required: false, default: "" },
    billingCompanyName: { type: String, required: false, default: "" },
    billingCounty: { type: String, required: false, default: "" },
    billingStreetAddress: { type: String, required: false, default: "" },
    billingStreetAddress1: { type: String, required: false, default: "" },
    billingCity: { type: String, required: false, default: "" },
    billingCountry: { type: String, required: false, default: "" },
    billingPostCode: { type: String, required: false, default: "" },
    billingPhone: { type: String, required: false, default: "" },
    billingEmail: { type: String, required: false, default: "" },
    billingNote: { type: String, required: false, default: "" },
    deliveryCharge: { type: Number, required: false, default: 0 },
    taxPercent: { type: Number, required: false, default: 0 },
    taxAmount: { type: Number, required: false, default: 0 },
    discount: { type: Number, required: false, default: 0 },
    total: { type: Number, required: false, default: 0 },
    orderStatus: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderStatus", required: false }],
    isActive: { type: Boolean, required: false, default: true },
    isService: { type: Boolean, required: false, default: false },
    isSubscription: { type: Boolean, required: false, default: false }
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", schema);


function getRandomString(length) {
    var randomChars = '0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    result = 'OD' + result;
    return result;
}