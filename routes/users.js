const _ = require("lodash");
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();
const auth  = require('../middlewares/auth');
const admin = require('../middlewares/admin')
const { validate, User } = require("../models/user");
const {Profile} = require("../models/profile");


router.get("/me", auth, async (req, res) => {
  const userId = req.user._id
  let user = await User.findById(userId).select("-password -__v");
  // if (!user) return res.status(403).send("you are not authorized for this account")
  const profile = await Profile.findOne({user:userId}).select('-__v -user');
  user = {...user._doc,profile}
  console.log(user)
  res.send(user);
});



router.put("/me", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name },
    { new: true }  //unknown concept
    );
    if (!user)
    return res.status(404).send("The user with the given ID was not found.");

    res.send(user);
  });
  
  
  router.delete("/me", [auth, admin], async (req, res) => {
    let user = await User.findByIdAndRemove(req.user._id);
    const profile = await Profile.findByIdAndRemove({user:user._id});
    
    if (!user)
    return res.status(404).send("The user with the given ID was not found.");
    user = {...user._doc,profile}
    res.send(user);
  });



router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");
  
  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  
  const token = user.generateAuthToken();
  res
  .header("x-auth-token", token)
  .send(_.pick(user, ["_id", "name", "email"]));
});



  
  router.get("/:id", async (req, res) => {
    const userId = req.params.id
    let user = await User.findById(userId).select("-_id -password -__v");
    const profile = await Profile.findOne({user:userId}).select('-__v -user');
    if (!user) return res.status(404).send("user not found")
    user = {...user._doc,profile}
    console.log(user)
    res.send(user);
  });

module.exports = router;
