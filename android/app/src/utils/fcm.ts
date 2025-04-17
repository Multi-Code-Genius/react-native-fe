import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import {useAuthStore} from '../store/authStore';

export const requestUserPermission = async (
  sendTokenMutation: any,
): Promise<void> => {
  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('🔐 Notification permission granted.');
    const newToken = await getFcmToken();

    if (
      (newToken && !useAuthStore.getState().fctToken) ||
      (newToken && useAuthStore.getState().fctToken !== newToken)
    ) {
      useAuthStore.getState().setFctToken(newToken ?? '');
      sendTokenMutation({token: newToken});
    }
  } else {
    Alert.alert('Permission denied for notifications');
  }
};

export const getFcmToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    if (token) {
      console.log('✅ FCM Token:', token);

      return token;
    }
  } catch (error) {
    console.log('❌ Error getting FCM token:', error);
  }
  return null;
};
