var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    senderId: { type: Schema.Types.ObjectId, required: false, default: null },
    recieverId: { type: Schema.Types.ObjectId, required: false, default: null },
    isActive: { type: Boolean, required: false, default: false },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("FollowRequest", schema);