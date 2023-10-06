var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    colorName: { type: String, required: true, default: "" },
    lname: { type: String, required: true, index: true },
    code: { type: String, required: true, index: true },
    isActive: { type: Boolean, required: false, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true, versionKey: false });

module.exports = mongoose.model('Color', schema);