const mongoose = require("mongoose");
const config = require("config");
// const mongoURL = config.get("db");
// const mongoURL = `mongodb://ikram:1234@db:27017/alpa?authSource=admin`
const mongoURL = "mongodb+srv://ikram9820khan:xZSMScNUhIe1bcDq@cluster0.8gkvjcv.mongodb.net/alpa?retryWrites=true&w=majority"

module.exports = connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("succesfully connected to DB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};
