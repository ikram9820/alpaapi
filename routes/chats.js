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
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    return res.status(200).send(FullChat);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.post("/group", auth, async (req, res) => {
  try {
    let users = req.body.users;
    users.push(req.user);
    const newGroup = {
      name: req.body.name,
      chatDp: req.body.chatDp,
      users: users,
      isGroupChat: true,
      admins: [req.user._id],
      chatCreator: req.user._id,
    };
    const groupChat = await Chat.create(newGroup);
    return res.status(200).send(groupChat);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.put("/rename", async (req, res) => {
  try {
    const { chatId, name } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { name: name },
      { new: true }
    )
      .populate("users", "-password")
      .populate("admins", "-password");

    if (!updatedChat) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.put("/removemember", async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("admins", "-password");

    if (!removed) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.json(removed);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.put("/addmember", async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("admins", "-password");

    if (!added) {
      return res.status(404).send("Chat Not Found");
    } else {
      res.json(added);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
