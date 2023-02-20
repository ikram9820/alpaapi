const {Profile, validate}  = require('../models/profile')
const auth = require("../middlewares/auth")
const _ = require('lodash')

const express = require('express');
const router = express.Router();

router.post('/',auth,async(req,res)=>{
    const userId = req.user._id
    const newProfile ={..._.pick(req.body, ["birth_date", "language", "country","profession","gendre"]),user:userId}
    console.log(newProfile)
    const {error} = validate(newProfile);
    if(error) return res.status(400).send(error.details[0].message)
    let profile =  await Profile.findOne({user: userId})
    if(profile) return res.status(400).send("this user already have profile.")
    try{
        profile = new Profile(newProfile)
        await profile.save()
    }catch(ex){
        console.log(ex)
        return res.status(400).send(ex)
    }
    res.status(201).json(profile)
});

router.put("/:id", [auth], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const user = await Profile.findByIdAndUpdate(
      req.params.id,
      {
       birth_date: req.body.birth_date,
       country: req.body.country,
       language: req.body.language,
       profession: req.body.profession,
       gendre: req.body.gendre
      },
      { new: true }  //unknown concept
    );
  
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
  
    res.send(user);
  });
  

  


module.exports = router