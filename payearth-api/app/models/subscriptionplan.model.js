var mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    id: {
        type: String,
        required: false,
    },
    nickname: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: false,
    },
    interval: {
        type: String,
        required: false,
    },
    interval_count: {
        type: Number,
        required: false,
    },
    active: {
        type: Boolean,
        default: false,
    },
    usageCount: [{
        type: {
            authorId: String,
            sub_id: String,
            count: Number,
            isActive : Boolean
        }
    }],
    metadata: {
        type: {
            descriptions: String,
            planType: String,
            advertiseAllowed: Number
        }
    },
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("subscriptionPlan", schema);