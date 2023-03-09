const winston = require("winston");
const path = require("path");

const config = require("config");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();

const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));

// require("./startup/logging")();
require("./startup/cors")(app);
const server = http.createServer(app);
const io = socketio(server);
require("./startup/routes")(app);
require("./socketio/chat")(io);
require("./startup/db")();
require("./startup/validation")();
require("./startup/config")();

const port = process.env.PORT || config.get("port");
server.listen(port, () => winston.info(`Listening on port ${port}...`));
