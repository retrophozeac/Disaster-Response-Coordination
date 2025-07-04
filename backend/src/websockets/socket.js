const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // In production, restrict this to the frontend URL
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_disaster_room', (disasterId) => {
      socket.join(disasterId);
      console.log(`Socket ${socket.id} joined room ${disasterId}`);
    });

    socket.on('leave_disaster_room', (disasterId) => {
      socket.leave(disasterId);
      console.log(`Socket ${socket.id} left room ${disasterId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
}

module.exports = {
  initSocket,
  getIO,
};
