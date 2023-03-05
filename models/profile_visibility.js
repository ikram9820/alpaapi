const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");
const {
  countries,
  languages,
  professions,
} = require("../name_list/visibility_filter");
// Define the schema for the visibility filter collection
const visibilityFilterSchema = new Schema({
  countries: [{ type: String,  lowercase: true,enum: countries.map(s => s.toLowerCase()), }],
  languages: [{ type: String, lowercase: true, enum: languages.map(s => s.toLowerCase()), }],
  professions: [{ type: String, lowercase: true, enum: professions.map(s => s.toLowerCase()), }],
  genders: [{ type: String,  lowercase: true, enum: ["male", "female", "other"] }],
  ageRange: {
    min: {
      type: Number,
      min: 0,
      max: 120,
    },
    max: {
      type: Number,
      min: 0,
      max: 120,
    },
    // required:true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Create the model for the visibility filter collection
const VisibilityFilter = mongoose.model(
  "VisibilityFilter",
  visibilityFilterSchema
);

function validateVisibilityFilter(filter) {
  const schema = Joi.object({
    countries: Joi.array().items(
      Joi.string()
        .valid(...countries)
        .insensitive()
    ),
    languages: Joi.array().items(
      Joi.string()
        .lowercase()
        .valid(...languages).insensitive()
    ),
    professions: Joi.array().items(
      Joi.string()
        .lowercase()
        .valid(...professions).insensitive()
    ),
    genders: Joi.array().items(
      Joi.string().lowercase().valid("male", "female", "other")
    ),
    ageRange: Joi.object({
      min: Joi.number().min(7).max(100),
      max: Joi.number().min(15).max(120),
    }),
  });
  return schema.validate(filter);
}

exports.VisibilityFilter = VisibilityFilter;
exports.validate = validateVisibilityFilter;
