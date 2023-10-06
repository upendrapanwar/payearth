var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;
const schema = new Schema({
    code: { type: String, required: true, index: true },
    discount_per: { type: Number, required: true, default: 0 },
    start: { type: Date, required: true, },
    end: { type: Date, required: true },
    isActive: { type: Boolean, required: false, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
    user_id: { type: String, required: false, default: null }
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true, versionKey: false });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Coupon', schema);