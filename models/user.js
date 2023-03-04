const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
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

userSchema.methods.generateAuthToken = function(){
 const token = jwt.sign({
  _id: this._id,
  name:this.name,
  email:this.email,
  is_admin: this.is_admin
 },
 config.get('jwtPrivateKey')
 );
 return token
}




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
function validateUpdateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    dp_url: Joi.string().min(5).max(255),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validateUpdate = validateUpdateUser
exports.validate = validateUser;
