var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    seller_id: { type: Schema.Types.ObjectId, ref: 'Seller', required: false, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    call_status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
}, {
    timestamps: true
})


schema.set("toJSON", { virtuals: true, versionKey: false });
module.exports = mongoose.model("Support", schema);