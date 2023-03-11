const winston = require("winston");
const config = require("config");
const express = require("express");
const app = express();

// require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();
const {io,httpServer} = require("./startup/socketio")(app)
require("./startup/db")();
require("./startup/validation")();
const port = process.env.PORT || config.get("port");
httpServer.listen(port, () => winston.info(`Listening on port ${port}...`));
