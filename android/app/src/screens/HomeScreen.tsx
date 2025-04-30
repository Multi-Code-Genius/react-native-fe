import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {Badge, IconButton, Surface, useTheme} from 'react-native-paper';
import {useSendRequest} from '../api/request/request';
import {useGames, useGetGameByIde} from '../api/games/useGame';

import UserCard from '../components/UserCard';
import {useUserListLogic} from '../hooks/useUserListLogic';
import {Message} from '../types/messageTypes';

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

  const {data: gamesData} = useGames();
  const {data: d, isLoading: gameDataLoading} = useGetGameByIde(
    '3c3a9170-2b13-443f-a3e3-67d141909b49',
  );

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

  const messagesReceived: Message[] = data?.user?.messagesReceived ?? [];

  if (isLoading) {
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
            icon="account-group"
            iconColor="white"
            onPress={() => (navigation as any).navigate('Rooms')}
            style={{position: 'relative'}}
          />
          <View>
            <IconButton
              icon="chat"
              iconColor="white"
              onPress={() => (navigation as any).navigate('ChatList')}
              style={{position: 'relative'}}
            />
          </View>
        </View>
        {[...Array(6)].map((_, index) => (
          <Surface key={index} style={styles.skeletonCard}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonTextContainer}>
              <View style={styles.skeletonTextLine} />
              <View style={[styles.skeletonTextLine, {width: '60%'}]} />
            </View>
          </Surface>
        ))}
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
          icon="account-group"
          iconColor="white"
          onPress={() => (navigation as any).navigate('Rooms')}
          style={{position: 'relative'}}
        />
        <View>
          <IconButton
            icon="chat"
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
  },
  actionButton: {
    marginTop: 10,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
  },
  skeletonTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  skeletonTextLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2a2a2a',
    marginBottom: 6,
    width: '80%',
  },
});
