var mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schema = new Schema({
    image: { type: String, require: false },
    imageId: { type: String, require: false },
    video: { type: String, require: false },
    videoId: { type: String, require: false },

    bannerText: {
        type: String,
        required: false,
    },
    bannerName: {
        type: String,
        required: false,
    },
    bannerType: {
        type: String,
        required: false,
    },
    siteUrl: {
        type: String,
        required: false,
    },
    category: {
        type: Array,
        required: false,
    },
    startDate: {
        type: Date,
        required: false,
    },
    endDate: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        default: 'pending',
    },
    subscriptionPlan: {
        type: {
            id: Number,
            planPrice: String,
            planType: String
        },
        required: false,
    },
    bannerPlacement: {
        type: String,
        default: 'Top-side',
    },
    tag: {
        type: String,
        required: false,
    },
    keyword: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: false,
    },
    authorDetails: {
        type: {
            email: String,
            name: String,
            role: String
        }
    }
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });



module.exports = mongoose.model("bannerAdvertisement", schema,);


