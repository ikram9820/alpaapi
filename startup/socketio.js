module.exports = function (app) {
  const { createServer } = require("http");
  const { Server } = require("socket.io");

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  return { io, httpServer };
};
