const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    brandName: { type: String, required: false, default: '' },
    logoImage: { type: String, required: false, default: '' },
    isActive: { type: Boolean, required: false, default: true },
    isPopular: { type: Boolean, required: false, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
}, {
    timestamps: true,
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Brand', schema);