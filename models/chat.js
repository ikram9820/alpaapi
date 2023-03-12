const Joi = require("joi");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    chatDp: {
      type: String,
      maxlength: 255,
      minlength: 5,
    },
    chatCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isGroupChat: { type: Boolean, default: false },
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    admins: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

// function validateChat(chat) {
//   const schema = Joi.object({
//     name: Joi.string().min(2).max(255).required,
//     chatCreator:Joi.objectId().required(),
//   });
//   return schema.validate(chat);
// }

exports.Chat = Chat;
// exports.validate = validateChat;
