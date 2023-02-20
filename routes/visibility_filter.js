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

router.post("/search", [auth], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const visibilityFilter = req.body

    const query = {
        $and: [
          { country: { $in: visibilityFilter.countries } },
          { language: { $in: visibilityFilter.languages } },
          { profession: { $in: visibilityFilter.professions } },
          { gender: { $in: visibilityFilter.genders } },
          { age: { $gte: visibilityFilter.ageRange.min, $lte: visibilityFilter.ageRange.max } }
        ]
      };

    let filtered = await VisibilityFilter.find(query)
    if (!filtered)
    return res.status(404).send("Theere are no users with this visibility filter.");


    res.send(filtered);
    });
    
module.exports = router