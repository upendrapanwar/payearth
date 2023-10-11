var mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    names: {
        type: String,
        required: false,
    },
    slug: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("cmsCategory", schema);