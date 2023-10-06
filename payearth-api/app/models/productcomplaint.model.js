var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    complaint: {
        title: { type: String, required: false, default: '' },
        description: { type: String, required: false, default: '' },
    },
    complaintImages: { type: Array, required: false, default: [] },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("ProductComplaint", schema);