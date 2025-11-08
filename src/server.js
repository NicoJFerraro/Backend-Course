import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { productManager } from './instances.js';

const PORT = 8080;
const httpServer = createServer(app);
const io = new Server(httpServer);

// Make io accessible in routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', async (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send initial product list
  try {
    const products = await productManager.getAll();
    socket.emit('products:update', products);
  } catch (error) {
    console.error('Error sending initial products:', error);
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});