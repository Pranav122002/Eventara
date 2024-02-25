const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const socket = require("socket.io");

require("dotenv").config();
const PORT = process.env.PORT || 5000;
MONGOURI="mongodb+srv://collegeme84:nnP9FE85cSvsLsue@cluster0.73rycjp.mongodb.net/"

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./models/user");
require("./models/group_message");
require("./models/personal_message");
require("./models/committee");
require("./models/bookings")
require("./models/rooms")
require("./models/Event")

app.use(require("./routes/user"));
app.use(require("./routes/auth"));
app.use(require("./routes/message"));
app.use(require("./routes/committee"));
app.use(require("./routes/events"));
app.use(require("./routes/booking"));

mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection successfull ...");
});

mongoose.connection.on("error", () => {
  console.log("MongoDB connection error !!!");
});

const server = app.listen(PORT, () => {
  console.log("Server is running on PORT" + " " + PORT + " ...");
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    io.emit("message", message);
  });

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("personal-message", (message) => {
    const { sender_id, receiver_id } = message;

    const senderSocketId = onlineUsers.get(sender_id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("personal-message", message);
    }

    const recipientSocketId = onlineUsers.get(receiver_id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("personal-message", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    });
  });
});
