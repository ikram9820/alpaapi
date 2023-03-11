const Joi = require("joi");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true, required: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    is_accepted: { type: Boolean, default: false },
    start_at: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true, versionKey: false }
);

const Chat = mongoose.model("Chat", chatSchema);

function validateChat(chat) {
  const schema = Joi.object({
    chatName: Joi.string().min(2).max(255).required,
  });
  return schema.validate(chat);
}

exports.Chat = Chat;
exports.validate = validateChat;
