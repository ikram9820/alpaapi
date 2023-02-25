const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const profiles = require("../routes/profiles");
const visibility = require("../routes/visibility_filter");
const statuses = require("../routes/statuses");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/users", users);
  app.use("/api/v1/profiles", profiles);
  app.use("/api/v1/visibility", visibility);
  app.use("/api/v1/statuses", statuses);
};
