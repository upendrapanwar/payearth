var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    title: { type: String, default: "" },
    lname: { type: String, index: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true, versionKey: false });

module.exports = mongoose.model('OrderStatus', schema);