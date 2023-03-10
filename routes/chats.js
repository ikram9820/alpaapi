const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const Joi = require("joi");
const { Chat } = require("../models/chat");
const { ChatUser } = require("../models/chat_user");
const { Message } = require("../models/message");
const { User } = require("../models/user");

router.get("/", [auth], async (req, res) => {
  const chatIds = await ChatUser.find({ user: req.user._id }).select("chat");
  console.log(chatIds);
  if (!chatIds || chatIds.length < 1) return res.send([]);
  const chats = await Chat.find({ _id: { $in: chatIds } }).select("- __v");
  console.log(chats);
  if (!chats) return res.send([]);
  res.status(200).json(chats);
});

router.get("/:id", [auth], async (req, res) => {
  const chatId = req.params.id;
  const {error} = validateChatId(chatId)
  if (error) return res.status(400).json(error.details[0].message);
  const chat = await Chat.findById(chatId);
  const userIds = await ChatUser.find({ chat: chatId }).select("user");
  let users = [];
  if (userIds && userIds.length > 1)
    users = await User.find({ _id: { $in: userIds } }).select(
      "name about dp_url"
    );

  const messages = await Message.find({ chat: chatId });
  res.status(200).json({ messages, chat, users });
});

module.exports = router;

// const userIds = ChatUser.find({chat:{ $in: chatIds } }).select('user')
// if (!userIds) return res.status(404).json("You have no user in your chats")
//   const messages = Message.find({$and: [{chat:{ $in: chatIds } }, {user:{ $in: userIds } }]})

function validateChatId(chatId) {
    const schema = Joi.object({
      chatId: Joi.objectId()
    });
    return schema.validate({chatId});
  }