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

//socket io connection
// const io = require("socket.io")(httpsServer, {
//   cors: {
//     origin: config.allowed_origin || "*",
//   },
// });

// setupSocket1(io);

// Socket.IO setup
const io = socketIo(httpsServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle chat messages
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  // Handle notifications
  socket.on("notification", (notification) => {
    io.emit("notification", notification);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpsServer.listen(PORT, () => {
  console.log("HTTPS Server running on port " + PORT);
  //log.Info(`Server Running at ${PORT} on ${process.env.NODE_ENV}...`)
});
