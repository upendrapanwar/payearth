var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true, default: "" },
    email: { type: String, required: false, default: "" },
    message: { type: String, required: false, default: "" },
    sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: false },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("SellerContactUs", schema);