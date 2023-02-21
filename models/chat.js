const Joi = require("joi");
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  is_group: Boolean,
  name: {
    type: String,
    minlength: 4,
    maxlength: 255,
    required: true,
  },
  start_at: {
    type: Date,
    default: Date.now()
  },
});

const Chat = mongoose.model("Chat", chatSchema);


function validateChat(chat) {
  const schema = Joi.object({
    is_group: Joi.boolean().required(),
    name: Joi.string().min(3).max(250).required(),
  });
  return schema.validate(chat);
}


exports.Chat = Chat;
exports.validate = validateChat;
