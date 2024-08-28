var mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    reportData: {
        type: {
            postId: String,
            postCreatedBy: String,
        }
    },
    reportType: {
        type: String,
        required: false,
    },
    reportBy: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    }
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("reportPost", schema);