import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Chip,
  DataTable,
  List,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute} from '@react-navigation/native';
import RoomTable from './a';
import {
  getRoomById,
  useJoinRoom,
  useRejectRoom,
  useRequestRoom,
} from '../api/room/room';
import {useGetRooms} from '../api/room/room';

const RoomScreen = () => {
  const {data, isPending, mutate} = useRequestRoom();
  const route = useRoute();
  const {isInRoom} = route.params;
  const {mutate: rejectRoom, isPending: rejectingRoom} = useRejectRoom();

  const {data: Alldata} = useGetRooms();

  const {mutate: joinRoomById} = useJoinRoom();

  // const {data : roomByIdData} = getRoomById()
  console.log('Alldata', Alldata);

  const theme = useTheme();

  const handleOnPress = () => {
    mutate({
      latitude: 21.1702,
      longitude: 72.8311,
      platform: 'Android',
    });
  };

  const handleOnRoomId = (roomId: number) => {
    console.log('roomId=====', roomId);
    joinRoomById(roomId.toString(), {
      onSuccess: () => {
        setIsLeft(false);
      },
    });
  };

  const handleLeaveRoom = (roomId: number) => {
    rejectRoom(roomId, {});
  };

  console.log(data);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      {isInRoom ? (
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

          {Alldata?.room?.map((room, index) => (
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
      ) : (
        <RoomTable />
        // <>
        //   <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        //     <Card.Title
        //       title={`Room Details`}
        //       titleVariant="titleLarge"
        //       left={props => (
        //         <Icon
        //           {...props}
        //           name="door-open"
        //           size={24}
        //           color={theme.colors.primary}
        //         />
        //       )}
        //     />
        //     <Card.Content>
        //       <View style={styles.detailRow}>
        //         <Icon
        //           name="home-group"
        //           size={20}
        //           color={theme.colors.onSurface}
        //         />
        //         <Text variant="bodyMedium" style={styles.detailText}>
        //           Platform: {data.room.platform}
        //         </Text>
        //       </View>

        //       <View style={styles.detailRow}>
        //         <Icon
        //           name="account-multiple"
        //           size={20}
        //           color={theme.colors.onSurface}
        //         />
        //         <Text variant="bodyMedium" style={styles.detailText}>
        //           Users: {data.room.RoomUser?.length} / {data.room.capacity}
        //         </Text>
        //       </View>

        //       <View style={styles.statusContainer}>
        //         <Chip
        //           mode="outlined"
        //           icon={
        //             data.room.status === 'open'
        //               ? 'check-circle-outline'
        //               : data.room.status === 'full'
        //               ? 'account-alert'
        //               : 'close-circle-outline'
        //           }
        //           textStyle={{
        //             color:
        //               data.room.status === 'open'
        //                 ? theme.colors.primary
        //                 : theme.colors.error,
        //           }}>
        //           {data.room.status}
        //         </Chip>
        //         <Button
        //           labelStyle={{color: theme.colors.error}}
        //           icon="logout"
        //           loading={rejectingRoom}
        //           onPress={() => handleLeaveRoom(data.room.id)}>
        //           Leave Room
        //         </Button>
        //       </View>
        //     </Card.Content>
        //   </Card>

        //   {data?.room?.RoomUser?.length > 0 && (
        //     <Card
        //       style={[
        //         styles.tableCard,
        //         {backgroundColor: theme.colors.surface},
        //       ]}>
        //       <Card.Title
        //         title="Participants"
        //         titleVariant="titleLarge"
        //         left={props => (
        //           <Icon
        //             {...props}
        //             name="account-group"
        //             size={24}
        //             color={theme.colors.primary}
        //           />
        //         )}
        //       />

        //       <DataTable>
        //         <DataTable.Header>
        //           <DataTable.Title style={styles.tableHeader}>
        //             Profile
        //           </DataTable.Title>
        //           <DataTable.Title style={styles.tableHeader}>
        //             Name
        //           </DataTable.Title>
        //           <DataTable.Title style={styles.tableHeader}>
        //             Email
        //           </DataTable.Title>
        //         </DataTable.Header>

        //         {data.room.RoomUser.map((user, index) => (
        //           <React.Fragment key={user.id}>
        //             <DataTable.Row style={{padding: 10}}>
        //               <DataTable.Cell>
        //                 <View style={styles.avatarContainer}>
        //                   {user.User.profile_pic ? (
        //                     <Avatar.Image
        //                       size={40}
        //                       source={
        //                         typeof user.User.profile_pic === 'string' && {
        //                           uri: user.User.profile_pic,
        //                         }
        //                       }
        //                     />
        //                   ) : (
        //                     <Avatar.Text
        //                       size={24}
        //                       label={user.User.name.slice(0, 2)}
        //                     />
        //                   )}

        //                   {index === 0 && (
        //                     <Icon
        //                       name="crown"
        //                       size={16}
        //                       color={theme.colors.primary}
        //                       style={styles.crownIcon}
        //                     />
        //                   )}
        //                 </View>
        //               </DataTable.Cell>
        //               <DataTable.Cell>
        //                 <Text variant="bodyMedium" style={styles.userName}>
        //                   {user.User.name}
        //                 </Text>
        //               </DataTable.Cell>
        //               <DataTable.Cell>
        //                 <Text variant="bodyMedium" style={styles.userEmail}>
        //                   {user.User.email}
        //                 </Text>
        //               </DataTable.Cell>
        //             </DataTable.Row>
        //           </React.Fragment>
        //         ))}
        //       </DataTable>
        //     </Card>
        //   )}
        // </>
      )}
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
  leaveButton: {
    borderRadius: 8,
    borderColor: '#ff4444',
    marginTop: 8,
  },
  card: {
    borderRadius: 12,
    padding: 8,
    elevation: 2,
  },
  tableCard: {
    borderRadius: 12,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    flex: 1,
  },
  statusContainer: {
    marginTop: 16,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableHeader: {
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  crownIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 2,
  },
  userName: {
    fontWeight: '500',
  },
  userEmail: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default RoomScreen;
