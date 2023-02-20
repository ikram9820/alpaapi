const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require('joi')

// Define the schema for the visibility filter collection
const visibilityFilterSchema = new Schema({
  countries: [{ type: String, enum: ['USA', 'Canada', 'UK', 'Australia'] }],
  languages: [{ type: String, enum: ['English', 'Spanish', 'French', 'German'] }],
  professions: [{ type: String, enum: ['Doctor', 'Engineer', 'Teacher', 'Lawyer'] }],
  genders: [{ type: String, enum: ['Male', 'Female', 'Other'] }],
  ageRange: {
    min: {
      type: Number,
      min: 0,
      max: 120
      
    },
    max: {
      type: Number,
      min: 0,
      max: 120
    },
    // required:true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

});

// Create the model for the visibility filter collection
const VisibilityFilter = mongoose.model('VisibilityFilter', visibilityFilterSchema);



function validateVisibilityFilter(filter) {
 
const schema = Joi.object({
  countries: Joi.array().items(Joi.string().lowercase().valid('usa', 'canada', 'mexico')),
  languages: Joi.array().items(Joi.string().lowercase().valid('english', 'spanish', 'french')),
  professions: Joi.array().items(Joi.string().lowercase().valid('engineer', 'lawyer', 'doctor')),
  genders: Joi.array().items(Joi.string().lowercase().valid('male', 'female','other')),
    ageRange: Joi.object({
      min: Joi.number().min(7).max(14),
      max: Joi.number().min(15).max(120)
    })
  });
  return schema.validate(filter);
}

exports.VisibilityFilter = VisibilityFilter;
exports.validate = validateVisibilityFilter;
