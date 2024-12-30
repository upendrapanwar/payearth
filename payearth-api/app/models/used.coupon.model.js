var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
    couponId: {type: mongoose.Schema.Types.ObjectId, ref: 'Coupon',required: true},
    usedAt: { type: Date,default: Date.now },
    code: { type: String, required: true, index: true },
    discount_per: { type: Number, required: true, default: 0 },
    start: { type: Date, required: true, },
    end: { type: Date, required: true },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true, versionKey: false });
module.exports = mongoose.model('UsedCoupons', schema);