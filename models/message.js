const Joi = require("joi");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true },
    content: { type: String, trim: true,required:true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat",required:true },
    // readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

function validateMessage(user) {
  const schema = Joi.object({
    content: Joi.string().min(1).max(2000).required(),
    sender: Joi.objectId().required(),
    chat: Joi.objectId().required(),
  });
  return schema.validate(user);
}

exports.Message = Message;
exports.validate = validateMessage;
