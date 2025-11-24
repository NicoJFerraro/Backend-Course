import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import app from './app.js';
import { Product } from './models/Product.js';

const PORT = 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
async function start() {
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    console.log('MongoDB connected');

    const httpServer = createServer(app);
    const io = new Server(httpServer);
    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    httpServer.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();