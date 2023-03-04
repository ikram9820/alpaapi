const { Profile, validate } = require("../models/profile");
const auth = require("../middlewares/auth");
const _ = require("lodash");

const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const userId = req.user._id;
  const newProfile = {
    ..._.pick(req.body, [
      "birth_date",
      "language",
      "country",
      "profession",
      "gender",
    ]),
    user: userId,
  };
  const { error } = validate(newProfile);
  if (error) return res.status(400).send(error.details[0].message);
  let profile = await Profile.findOne({ user: userId });
  if (profile) return res.status(400).send("this user already have profile.");
  try {
    profile = new Profile(newProfile);
    await profile.save();
  } catch (ex) {
    console.log(ex);
    return res.status(400).send(ex);
  }
  res.status(201).json(profile);
});

router.get("/me", auth, async (req, res) => {
  const userId = req.user._id;
  const profile = await Profile.findOne({ user: userId }).select("-__v -user");
  if (!profile) return res.status(404).send("You have no profile");
  res.send(profile);
});

router.put("/me", [auth], async (req, res) => {
  const userId = req.user._id;
  const updatedProfile = {
    ..._.pick(req.body, [
      "birth_date",
      "language",
      "country",
      "profession",
      "gender",
    ]),
    user: userId,
  };
  const { error } = validate(updatedProfile);
  if (error) return res.status(400).send(error.details[0].message);

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    updatedProfile,
    { new: true } //unknown concept
  );

  if (!profile) return res.status(404).send("You have no profile");

  res.send(profile);
});

module.exports = router;
