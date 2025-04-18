import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  ActivityIndicator,
  Surface,
  Avatar,
  Text,
  Card,
  Badge,
  useTheme,
  IconButton,
  Tooltip,
  Button,
} from 'react-native-paper';
import {useGetAllUser, useUserInfo} from '../api/user/user';
import {useUserStore} from '../store/userStore';
import {useAuthStore} from '../store/authStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {connectSocket} from '../config/socket';
import moment from 'moment';
import {useSendRequest} from '../api/request/request';
import {requestUserPermission} from '../utils/fcm';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {useSendTokenToBackend} from '../api/notification/notification';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type User = {
  id: string;
  name: string;
  email: string;
  profile_pic: string | null;
  isOnline: boolean;
  lastSeen: string | null;
};

const formatLastSeen = (lastSeen: string | null) => {
  if (!lastSeen) {
    return 'Last seen: Unknown';
  }
  return `Last seen: ${moment(lastSeen).fromNow()}`;
};

const RequestButton = ({
  onRequest,
  id,
  isAlreadySent,
}: {
  onRequest: (ID: string) => void;
  id: string;
  isAlreadySent: boolean;
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={[animatedStyle, {marginLeft: 8}]}>
      <Tooltip
        title={isAlreadySent ? 'Request Sent!' : 'Send Request'}
        leaveTouchDelay={500}>
        <IconButton
          icon={isAlreadySent ? 'account-check' : 'account-plus'}
          size={24}
          onPress={() => onRequest(id)}
          onPressIn={() => (scale.value = withSpring(0.9))}
          onPressOut={() => (scale.value = withSpring(1))}
          iconColor={
            isAlreadySent ? theme.colors.secondary : theme.colors.primary
          }
          style={{
            backgroundColor: theme.colors.surface,
          }}
        />
      </Tooltip>
    </Animated.View>
  );
};

const UserListScreen = () => {
  const {data} = useUserInfo();
  const {loadUserData, setUserData} = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const {token} = useAuthStore();
  const {data: userData, isLoading, refetch} = useGetAllUser();
  const {mutate} = useSendRequest();
  const users = userData?.users || [];
  const theme = useTheme();
  const {mutate: sendTokenMutation} = useSendTokenToBackend();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

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
      console.log('Foreground notification:', remoteMessage);

      await notifee.displayNotification({
        title: remoteMessage.notification?.title || '📣 Notification',
        body: remoteMessage.notification?.body || 'You have a new message.',
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
          color: '#4CAF50',
          importance: AndroidImportance.HIGH,
        },
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlerRequest = (id: string) => {
    const payload = {
      senderId: data.user.id,
      receiverId: id,
    };
    mutate(payload);
  };

  const renderItem = ({item}: {item: User}) => {
    if (item?.id === data?.user?.id) {
      return null;
    }

    const avatarSource = item.profile_pic ? {uri: item.profile_pic} : undefined;

    return (
      <Animated.View
        entering={FadeInUp.duration(300)}
        style={{marginVertical: 8}}>
        <Card mode="elevated" style={styles.card}>
          <Card.Content style={styles.row}>
            {avatarSource ? (
              <View style={{position: 'relative'}}>
                <Avatar.Image size={48} source={avatarSource} />
                <Badge
                  size={16}
                  style={{
                    backgroundColor: item.isOnline
                      ? theme.colors.primary
                      : theme.colors.error,
                    position: 'absolute',
                    bottom: 0,
                    right: -4,
                  }}
                />
              </View>
            ) : (
              <View style={{position: 'relative'}}>
                <Avatar.Text
                  style={{backgroundColor: theme.colors.secondary}}
                  size={48}
                  label={item.name.slice(0, 2).toUpperCase()}
                />
                <Badge
                  size={16}
                  style={{
                    backgroundColor: item.isOnline
                      ? theme.colors.primary
                      : theme.colors.error,
                    position: 'absolute',
                    bottom: 0,
                    right: -4,
                  }}
                />
              </View>
            )}

            <Surface style={styles.info} elevation={0}>
              <Text
                variant="titleMedium"
                style={{color: theme.colors.onPrimary}}>
                {item.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{color: theme.colors.secondary}}>
                {item.email}
              </Text>

              {!item.isOnline && (
                <Text
                  variant="bodySmall"
                  style={{color: theme.colors.secondary}}>
                  {formatLastSeen(item.lastSeen)}
                </Text>
              )}
            </Surface>

            <RequestButton
              isAlreadySent={data?.user?.sentRequests?.some(
                (e: any) => e?.receiverId === item.id,
              )}
              onRequest={handlerRequest}
              id={item.id}
            />
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <Surface style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          (navigation as any).navigate('FriendsRequestAcceptScreen');
        }}>
        <Icon
          name="heart"
          size={25}
          color={'white'}
          style={{display: 'flex', alignItems: 'flex-end'}}
        />
      </TouchableOpacity>

      <FlatList
        data={users}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: 10}}
        showsVerticalScrollIndicator={false}
      />
    </Surface>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  actionButton: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: '#fff',
  },
  email: {
    color: '#aaa',
  },
  status: {
    color: '#888',
    marginTop: 2,
  },
  lastSeen: {
    color: '#666',
    marginTop: 2,
  },
});
