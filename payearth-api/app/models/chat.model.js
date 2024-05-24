var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    chatName: {
        type: String,
        trim: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },

    chatUsers: [{
        type: {
            id: String,
            name: String,
            image_url: String,
            isGroupAdmin: { type: Boolean, default: false }
        },
    }],

    // usersAll: [{
    //     authorId: {
    //         type: {
    //             id: String,
    //             name: String,
    //             image_url: String,
    //         },
    //     },
    //     users: [{
    //         type: {
    //             id: String,
    //             name: String,
    //             image_url: String,
    //         },
    //     }],
    // }],


    // authorId: {
    //     type: {
    //         id: String,
    //         name: String,
    //         image_url: String,
    //     },
    //     default: {}
    // },
    // receiverId: {
    //     type: {
    //         id: String,
    //         name: String,
    //         image_url: String,
    //     },
    //     default: {}
    // },
    isBlock: {
        type: Boolean,
        default: false,
    },
    blockByUser: {
        type: String,
        default: null,
    },

    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatMessage"
    },
    // groupUsers: [{
    //     type: String,
    //     default: null,
    // }],
    groupAdmin: {
        type: String,
        required: false,
    },
}, { timestamps: true });

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("Chat", schema);