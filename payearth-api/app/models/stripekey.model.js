var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    //PUBLISHABLE_KEY
    stripe_publishable_key: {
        type: String,
        required: true,
    },
    // STRIPE_SECRET_KEY
    stripe_secret_key: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

schema.set("toJSON", { virtuals: true, versionKey: false });
module.exports = mongoose.model("Stripekeys", schema);