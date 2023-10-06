var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const schema = new Schema({
    productCode: { type: String, unique: true, required: false, index: true, default: function() { return getRandomString(8); } },
    name: { type: String, required: true },
    lname: { type: String, required: false, default: "", index: true },
    category: { type: mongoose.Schema.ObjectId, ref: "Category" },
    sub_category: { type: mongoose.Schema.ObjectId, required: false, ref: "Category", default: null },
    brand: { type: mongoose.Schema.ObjectId, ref: "Brand" },
    description: { type: String, required: true, default: "" },
    specifications: { type: String, required: false, default: "" },
    validity: { type: String, required: false, default: "" },
    color_size: { type: Array, required: false, default: [] },
    featuredImage: { type: String, required: false, default: "" },
    images: { type: Array, required: false, default: [] },
    tier_price: { type: Array, required: false, default: [] },
    price: { type: Number, required: true, default: 0 },
    cryptoPrices: [{ type: Schema.Types.ObjectId, ref: 'CryptoConversion' }],
    isActive: { type: Boolean, required: false, default: true },
    approveStatus: { type: String, enum: ["none", "pending", "reject"], required: false, default: "none" },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    reviewCount: { type: Number, required: false, default: 0 },
    totalRatingScore: { type: Number, required: false, default: 0 },
    avgRating: { type: Number, required: false, default: 0 },
    isService: { type: Boolean, required: false, default: false },
    videos: [{ type: Schema.Types.ObjectId, ref: 'ServiceVideo' }],
    videoCount: { type: Number, required: false, default: 0 },
    quantity: {
        selling_qty: { type: Number, required: false, default: 0 },
        stock_qty: { type: Number, required: false, default: 0 },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Seller', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Seller', required: false },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", schema);


function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}