var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    serviceId: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
    video: {
        no: { type: Number, required: false, default: null },
        title: { type: String, required: false, default: '' },
        description: { type: String, required: false, default: '' },
        thumb: { type: String, required: false, default: '' },
        url: { type: String, required: false, default: '' },
    },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("ServiceVideo", schema);