var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: false, default: null },
    url: { type: String, required: false, default: '' },
    thumb: { type: String, required: false, default: '' },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("PostVideos", schema);