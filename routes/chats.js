const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { Chat } = require("../models/chat");
const { ChatUser } = require("../models/chat_user");
const { Message } = require("../models/message");

router.get("/", [auth], async (req, res) => {
  const chats = ChatUser.find({ user: req.user_id }).select("- __v");
  res.status(200).json(chats);
});

router.get("/:id", [auth], async (req, res) => {
  const messages = Message.find({ chat: req.params.id });
  res.status(200).json(messages);
});

module.exports = router;

// const userIds = ChatUser.find({chat:{ $in: chatIds } }).select('user')
// if (!userIds) return res.status(404).json("You have no user in your chats")
//   const messages = Message.find({$and: [{chat:{ $in: chatIds } }, {user:{ $in: userIds } }]})
