var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    ticketId: {
        type: String,
        unique: true,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TicketMessage'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdByType: {
        type: String,
        enum: ['user', 'seller'],
        required: true,
    },
    status: {
        type: String,
        enum: ['closed', 'in-progress'],
        default: 'in-progress',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
}, {
    timestamps: true
})

schema.set("toJSON", { virtuals: true, versionKey: false });
module.exports = mongoose.model("Ticket", schema);