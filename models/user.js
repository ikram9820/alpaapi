const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const {VisibilityFilter} = require('./profile_visibility')
const moment = require('moment')


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
  birth_date: {
    type: Date,
    // required: true,
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

// creating default visibility filter
 userSchema.pre('save', async function(next) {
    const userage = moment().diff(this.birth_date, 'years');
    const age = {min:0,max:120}
    if( userage > 16) {age.min = 16 ; age.max = 120}
    else {age.min = 7; age.max= 16}
    const visibility = new VisibilityFilter({ user: this._id, ageRange: age });
    await visibility.save();
  next();
});


const User = mongoose.model("User", userSchema);


function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    birth_date: Joi.date().required(),
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
