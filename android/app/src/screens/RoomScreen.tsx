import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, List, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useGetRooms, useJoinRoom, useRequestRoom} from '../api/room/room';
import RoomTable from './a';

import {useUserListLogic} from '../hooks/useUserListLogic';

const RoomScreen = () => {
  const {data: Alldata} = useGetRooms();
  const {mutate: joinRoomById} = useJoinRoom();
  const {isPending, isSuccess, mutate} = useRequestRoom();
  const {data: user, profileRefetch, profileLoading} = useUserListLogic();
  const theme = useTheme();

  const handleOnPress = () => {
    mutate({
      latitude: 21.1702,
      longitude: 72.8311,
      platform: 'Android',
    });
  };

  const handleOnRoomId = (roomId: number) => {
    joinRoomById(roomId.toString(), {
      onSuccess: () => {
        return <RoomTable />;
      },
    });
  };

  useEffect(() => {
    !profileLoading && profileRefetch();
  }, [isSuccess, profileRefetch, profileLoading]);

  if (user?.user?.RoomUser[0]?.roomId) {
    console.log('trigger');
    return <RoomTable />;
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      <View style={styles.joinContainer}>
        <Icon
          name="account-group"
          size={80}
          color={theme.colors.primary}
          style={styles.joinIcon}
        />
        <Text variant="titleLarge" style={styles.joinTitle}>
          Join a Room
        </Text>
        <Text variant="bodyMedium" style={styles.joinSubtitle}>
          Connect with other users nearby to start collaborating
        </Text>
        <Button
          mode="contained"
          onPress={handleOnPress}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          loading={isPending}
          icon="account-plus">
          Find a Room
        </Button>
        <Text variant="titleMedium" style={styles.joinTitle}>
          Room Details
        </Text>

        {Alldata?.room?.map((room: any, index: number) => (
          <List.Item
            key={room.id}
            title={`Room ${index + 1}`}
            description={() => (
              <Text
                style={{
                  color:
                    room.status === 'full'
                      ? theme.colors.error
                      : theme.colors.primary,
                }}>
                {room.status === 'full' ? 'Full' : 'Open'}
              </Text>
            )}
            left={props =>
              room.status === 'open' ? (
                <Icon
                  {...props}
                  name="door-open"
                  size={24}
                  color={theme.colors.primary}
                />
              ) : (
                <Icon
                  {...props}
                  name="door-closed"
                  size={24}
                  color={theme.colors.primary}
                />
              )
            }
            right={props => (
              <TouchableOpacity onPress={() => handleOnRoomId(room.id)}>
                <Icon
                  name="account-plus"
                  size={24}
                  color={
                    room.status === 'full'
                      ? theme.colors.secondary
                      : theme.colors.primary
                  }
                  style={{marginTop: 10}}
                />
              </TouchableOpacity>
            )}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  joinIcon: {
    marginBottom: 16,
  },
  joinTitle: {
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
});

export default RoomScreen;
