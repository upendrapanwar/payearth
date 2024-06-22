require("rootpath")();
const express = require("express");
const cors = require("cors");
const jwt = require("./app/helpers/jwt");
const errorHandler = require("./app/helpers/error-handler");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("./app/config/index");
const package = require("package.json");
const app = express();
const https = require("https");
const fs = require("fs");
const { ChatMessage } = require("../payearth-api/app/helpers/db");
// const setupSocket1 = require("./app/helpers/socket-io");
const socketIo = require("socket.io");


const ENV = config.app_env;
console.log("env=" + config.app_env);
var SWAG_URL = ENV == "local" ? config.local_url : config.dev_url;
var PORT = ENV == "local" ? config.local_port : config.dev_port;

app.get("/", function (req, res) {
  res.redirect("/documentation");
});

app.use(jwt());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

global.__basedir = __dirname;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
// Require routes
app.use("/front", require("./app/controllers/front.controller"));
app.use("/community", require("./app/controllers/community.controller"));
app.use("/admin", require("./app/controllers/admin.controller"));
app.use("/user", require("./app/controllers/user.controller"));
app.use("/seller", require("./app/controllers/seller.controller"));
app.use(
  "/" + config.uploadDir,
  express.static(__dirname + "/" + config.uploadDir)
);
app.use(errorHandler);
//Swagger Configurations
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PayEarth REST API",
      version: package.version,
      description: package.description,
      license: {
        name: package.license,
        url: "https://opensource.org/licenses/MIT",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          description: "Enter JWT Bearer Token",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: SWAG_URL + ":" + PORT,
        description: ENV + " server",
      },
    ],
  },
  apis: ["./app/swagger_operations/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(specs));

var certOptions = {
  key: fs.readFileSync(config.ssl_key, "utf8"),
  cert: fs.readFileSync(config.ssl_cert, "utf8"),
};

// serve the API with HTTPS
const httpsServer = https.createServer(certOptions, app);

httpsServer.listen(PORT, () => {
  console.log("HTTPS Server running on port " + PORT);
  //log.Info(`Server Running at ${PORT} on ${process.env.NODE_ENV}...`)
});

const io = require('socket.io')(httpsServer, {
  pingTimeout: 60000,

  cors: {
    origin: ["*", "http://localhost:3000", "https://localhost:3000"], // for local
    // origin: ["*", "http://pay.earth:7700", "https://pay.earth"], // for Live
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }
});

io.on("connection", function (socket) {
  console.log("Connected to socket.io");

  socket.on('setup', function (userID) {
    socket.join(userID);
    // console.log("userID setup", userID)
    socket.emit("connected");

    // io.emit('user_online', userID)
  });

  socket.on('active', function (userID) {
    io.emit('user_online', userID)
  })

  socket.on('join chat', function (room) {
    socket.join(room)
    // console.log("User join room " + room);
  });

  socket.on('send_notification', function (notification) {
    console.log("notification", notification);
    // console.log("receive_notification", notification.data.chat.chatUsers[1].id)
    // const data = notification.data.chat.chatUsers[1].id;
    // console.log("Notification send to this id : ", data)
    io.emit('receive_notification', notification);

    // io.in(id).emit("message_recieved", message);
  })

  socket.on('new message', function (msg) {
    // console.log("msg", msg)
    var chat = msg.chat;
    // console.log("chat", chat)
    // console.log("recieve msg", msg)

    if (!chat.chatUsers) {
      return console.log("Chat user not defined");
    }

    chat.chatUsers.forEach((user) => {
      // console.log("user", user)
      if (user.id === msg.sender.id) {
        socket.in(user.id).emit("message_recieved", msg);
        // console.log("message_recieved", msg)
      }
    });
  });

  socket.off("setup", function () {
    // console.log("USER DISCONECT");
    socket.leave(userID)
  })

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    io.emit('user_offline', socket.id);
  });

});
