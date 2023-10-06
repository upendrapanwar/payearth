var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    orderStatusId: { type: mongoose.Schema.Types.ObjectId, ref: "OrderStatus", required: true, index: true },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("OrderTrackingTimeline", schema);