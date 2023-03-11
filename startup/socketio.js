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
      socket.join(userData._id);
      socket.emit("connected");
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
    });
  
    socket.on("new message", (recievedMessage) => {
      var chat = recievedMessage.chat;
      chat.users.forEach((user) => {
        if (user == recievedMessage.sender._id) return;
        socket.in(user).emit("message recieved", recievedMessage);
      });
    });
  
    socket.off("setup", () => {
      socket.leave(userData._id);
    });
  });


  return  httpServer;
};
