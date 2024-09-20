var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    //   userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: false,
    //   },
    //   serviceId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Services",
    //     required: false,
    //   },
    //   message: {
    //     type: String,
    //     required: false,
    //   },
    //   timestamp: {
    //     type: Date,
    //     default: Date.now,
    //   },
    //   read: {
    //     type: Boolean,
    //     default: false,
    //   },

    type: {
      type: String,
      required: true,
      enum: ['follow', 'like', 'comment', 'message']
    },
    receiver: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      type: {
        type: String,
        required: true,
        enum: ['user', 'seller', 'admin']
      }
    },
    sender: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      type: {
        type: String,
        required: true,
        enum: ['user', 'seller', 'admin']
      }
    },
    message: {
      type: String,
      required: true
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: false,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  }, { timestamps: true }
);

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("Notification", schema);
