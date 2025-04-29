import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import RoomScreen from './RoomScreen';
import RoomTable from './RoomTable';
import {useUserListLogic} from '../hooks/useUserListLogic';

const RoomWrapper = () => {
  const {data: userData, profileLoading, profileRefetch} = useUserListLogic();
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    profileRefetch();
  }, [profileRefetch, isUpdate]);

  if (profileLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const userRoomId = userData?.user?.RoomUser?.[0]?.roomId;

  if (userRoomId) {
    return <RoomTable />;
  }

  return <RoomScreen setIsUpdate={setIsUpdate} />;
};

export default RoomWrapper;
