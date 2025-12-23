import { Server } from 'socket.io';

let io: Server | null = null;

export const setupSocket = (serverIo: Server) => {
  io = serverIo;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

export const emitEvent = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};