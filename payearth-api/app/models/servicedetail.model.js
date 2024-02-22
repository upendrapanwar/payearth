var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    service: { type: Schema.Types.ObjectId, ref: 'Services', required: false },
    meetingDate: {
        type: Date,
        required: false,
    },
    meetingStatus: {
        type: String,
        default: 'Pending',
    },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("Servicedetails", schema);