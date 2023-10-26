const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server, { cors: { origin: "*" } });

const { dbConnection } = require("./db/config");
const router = require("./routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", router);
try {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    socket.on("chatMessage", (message) => {
      console.log(message);
    });
    socket.on("addlike", (message) => {
      console.log(message);
    });
    socket.on("dislike", (message) => {
      console.log(message);
    });
    // socket.broadcast.emit("chat-message", text);
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
} catch (error) {
  console.log("Socket error", error);
}

server.listen(8080, async () => {
  console.log(`server is running at ${8080}`);
  await dbConnection();
});

exports.io = io;
