import {create} from 'zustand';
import io, {Socket} from 'socket.io-client';
import {BASE_URL} from '@env';
import {MessageType} from '@flyerhq/react-native-chat-ui';

interface SocketStore {
  socket: Socket | null;
  messages: MessageType.Any[];
  setMessages: (message: MessageType.Any) => void;
  connectSocket: (userId: string) => void;
  setMessagesInLast: (message: any) => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketStore>(set => ({
  socket: null,
  messages: [],

  setMessages: updater => {
    set(state => ({
      messages:
        typeof updater === 'function'
          ? updater(state.messages)
          : [...state.messages, updater],
    }));
  },
  setMessagesInLast: updater => {
    set(state => ({
      messages: [...state.messages, updater],
    }));
  },

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
    set({messages: []});
  },
}));
