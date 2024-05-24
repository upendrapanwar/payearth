var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Services",
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("Notification", schema);
