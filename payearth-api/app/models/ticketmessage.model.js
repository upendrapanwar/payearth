var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    ticketId: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,  
    },
    senderType: {
        type: String,
        enum: ['user', 'seller', 'admin'],  
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
})

schema.set("toJSON", { virtuals: true, versionKey: false });
module.exports = mongoose.model("TicketMessage", schema);