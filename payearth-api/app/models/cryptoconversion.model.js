var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    cryptoName: { type: String, required: false, default: "" },
    code: { type: String, required: true, index: true },
    cryptoPriceUSD: { type: Number, required: true },
    isActive: { type: Boolean, required: false, default: true },
    asCurrency: { type: Boolean, required: false, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true, versionKey: false });

module.exports = mongoose.model('CryptoConversion', schema);