const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    parent: { type: Schema.Types.ObjectId, ref: 'Category', required: false, default: null },
    categoryName: { type: String, required: false, default: '' },
    lname: { type: String, required: false, default: "", index: true },
    isService: { type: Boolean, required: false, default: false },
    isActive: { type: Boolean, required: false, default: true },
    onMainMenu: { type: Boolean, required: false, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
}, {
    timestamps: true,
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Category', schema);