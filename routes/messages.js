const express = require("express");
const auth = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const { Message, validate } = require("../models/message");
const User = require("../models/user");
const router = express.Router();

//Get Fetch all message
router.get("/:chatId", auth, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .lean()
      .exec();
    return res.status(200).send(messages);
  } catch (error) {
    return res.status(400).send(error.messages);
  }
});

//Post create new message
router.post("/", auth, async (req, res) => {
  const userId = req.user._id;
  var newMessage = {
    sender: userId,
    content:req.body.content,
    chat:req.body.chatId,
  };
  const { error } = validate(newMessage);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    var message = await Message.create(newMessage);
    message = Message.findOne({ _id: message._id })
      .populate("sender", "name pic")
      .populate("chat")
      .lean()
      .exec();
    message = await user.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    let data = await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message._id,
    });

    return res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
module.exports = router;
