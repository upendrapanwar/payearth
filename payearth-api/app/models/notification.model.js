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
      enum: ['follow', 'like', 'comment', 'message', 'report', 'chat', 'Meeting_Request']
    },
    receiver: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      type: {
        type: String,
        required: true,
        enum: ['user', 'seller', 'admin', 'super_admin', 'manager']
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
        enum: ['user', 'seller', 'admin', 'super_admin', 'manager']
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
      required: false,
      default: false
    },
    isSeen: {
      type: Boolean,
      required: false,
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
