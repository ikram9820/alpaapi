const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth  = require('../middlewares/auth');
const {validate,VisibilityFilter} = require('../models/profile_visibility')



router.put("/", [auth], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let filter = await VisibilityFilter.findOne({user:req.user._id})
      if (!filter)
      return res.status(404).send("The visibility filter with the given user ID was not found.");
      
      filter.countries = req.body.countries;
      filter.languages =req.body.languages ;
      filter.professions =req.body.professions ;
      filter.genders =req.body.genders ;
      filter.ageRange = req.body.ageRange ;
    
      filter = await filter.save()
    
      res.send(filter);
    });
    
module.exports = router