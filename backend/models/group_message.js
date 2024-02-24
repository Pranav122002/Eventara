const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender_name: {
      type: String,
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GROUP_MESSAGE", groupMessageSchema);
