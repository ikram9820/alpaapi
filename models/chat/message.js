const Joi = require("joi");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    texted_at: {
      type: Date,
      default: Date.now(),
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user",required:true },
    content: { type: String, trim: true,required:true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat",required:true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true, versionKey: false }
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
