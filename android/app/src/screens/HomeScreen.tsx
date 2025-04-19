import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator, IconButton, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSendRequest} from '../api/request/request';
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
      <View style={styles.actionButton}>
        <IconButton
          icon="heart"
          iconColor={'white'}
          onPress={() =>
            (navigation as any).navigate('FriendsRequestAcceptScreen')
          }
        />
        <IconButton
          icon="message-outline"
          iconColor="white"
          onPress={() => (navigation as any).navigate('TestScreen')}
        />
      </View>

      {/* <FlatList
        data={users}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({item}) => (
          <UserCard user={item} onRequest={onSendRequest} />
        )}
        contentContainerStyle={{paddingVertical: 10}}
        showsVerticalScrollIndicator={false}
      /> */}
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
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});
