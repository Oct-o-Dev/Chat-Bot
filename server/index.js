const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const messageRoute = require("./routes/messagesRoute");
const userRoutes = require("./routes/userRoute");

const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1,"..", "public/chat-app/build")));

  app.get("*", (req, res) =>
		res.sendFile(
			path.resolve(__dirname1, "..", "public/chat-app", "build", "index.html")
		)
	);
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB Connection Successfully");
}).catch((err) => {
  console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started at Port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
        
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message);
      }
    });
  });