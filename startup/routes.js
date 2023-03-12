const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const profiles = require("../routes/profiles");
const visibility = require("../routes/visibility_filter");
const statuses = require("../routes/statuses");
const chats = require("../routes/chats");
const messages = require("../routes/messages");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/users", users);
  app.use("/api/v1/profile", profiles);
  app.use("/api/v1/visibility", visibility);
  app.use("/api/v1/statuses", statuses);
  app.use("/api/v1/chats", chats);
  app.use("/api/v1/messages", messages);
};
