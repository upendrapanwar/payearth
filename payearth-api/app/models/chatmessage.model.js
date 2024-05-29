var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    sender: {
        type: {
            id: String,
            name: String,
            image_url: String,
        }
    },
    // sender: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User"
    // },
    messageContent: {
        type: String,
        default: null,
    },
    mediaContent : {
        type: String,
        default: null,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("ChatMessage", schema);