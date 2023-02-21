const Joi = require("joi");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    texted_at: {
        type: Date,
        default: Date.now()
      },
    body:{
        type:String,
        minlength:1,
        maxlength:1000,
        required:true
    },
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
});

const Message = mongoose.model("Message", messageSchema);


function validateMessage(user) {
  const schema = Joi.object({
    body:Joi.string().min(1).max(1000).required(),
    user: Joi.objectId().required(),
    chat: Joi.objectId().required(),
  });
  return schema.validate(user);
}

exports.Message = Message;
exports.validate = validateMessage;
