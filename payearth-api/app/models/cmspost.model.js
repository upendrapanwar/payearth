var mongoose = require("mongoose");
const Schema = mongoose.Schema;
 

const schema = new Schema({
    image: {
        type: String,
        require: false,
    },
    seo: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    category: {
        type: Array,
        required: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: false
    },
    status: {
        type: String,
        // enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("cmsPost", schema);


