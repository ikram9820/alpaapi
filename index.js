const config = require('config')
const express = require("express");

const app = express();

require("./startups/cors")(app);
require("./startups/routes")(app);
require("./startups/db")();


const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

module.exports = server;