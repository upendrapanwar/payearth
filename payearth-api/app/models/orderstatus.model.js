var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    title: { type: String, default: "" },
    // productId: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
    product: {
        productId: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        quantity: [{ type: Number, default: 0 }],
        price: { type: Number, default: 0 },
        color: { type: String, default: "" },
        size: { type: String, default: "" },
    },
    service: {
        serviceId: { type: Schema.Types.ObjectId, ref: "Services" },
        serviceCode: { type: String, default: "" }
    },
    subscriptionPlan: {
        _id: { type: String, default: "" },
        planId: { type: String, default: "" }
    },
    serviceCreateCharge: { type: Boolean, default: false },
    lname: { type: String, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true, versionKey: false });

module.exports = mongoose.model('OrderStatus', schema);