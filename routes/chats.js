const express = require("express");
const auth = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    }).select("name chatDp");
    return res.status(200).send(chats);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/", auth, async (req, res) => {
  const { userId } = req.body;
  var chatData = {
    name: "sender",
    chatDp: "sender",
    chatCreator: req.user._id,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    return res.status(200).send(createdChat);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/group", auth, async (req, res) => {
  const { name, chatDp, isPublic } = req.body;
  const userId = req.user._id;
  try {
    const newGroup = {
      name: name,
      chatDp: chatDp || null,
      users: [userId],
      isGroupChat: true,
      isPublic: isPublic || false,
      admins: [userId],
      chatCreator: userId,
    };
    const groupChat = await Chat.create(newGroup);
    console.log(groupChat);
    return res.status(200).send(groupChat);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.put("/rename", auth, async (req, res) => {
  try {
    const { chatId, name } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send("Chat Not Found");
    const isAdmin = chat.admins.includes(req.user._id);
    if (isAdmin) {
      chat.name = name;
      await chat.save();
      return res.json(chat);
    }
    return res.status(403).send("You are not admin");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});
router.put("/changevisibility", auth, async (req, res) => {
  try {
    const { chatId, isPublic } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send("Chat Not Found");
    const isAdmin = chat.admins.includes(req.user._id);
    if (isAdmin) {
      chat.isPublic = isPublic;
      await chat.save();
      return res.json(chat);
    }
    return res.status(403).send("You are not admin");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.put("/removemember", auth, async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    );
    if (!removed) return res.status(404).send("Chat Not Found");
    res.json(removed);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.put("/addmember", auth, async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    );
    if (!added) return res.status(404).send("Chat Not Found");
    res.json(added);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
