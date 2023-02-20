const mongoose = require("mongoose");
const Joi = require("joi");

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
    enum: ["Male", "Female", "Others"],
  },
  profession: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

function validateProfile(profile) {
  const schema = Joi.object({
    gender: Joi.string().valid("Male", "Female", "Others"),
    country: Joi.string().min(3).max(50),
    language: Joi.string().min(3).max(50),
    profession: Joi.string().min(3).max(50),
    // contact_no: Joi.string().min(8).max(50),
    user: Joi.objectId().required()
  });
  return schema.validate(profile);
}

exports.Profile = Profile;
exports.validate = validateProfile;
