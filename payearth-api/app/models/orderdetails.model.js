var mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const schema = new Schema({
    orderId: [{ type: Schema.Types.ObjectId, ref: "Order", required: false }],
    productId: [{ type: Schema.Types.ObjectId, ref: "Product", required: false }],
    serviceId:{ type: Schema.Types.ObjectId, ref: "Service", required: false },
    quantity: [{ type: Number,required: false, default: 0 }],
    price: { type: Number, required: false, default: 0 },
    color: { type: String, required: false, default: "" },
    size: { type: String, required: false, default: "" },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    sellerId: { type: Schema.Types.ObjectId,ref:"Seller", required: false },
    //isActive: { type: Boolean, required: false, default: true },
    isService: { type: Boolean, required: false, default: false }
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("OrderDetails", schema);


function getRandomString(length) {
    var randomChars = '0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    result = 'OD' + result;
    return result;
}