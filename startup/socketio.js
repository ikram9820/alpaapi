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
    socket.emit("connected");
   
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      socket.emit("joined chat", chatId);
      // console.log("chatId: ",chatId);
    });

    socket.on("sendMessage", (recievedMessage) => {
      // console.log("recievedMessage: ", recievedMessage);
      const chat = recievedMessage.chat;
      socket.to(chat).emit("messageRecieved", recievedMessage);
    });
    socket.on("createGroup", (group) => {
      console.log("group: ", group);
      const chatId = group._id;
      socket.join(chatId);
      socket.to(chatId).emit("groupCreated", group);
    });


  });

  return httpServer;
};
