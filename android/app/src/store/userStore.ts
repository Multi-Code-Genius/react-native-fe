import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserState} from '../types/auth';

export const useUserStore = create<UserState>(set => ({
  userData: null,

  setUserData: async data => {
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    set({userData: data});
  },

  loadUserData: async () => {
    const storedData = await AsyncStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      set({userData: parsedData});
    }
  },

  clearUserData: async () => {
    await AsyncStorage.removeItem('userData');
    set({userData: null});
  },
}));
