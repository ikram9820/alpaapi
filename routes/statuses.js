const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth  = require('../middlewares/auth');
const { Status, validate} = require('../models/status')
 


router.post("/",auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const status = new Status({file:req.body.file, user:req.user._id});
  await status.save();
  
  res.status(201).send(status);
});



router.get("/:id", async (req, res) => {
  let status = await Status.findById(req.params.id)
  if (!status) return res.status(404).send("staus is not found")
  res.send(status);
});

router.delete("/:id",auth, async (req, res) => {
  let status = await Status.findOne(req.params.id)
  if (!status) return res.status(404).send("staus is not found")
  if(status.user!== req.user._id) res.status(401).send("you are not authorized")
  status.delete()
  res.send(status);
});

  

module.exports = router;

