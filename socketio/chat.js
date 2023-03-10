const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("join", (options, callback) => {
      const { error, user } = addUser({ id: socket.id, ...options });

      if (error) {
        return callback(error);
      }

      socket.join(user.room);

      socket.emit("message", generateMessage("Admin", "Welcome!"));
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          generateMessage("Admin", `${user.username} has joined!`)
        );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    });

    socket.on("createChat", (options, callback) => {
      callback();
      console.log(options);
    });
    socket.on("deleteChat", (options, callback) => {
      callback();
      console.log(options);
    });
    socket.on("addUserToChat", (options, callback) => {
      callback();
      console.log(options);
    });
    socket.on("deleteUserFromChat", (options, callback) => {
      callback();
      console.log(options);
    });
    socket.on("sendMessage", (message, callback) => {
      console.log(message);
      const user = getUser(socket.id);
      io.emit("message", generateMessage("user.username", message));
      callback();
    });
    socket.on("deleteMessage", (options, callback) => {
      callback();
      console.log(options);
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          generateMessage("Admin", `${user.username} has left!`)
        );
        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });
  });
};
