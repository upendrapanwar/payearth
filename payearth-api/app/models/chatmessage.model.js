var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    // sender: {
    //     type: {
    //         id: String,
    //         name: String,
    //         image_url: String,
    //     }
    // },
    sender: {
        id: { type: mongoose.Schema.Types.ObjectId, refPath: 'sender.role', required: true },
        name: { type: String, required: false },
        image_url: { type: String, default: '' },
        role: { type: String, enum: ['User', 'Seller', 'Admin'], required: true },
    },
    messageContent: {
        type: String,
        default: null,
    },
    mediaContent: {
        type: String,
        default: null,
    },
    isVisible: {
        type: Boolean,
        default: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("ChatMessage", schema);