import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Server } from "socket.io";

import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import questionRouter from './routes/questions.js';
import answerRouter from './routes/answers.js';
import subscriptionRouter from './routes/subscription.js';
import socialRouter from './routes/social.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/questions', questionRouter);
app.use('/answers', answerRouter);
app.use('/subscription', subscriptionRouter);
app.use('/social', socialRouter);

app.get("/", (req, res) => {
  res.send("Hello from server");
});

const io = new Server(server, {
  cors: {
    origin: "https://ak-codecrib.netlify.app",
  },
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});
export { io };


// Start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.DB_URL)
  .then(() =>
    server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
  
