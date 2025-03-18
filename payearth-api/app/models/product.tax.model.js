var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    product_tax_rate: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})

schema.set("toJSON", { virtuals: true, versionKey: false });
module.exports = mongoose.model("ProductTaxRate", schema);