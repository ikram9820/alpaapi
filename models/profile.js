const mongoose = require("mongoose");
const userSchema = require("./user");

const Joi = require("joi");

const profileSchema = mongoose.Schema({
  birt_date: {
    type: Date,
    required: true,
  },
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
  gendre: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  profession: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  contact_no: {
    type: String,
    minlength: 8,
    maxlength: 50,
  },
  user: {
    type: userSchema,
    required: true,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

function validateProfile(profile) {
  const schema = Joi.object({
    birth_date: Joi.date().required(),
    gendre: Joi.string().valid("Male", "Female", "Others"),
    country: Joi.string().min(3).max(50),
    language: Joi.string().min(3).max(50),
    profession: Joi.string().min(3).max(50),
    contact_no: Joi.string().min(8).max(50),
    user: Joi.objectId().required()
  });
  return schema.validate(profile);
}

exports.Profile = Profile;
exports.validate = validateProfile;
