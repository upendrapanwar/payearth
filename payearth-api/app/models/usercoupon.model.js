var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("UserCoupon", schema);