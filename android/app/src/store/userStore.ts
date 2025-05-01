import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserState} from '../types/auth';
import moment from 'moment-timezone';

export const useUserStore = create<UserState>(set => ({
  userData: null,
  selectedDate: moment().format('D MMM'),
  setSelectedDate: date => {
    set({selectedDate: date});
  },

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
