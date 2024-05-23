// // socketSetup.js
// const socketIo = require("socket.io");

// function setupSocket(httpsServer) {
//   const io = socketIo(httpsServer, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("A user connected");

//     // Handle chat messages
//     socket.on("chat message", (msg) => {
//       io.emit("chat message", msg);
//     });

//     // Handle notifications
//     socket.on("notification", (notification) => {
//       io.emit("notification", notification);
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });
// }

// module.exports = setupSocket;

// socketSetup.js
const setupSocket1 = (io) => {
  console.log("before user connected");

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });

    socket.on("notification", (notification) => {
      io.emit("notification", notification);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

// module.exports = setupSocket;
module.exports = setupSocket1;
