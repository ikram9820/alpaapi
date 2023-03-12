const { createServer } = require("http");
const { Server } = require("socket.io");

module.exports = function (app) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
      if (userData) socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (chatId) => {
      socket.join(chatId);
      socket.emit("joined chat", chatId);
      // console.log("chatId: ",chatId);
    });

    socket.on("new message", (recievedMessage) => {
      // console.log("recievedMessage: ", recievedMessage);
      const chat = recievedMessage.chat;
      socket.broadcast.to(chat).emit("message recieved", recievedMessage);
    });

    socket.off("setup", () => {
      socket.leave(userData._id);
    });
  });

  return httpServer;
};
