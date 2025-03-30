// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const messageRoute = require('./routes/messagesRoute');
const userRoutes = require('./routes/userRoute');
const socket = require('socket.io');

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

// --------------------------deployment------------------------------
const path = require('path');
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '..', 'public/chat-app/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname1, '..', 'public/chat-app', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running..');
  });
}

// --------------------------deployment------------------------------

// Database connection with Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10-second timeout
      family: 4, // Use IPv4
    });
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
