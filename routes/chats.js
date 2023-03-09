const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { Chat } = require("../models/chat");
const { ChatUser } = require("../models/chat_user");
const { Message } = require("../models/message");
const { User } = require("../models/user");

router.get("/", [auth], async (req, res) => {
  const chatIds = ChatUser.find({ user: req.user_id }).select("chat");
  const chats = Chat.find({ _id: { $in: chatIds } });
  res.status(200).json(chats);
});

router.get("/:id", [auth], async (req, res) => {
  const chatId = req.params.id;
  const chat = Chat.findById(chatId);
  const userIds = ChatUser.find({ chat: chatId }).select("user");
  const users = User.find({ _id: { $in: userIds } }).select("name about dp_url");
  const messages = Message.find({ chat: chatId });
  res.status(200).json({ messages, chat, users });
});

module.exports = router;

// const userIds = ChatUser.find({chat:{ $in: chatIds } }).select('user')
// if (!userIds) return res.status(404).json("You have no user in your chats")
//   const messages = Message.find({$and: [{chat:{ $in: chatIds } }, {user:{ $in: userIds } }]})
