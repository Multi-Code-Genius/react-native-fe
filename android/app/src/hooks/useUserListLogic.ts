import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useUserInfo} from '../api/user/user';
import {useUserStore} from '../store/userStore';
import {requestUserPermission} from '../utils/fcm';
import {useSendTokenToBackend} from '../api/notification/notification';
import {useGetAllUser} from '../api/user/user';
import {AppState} from 'react-native';
import {usePingOnline} from './useHeartBeat';

export const useUserListLogic = () => {
  const {
    data,
    refetch: profileRefetch,
    isLoading: profileLoading,
    error: profileError,
  } = useUserInfo();

  const {loadUserData, setUserData} = useUserStore();
  const {mutate: sendTokenMutation} = useSendTokenToBackend();
  const {data: userData, isLoading, refetch} = useGetAllUser();
  const [refreshing, setRefreshing] = useState(false);
  const [isAppActive, setIsAppActive] = useState(true);

  const users = userData?.users || [];

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      setIsAppActive(nextState === 'active');
    });

    return () => sub.remove();
  }, []);

  usePingOnline(isAppActive);

  useEffect(() => {
    setUserData(data?.user);
    loadUserData();

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
      await profileRefetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [refetch, profileRefetch]);

  return {
    data,
    users,
    isLoading,
    refetch,
    refreshing,
    onRefresh,
    profileRefetch,
    profileLoading,
    profileError,
  };
};
