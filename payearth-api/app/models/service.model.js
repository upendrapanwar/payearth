var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema; 

const schema = new Schema({
    serviceCode: { type: String, unique: true, required: false, index: true, default: function() { return getRandomString(8); } },
    name: { type: String, required: true },
    lname: { type: String, required: false, default: "", index: true },
    slug: { type: String, required: false, default: "" },
    category: { type: mongoose.Schema.ObjectId, ref: "Category" },
    description: { type: String, required: true, default: "" },
    featuredImage: { type: String, required: false, default: "" },
    imageId: { type: String, required: false, default: "" },
    isActive: { type: Boolean, required: false, default: true },
    approveStatus: { type: String, enum: ["none", "pending", "reject"], required: false, default: "none" },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    reviewCount: { type: Number, required: false, default: 0 },
    totalRatingScore: { type: Number, required: false, default: 0 },
    avgRating: { type: Number, required: false, default: 0 },
    totalRatingScore: { type: Number, required: false, default: 0 },
    avgRating: { type: Number, required: false, default: 0 },
    videos: [{ type: Schema.Types.ObjectId, ref: 'ServiceVideo' }],
    videoCount: { type: Number, required: false, default: 0 },
    subscriberCount: { type: Number, required: false, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Seller', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Seller', required: false },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Services", schema);


function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}