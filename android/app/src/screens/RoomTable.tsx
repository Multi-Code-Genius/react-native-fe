import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Chip,
  DataTable,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useGetRoomById, useRejectRoom} from '../api/room/room';
import {useUserListLogic} from '../hooks/useUserListLogic';

const RoomTable = () => {
  const {mutate: rejectRoom, isPending: rejectingRoom} = useRejectRoom();
  const theme = useTheme();

  const {data: user, profileLoading, profileRefetch} = useUserListLogic();
  const roomId = user?.user?.RoomUser?.[0]?.roomId;
  const {data, isLoading, refetch: refetchRoom} = useGetRoomById(roomId);

  const handleLeaveRoom = (roomId: string) => {
    rejectRoom(roomId, {
      onSuccess: () => {
        refetchRoom();
        profileRefetch();
      },
    });
  };

  useEffect(() => {
    if (!profileLoading && roomId) {
      refetchRoom();
    }
  }, [roomId, profileLoading, refetchRoom]);

  if (!roomId) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (isLoading || profileLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Title
          title="Room Details"
          titleVariant="titleLarge"
          left={props => (
            <Icon
              {...props}
              name="door-open"
              size={24}
              color={theme.colors.primary}
            />
          )}
        />
        <Card.Content>
          <View style={styles.detailRow}>
            <Icon name="home-group" size={20} color={theme.colors.onSurface} />
            <Text variant="bodyMedium" style={styles.detailText}>
              Platform: {data?.room?.platform ?? 'N/A'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon
              name="account-multiple"
              size={20}
              color={theme.colors.onSurface}
            />
            <Text variant="bodyMedium" style={styles.detailText}>
              Users: {data?.room?.RoomUser?.length ?? 0} /{' '}
              {data?.room?.capacity ?? 0}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <Chip
              mode="outlined"
              icon={
                data?.room?.status === 'open'
                  ? 'check-circle-outline'
                  : data?.room?.status === 'full'
                  ? 'account-alert'
                  : 'close-circle-outline'
              }
              textStyle={{
                color:
                  data?.room?.status === 'open'
                    ? theme.colors.primary
                    : theme.colors.error,
              }}>
              {data?.room?.status}
            </Chip>

            <Button
              labelStyle={{color: theme.colors.error}}
              icon="logout"
              loading={rejectingRoom || profileLoading}
              onPress={() => data?.room?.id && handleLeaveRoom(data.room.id)}>
              Leave Room
            </Button>
          </View>
        </Card.Content>
      </Card>

      {data?.room?.RoomUser?.length > 0 && (
        <Card
          style={[styles.tableCard, {backgroundColor: theme.colors.surface}]}>
          <Card.Title
            title="Participants"
            titleVariant="titleLarge"
            left={props => (
              <Icon
                {...props}
                name="account-group"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />

          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={styles.tableHeader}>
                Profile
              </DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Name</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>
                Email
              </DataTable.Title>
            </DataTable.Header>

            {data.room.RoomUser.map((roomUser: any, index: number) => (
              <DataTable.Row key={roomUser.id} style={{paddingVertical: 8}}>
                <DataTable.Cell>
                  <View style={styles.avatarContainer}>
                    {roomUser.User.profile_pic ? (
                      <Avatar.Image
                        size={40}
                        source={{uri: roomUser.User.profile_pic}}
                      />
                    ) : (
                      <Avatar.Text
                        size={40}
                        label={roomUser.User.name.slice(0, 2).toUpperCase()}
                      />
                    )}
                    {index === 0 && (
                      <Icon
                        name="crown"
                        size={16}
                        color={theme.colors.primary}
                        style={styles.crownIcon}
                      />
                    )}
                  </View>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text variant="bodyMedium" style={styles.userName}>
                    {roomUser.User.name}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text variant="bodyMedium" style={styles.userEmail}>
                    {roomUser.User.email}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card>
      )}
    </ScrollView>
  );
};

export default RoomTable;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    gap: 20,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    bottom: -4,
    right: -4,
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
