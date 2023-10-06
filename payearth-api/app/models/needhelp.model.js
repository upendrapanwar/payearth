var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    reason: { type: String, required: false, default: "" },
    comment: { type: String, required: false, default: "" },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: false },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("NeedHelp", schema);