const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    page: { type: String, required: false, default: '', index: true },
    singleImage: { type: String, required: false, default: null },
    bannerImages: [{
        path: { type: String, required: false, default: null },
        text: { type: String, required: false, default: null },
        url: { type: String, required: false, default: null },
    }],
    isActive: { type: Boolean, required: false, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
}, {
    timestamps: true,
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('BannerImage', schema);