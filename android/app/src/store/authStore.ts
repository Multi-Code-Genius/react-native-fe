import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthState} from '../types/auth';

export const useAuthStore = create<AuthState>(set => {
  const loadAuthState = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem('isAuthenticated');
      const token = await AsyncStorage.getItem('accessToken');
      const deviceToken = await AsyncStorage.getItem('FCTtoken');
      set({fctToken: deviceToken ?? ''});
      set({isAuthenticated: storedAuth === 'true'});
      set({token: token});
    } catch (error) {
      console.error('Error loading authentication state:', error);
    }
  };

  loadAuthState();
  return {
    isAuthenticated: false,
    fctToken: null,
    token: null,
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
        set({token: token});
      } catch (error) {
        console.error('Error saving token:', error);
        await AsyncStorage.removeItem('accessToken');
      }
    },

    setFctToken: async token => {
      set({fctToken: token});
      await AsyncStorage.setItem('FCTtoken', token);
    },

    removeToken: () => {
      set({isAuthenticated: false});
    },

    initializeAuth: async () => {
      await loadAuthState();
    },
  };
});
