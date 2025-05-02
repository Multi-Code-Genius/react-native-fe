import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Badge, IconButton, Surface, useTheme } from 'react-native-paper';
import { useSendRequest } from '../api/request/request';

import UserCard from '../components/UserCard';
import { useUserListLogic } from '../hooks/useUserListLogic';
import { Message } from '../types/messageTypes';
import ScreenWithHeader from '../components/ScreenWithHeader';

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

  const { mutate } = useSendRequest();
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
        {[...Array(6)].map((_, index) => (
          <Surface key={index} style={styles.skeletonCard}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.skeletonTextContainer}>
              <View style={styles.skeletonTextLine} />
              <View style={[styles.skeletonTextLine, { width: '60%' }]} />
            </View>
          </Surface>
        ))}
      </Surface>


    );
  }

  return (
    <View>
      <ScreenWithHeader navigation={navigation}>
        <Surface style={styles.container}>
          <FlatList
            data={users}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <UserCard user={item} onRequest={onSendRequest} />
            )}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
          />
        </Surface>
      </ScreenWithHeader>
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
