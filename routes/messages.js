const express = require("express");
const auth = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const { Message, validate } = require("../models/message");
const router = express.Router();

//Get Fetch all message
router.get("/:chatId", auth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send("There is no chat by this Id");
    const messages = await Message.find({ chat:chatId })
      .populate("sender", "name dp")
      .lean()
      .exec();
    return res.status(200).json({ chat, messages });
  } catch (error) {
    console.log(error);
    return res.status(405).send(error.messages);
  }
});

//Post create new message
router.post("/", auth, async (req, res) => {
  const userId = req.user._id;
  var newMessage = {
    sender: userId,
    content: req.body.content,
    chat: req.body.chatId,
  };
  const { error } = validate(newMessage);
  if (error) return res.status(400).send(error.details[0].message);

  const message = new Message(newMessage);
  await message.save();
  const createdMessage = await Message.findById(message._id).populate(
    "sender",
    "name"
  );
  res.status(200).json(createdMessage);
});
module.exports = router;
