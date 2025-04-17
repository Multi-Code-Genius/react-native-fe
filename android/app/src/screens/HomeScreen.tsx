import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, {
  FadeInUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {ActivityIndicator, Surface} from 'react-native-paper';
import {useGetAllUser, useSendRequest, useUserInfo} from '../api/user/user';
import {useUserStore} from '../store/userStore';
import {useAuthStore} from '../store/authStore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {connectSocket} from '../config/socket';

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
  const date = new Date(lastSeen);
  return `Last seen: ${date.toLocaleString()}`;
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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={[styles.buttonWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={() => onRequest(id)}
        disabled={isAlreadySent}
        onPressIn={() => (scale.value = withSpring(0.95))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={styles.requestButton}>
        <Text style={styles.requestText}>
          {' '}
          {isAlreadySent ? 'Requested' : 'Request'}
        </Text>
      </TouchableOpacity>
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
  const navigation = useNavigation();

  const users = userData?.users || [];

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
  }, []);

  const handlerRequest = (id: string) => {
    console.log('id', id);
    const payload = {
      senderId: data.user.id,
      receiverId: id,
    };
    mutate(payload);
  };

  const renderItem = ({item}: {item: User}) => {
    // if (item?.id === data?.user?.id) {
    //   return null;
    // }

    const handleSubmit = (id: string | undefined) => {
      (navigation as any).navigate('UserProfile', {id});
    };

    return (
      <Animated.View
        entering={FadeInUp.duration(300)}
        style={{marginVertical: 10}}>
        <Surface style={styles.card} elevation={4}>
          <View style={styles.row}>
            <Image
              source={{
                uri: item.profile_pic
                  ? item.profile_pic
                  : 'https://ui-avatars.com/api/?name=' + item.name,
              }}
              style={styles.avatar}
            />
            <View style={styles.info}>
              <TouchableOpacity onPress={() => handleSubmit(item?.id)}>
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.status}>
                {item.isOnline ? '🟢 Online' : '⚫ Offline'}
              </Text>
              <Text style={styles.lastSeen}>
                {formatLastSeen(item.lastSeen)}
              </Text>
            </View>
            <RequestButton
              isAlreadySent={data?.user?.sentRequests.some(
                (e: any) => e?.receiverId === item.id,
              )}
              onRequest={handlerRequest}
              id={item.id}
            />
          </View>
        </Surface>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        onRefresh={onRefresh}
        refreshing={refreshing}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: 20}}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  email: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 1,
  },
  status: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  lastSeen: {
    color: '#666',
    fontSize: 11,
    marginTop: 1,
  },
  buttonWrapper: {
    marginLeft: 8,
  },
  requestButton: {
    backgroundColor: '#292929',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  requestText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
});
