var mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    chatName: {
        type: String,
        trim : true,
    },
    isGroupChat: {
        type: Boolean,
        default : false,
    },
    description: {
        type: String,
        required: false,
    },
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("cmsCategory", schema);