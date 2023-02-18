const mongoose = require("mongoose");
const config = require("config");
const mongoURL = config.get("db");

module.exports = connectWithRetry = () => {
  mongoose.set("strictQuery", false);
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
