import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {FlatList, RefreshControl, StyleSheet, View, Text} from 'react-native';
import {
  ActivityIndicator,
  Badge,
  IconButton,
  Surface,
  useTheme,
} from 'react-native-paper';
import {useSendRequest} from '../api/request/request';
import UserCard from '../components/UserCard';
import {useUserListLogic} from '../hooks/useUserListLogic';
import {Message} from '../types/messageTypes';
import {call} from '../constant/script';
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
  const theme = useTheme();

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

  const handleClick = () => {
    call();
  };

  const messagesReceived: Message[] = data?.user?.messagesReceived ?? [];

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
        <View>
          <IconButton
            icon="message-outline"
            iconColor="white"
            onPress={() => (navigation as any).navigate('ChatList')}
            style={{position: 'relative'}}
          />
          {messagesReceived.length !== 0 && (
            <Badge
              style={{
                position: 'absolute',
                right: 5,
                top: 5,
                backgroundColor: theme.colors.primary,
              }}
              size={18}>
              {messagesReceived.length}
            </Badge>
          )}
        </View>
        <IconButton
          icon="chat"
          iconColor="white"
          onPress={handleClick}
          style={{position: 'relative'}}
        />
      </View>

      <FlatList
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
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});
