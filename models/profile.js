const mongoose = require("mongoose");
const Joi = require("joi");
const {VisibilityFilter} = require('./profile_visibility')
const moment = require('moment');
const { lowerCase } = require("lodash");


const profileSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  language: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
  },
  profession: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  birth_date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});


// creating default visibility filter
profileSchema.pre('save', async function(next) {
  const userage = moment().diff(this.birth_date, 'years');
  const age = {min:0,max:120}
  if( userage > 16) {age.min = 16 ; age.max = 120}
  else {age.min = 7; age.max= 16}
  const visibility = new VisibilityFilter({ user: this.user, ageRange: age });
  await visibility.save();
  next();
});

const Profile = mongoose.model("Profile", profileSchema);


function validateProfile(profile) {
  const schema = Joi.object({
    gender: Joi.string().lowercase().valid("male", "female", "others"),
    country: Joi.string().lowercase().min(3).max(50),
    language: Joi.string().lowercase().min(3).max(50),
    profession: Joi.string().lowercase().min(3).max(50),
    // contact_no: Joi.string().min(8).max(50),
    birth_date: Joi.date().required(),
    user: Joi.objectId().required()
  });
  return schema.validate(profile);
}

exports.Profile = Profile;
exports.validate = validateProfile;
