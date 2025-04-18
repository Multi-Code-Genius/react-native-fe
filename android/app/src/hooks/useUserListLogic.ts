import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useUserInfo} from '../api/user/user';
import {useUserStore} from '../store/userStore';
import {useAuthStore} from '../store/authStore';
import {connectSocket} from '../config/socket';
import {requestUserPermission} from '../utils/fcm';
import {useSendTokenToBackend} from '../api/notification/notification';
import {useGetAllUser} from '../api/user/user';

export const useUserListLogic = () => {
  const {data, refetch: profileRefetch} = useUserInfo();
  const {token} = useAuthStore();
  const {loadUserData, setUserData} = useUserStore();
  const {mutate: sendTokenMutation} = useSendTokenToBackend();
  const {data: userData, isLoading, refetch} = useGetAllUser();
  const [refreshing, setRefreshing] = useState(false);

  const users = userData?.users || [];

  useEffect(() => {
    setUserData(data?.user);
    loadUserData();
    connectSocket(token ?? '');
    requestUserPermission(sendTokenMutation);

    const setupChannel = async () => {
      await notifee.requestPermission();
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    };

    setupChannel();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || '📣 Notification',
        body: remoteMessage.notification?.body || 'You have a new message.',
        android: {
          channelId: 'default',
          pressAction: {id: 'default'},
          smallIcon: 'ic_launcher',
          color: '#4CAF50',
        },
      });
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    data,
    users,
    isLoading,
    refetch,
    refreshing,
    onRefresh,
    profileRefetch,
  };
};
