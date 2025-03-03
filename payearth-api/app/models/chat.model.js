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

    // chatUsers: [{
    //     type: {
    //         id: String,
    //         name: String,
    //         image_url: String,
    //         isGroupAdmin: { type: Boolean, default: false }
    //     },
    // }],
    chatUsers: [{
        id: { type: mongoose.Schema.Types.ObjectId, refPath: 'chatUsers.role', required: true }, // Dynamic population
        name: { type: String, required: true },
        image_url: { type: String, default: '' },
        role: { type: String, enum: ['User', 'Seller', 'Admin'], required: true },
        isGroupAdmin: { type: Boolean, default: false }
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
        ref: "ChatMessage",
        default: null,
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