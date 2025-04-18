import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {ActivityIndicator, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDeclineRequest, useSendRequest} from '../api/request/request';
import UserCard from '../components/UserCard';
import {useUserListLogic} from '../hooks/useUserListLogic';
const UserListScreen = () => {
  const navigation = useNavigation();
  const {
    data,
    users,
    isLoading,
    refreshing,
    onRefresh,
    refetch,
    profileRefetch,
  } = useUserListLogic();
  const {mutate} = useSendRequest();

  const onSendRequest = (receiverId: string) => {
    mutate({
      senderId: data?.user?.id,
      receiverId,
    });
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
      profileRefetch();
    }, [refetch, profileRefetch]),
  );

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
        onPress={() =>
          (navigation as any).navigate('FriendsRequestAcceptScreen')
        }>
        <Icon name="heart" size={25} color={'white'} />
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item, index}) => (
          <UserCard
            user={item}
            index={index}
            currentUserId={data?.user?.id}
            onRequest={onSendRequest}
          />
        )}
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
});
