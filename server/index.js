// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const messageRoute = require('./routes/messagesRoute');
const userRoutes = require('./routes/userRoute');
const socket = require('socket.io');
const User = require("./model/userModel");

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [/\.vercel\.app$/, process.env.FRONTEND_URL].filter(Boolean)
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoute);

// Basic route for checking API status
app.get('/', (req, res) => {
  res.send('API is running..');
});

// Database connection with Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('DB Connection Successfully');
  } catch (error) {
    console.error('DB Connection Error: ', error.message);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// Call the database connection function
connectDB();

// Server setup
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server Started at Port ${process.env.PORT || 5000}`);
});

// Socket.io setup
const io = socket(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [/\.vercel\.app$/, process.env.FRONTEND_URL].filter(Boolean)
      : 'http://localhost:3000',
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message);
    }
  });
});
