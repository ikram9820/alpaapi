const Joi = require("joi");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
    maxlength: 255,
    required: true,
  },
  email: {
    type: String,
    minlength: 4,
    maxlength: 255,
    required: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 8,
  },
  dp_url: {
    type: String,
    maxlength: 255,
    minlength: 5,
  },
  is_admin: Boolean,
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    dp_url: Joi.string().min(5).max(255),
  });
  return schema.validate(user);
}

exports.User = User;
exports.userSchema = userSchema;

exports.validate = validateUser;
