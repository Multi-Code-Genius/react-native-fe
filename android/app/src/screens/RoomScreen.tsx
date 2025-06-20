import React, {useEffect} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Icon, List, Text, useTheme} from 'react-native-paper';

import {useGetRooms, useJoinRoom, useRequestRoom} from '../api/room/room';
import {useUserListLogic} from '../hooks/useUserListLogic';

const RoomScreen = ({setIsUpdate}: {setIsUpdate: (data: boolean) => void}) => {
  const theme = useTheme();
  const {profileRefetch, profileLoading} = useUserListLogic();
  const {data: roomData, refetch: refetchRooms, isFetching} = useGetRooms();
  const {
    mutate: joinRoom,
    isPending: isJoining,
    isSuccess: joinSuccess,
  } = useJoinRoom();
  const {mutate: requestRoom, isPending, isSuccess} = useRequestRoom();

  useEffect(() => {
    if (!profileLoading) {
      profileRefetch();
    }

    if (joinSuccess) {
      profileRefetch();
      setIsUpdate(true);
    }
  }, [isSuccess, joinSuccess, profileLoading, profileRefetch, setIsUpdate]);

  const handleRequestRoom = () => {
    requestRoom();
  };

  const handleJoinRoom = (roomId: string) => {
    joinRoom(roomId.toString());
    setIsUpdate(true);
  };

  const renderRoomItem = ({item}: {item: any; index: number}) => {
    const isRoomFull = item.status === 'full';
    return (
      <List.Item
        key={item.id}
        title={item.platform}
        description={
          <Text
            style={{
              color: isRoomFull ? theme.colors.error : theme.colors.primary,
            }}>
            {isRoomFull ? 'Full' : 'Open'}
          </Text>
        }
        left={props => (
          <Icon
            {...props}
            source={isRoomFull ? 'door-closed' : 'door-open'}
            size={24}
            color={theme.colors.primary}
          />
        )}
        right={() => (
          <TouchableOpacity
            onPress={() => handleJoinRoom(item.id)}
            disabled={isRoomFull}>
            <View style={styles.joinIconRight}>
              <Icon
                source="account-plus"
                size={24}
                color={
                  isRoomFull ? theme.colors.secondary : theme.colors.primary
                }
              />
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <FlatList
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}
      data={roomData?.rooms || []}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={
        <View style={styles.joinContainer}>
          <View style={styles.joinIcon}>
            <Icon
              source="account-group"
              size={80}
              color={theme.colors.primary}
            />
          </View>
          <Text variant="titleLarge" style={styles.joinTitle}>
            Join a Room
          </Text>
          <Text variant="bodyMedium" style={styles.joinSubtitle}>
            Connect with users nearby to collaborate
          </Text>

          <Button
            mode="contained"
            onPress={handleRequestRoom}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            loading={isPending}
            icon="account-plus">
            Join Room
          </Button>

          <Text variant="titleMedium" style={styles.roomTitle}>
            {!roomData?.rooms
              ? 'No rooms found near your location'
              : 'Available Rooms'}
          </Text>
        </View>
      }
      renderItem={renderRoomItem}
      refreshing={false}
      onRefresh={refetchRooms}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    gap: 20,
  },
  joinContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
  },
  joinIcon: {
    marginBottom: 16,
  },
  joinTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  roomTitle: {
    marginTop: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  joinSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    width: '100%',
  },
  buttonLabel: {
    fontSize: 16,
  },
  joinIconRight: {
    marginTop: 10,
  },
});

export default RoomScreen;
