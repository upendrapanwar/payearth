var mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schema = new Schema({
    image: {
        type: String,
        require: false,
    },
    title: {
        type: String,
        required: false,
    },
<<<<<<< HEAD
    slug: {
        type: String,
        unique: true,
        trim: true,
        default: 0
    },
=======
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
    shortdescription: {
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
    },
    seo: {
        type: String,
        required: false,
    },
<<<<<<< HEAD
    seodescription: {
        type: String,
        required: false,
    },
=======
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
    keywords: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        // enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("cmsPost", schema);


