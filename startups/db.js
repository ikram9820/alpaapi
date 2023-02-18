const mongoose = require("mongoose");
const config = require("config");
// const mongoURL = config.get("db");
const mongoURL = `mongodb://ikram:1234@mongo:27017/?authSource=admin`

module.exports = connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("succesfully connected to DB"))
    .catch((e) => {
      console.log(e);
      // setTimeout(connectWithRetry, 5000);
    });
};
