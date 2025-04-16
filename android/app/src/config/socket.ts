import {io, Socket} from 'socket.io-client';
import {BASE_URL} from '@env';

let socket: Socket;

export const connectSocket = (token: string) => {
  socket = io(BASE_URL, {
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from socket');
  });
};

export const getSocket = (): Socket => {
  return socket;
};
