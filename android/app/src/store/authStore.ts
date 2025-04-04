import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthState = {
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  saveToken: (token: string) => Promise<void>;
  initializeAuth: () => Promise<void>;
  removeToken: () => void;
};

export const useAuthStore = create<AuthState>(set => {
  const loadAuthState = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem('isAuthenticated');
      set({isAuthenticated: storedAuth === 'true'});
    } catch (error) {
      console.error('Error loading authentication state:', error);
    }
  };

  loadAuthState();
  return {
    isAuthenticated: false,

    logout: async () => {
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('accessToken');
      set({isAuthenticated: false});
    },

    saveToken: async (token: string) => {
      try {
        await AsyncStorage.setItem('accessToken', token);
        await AsyncStorage.setItem('isAuthenticated', 'true');
        set({isAuthenticated: true});
      } catch (error) {
        console.error('Error saving token:', error);
        await AsyncStorage.removeItem('accessToken');
      }
    },

    removeToken: () => {
      set({isAuthenticated: false});
    },

    initializeAuth: async () => {
      await loadAuthState();
    },
  };
});
