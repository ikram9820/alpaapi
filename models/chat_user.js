const Joi = require("joi");
const mongoose = require("mongoose");



const chatUserSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chat:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  is_admin: Boolean,
});

const ChatUser = mongoose.model("ChatUser", chatUserSchema);


function validateChatUser(user) {
  const schema = Joi.object({
    user: Joi.objectId().required(),
    chat: Joi.objectId().required(),
    is_admin:Joi.boolean().required()
  });
  return schema.validate(user);
}

exports.ChatUser = ChatUser;
exports.validate = validateChatUser;
