const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    event_title: { type: String, required: false, default: "" },
    event_id: { type: String, required: false, default: "" },
    event_description: { type: String, required: false, default: "" },
    user_id: { type: String, ref: "User", required: false, default: null },
    service_id: { type: Schema.Types.ObjectId, ref: "Services", required: false, default: null, },
    start_datetime: { type: Date, required: false, default: null },
    end_datetime: { type: Date, required: false, default: null },
    meeting_url: { type: String, required: false, default: null },
    status: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  }
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Calendar", schema);
