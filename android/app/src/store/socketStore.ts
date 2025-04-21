import {create} from 'zustand';
import io, {Socket} from 'socket.io-client';
import {BASE_URL} from '@env';

interface SocketStore {
  socket: Socket | null;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketStore>(set => ({
  socket: null,
  connectSocket: userId => {
    const newSocket = io(BASE_URL, {
      query: {userId},
    });

    set({socket: newSocket});
  },
  disconnectSocket: () => {
    const socket = useSocketStore.getState().socket;
    socket?.disconnect();
    set({socket: null});
  },
}));
