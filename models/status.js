const mongoose = require("mongoose");
const Joi = require("joi");

const statusSchema = new mongoose.Schema({
  file: {
    type: String,
    minlength: 3,
    maxlength: 250,
  },
  at: {
    type: Date,
    default: Date.now()
  },
  views: {
    type: Number,
    min:0,
    max:100,
    default:0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Status = mongoose.model("Status", statusSchema);

function validateStatus(status) {
  const schema = Joi.object({
    file: Joi.string().min(3).max(250).required(),
    user: Joi.objectId()
  });
  return schema.validate(status);
}

exports.Status = Status;
exports.validate = validateStatus;
