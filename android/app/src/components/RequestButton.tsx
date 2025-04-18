import React from 'react';
import {Button, useTheme} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useDeclineRequest} from '../api/request/request';

interface Props {
  id: string;
  currentUserId: string;
  onRequest: (id: string) => void;
  suggestedUser: {
    id: string;
    name: string;
    email: string;
    profile_pic: string | null;
    isOnline: boolean;
    lastSeen: string | null;
    sentRequests: [
      {receiverId?: string; senderId?: string; status: string; id: string},
    ];
    receivedRequests: [
      {receiverId?: string; senderId?: string; status: string; id: string},
    ];
  };
}

const RequestButton: React.FC<Props> = ({
  id,
  currentUserId,
  suggestedUser,
  onRequest,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const {mutate: declineMutate} = useDeclineRequest();

  const isAlreadySent = suggestedUser.receivedRequests.filter(i => {
    return i.senderId === currentUserId && i.status === 'pending';
  });

  const acceptedRequest = suggestedUser.receivedRequests.filter(i => {
    return i.senderId === currentUserId && i.status === 'accepted';
  });

  const isFollowing = suggestedUser.sentRequests.filter(i => {
    return i.receiverId === currentUserId && i.status === 'accepted';
  });

  const bothFollow = suggestedUser.sentRequests.filter(i => {
    return i.senderId === currentUserId && i.status === 'accepted';
  });

  console.log('user', bothFollow);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 4,
          gap: 6,
        },
      ]}>
      {isAlreadySent.length > 0 ? (
        <>
          <Button
            className=""
            mode="contained"
            onPress={() => declineMutate(isAlreadySent[0].id)}
            contentStyle={{paddingHorizontal: 6, paddingVertical: 0}}
            labelStyle={{fontSize: 14, textTransform: 'none'}}
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 20,
            }}>
            Requested
          </Button>
        </>
      ) : acceptedRequest.length > 0 ? (
        <Button
          mode="contained"
          compact
          onPress={() => declineMutate(acceptedRequest[0].id)}
          contentStyle={{paddingHorizontal: 6, paddingVertical: 0}}
          labelStyle={{fontSize: 14, textTransform: 'none'}}
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: 20,
          }}>
          Following
        </Button>
      ) : isFollowing.length > 0 ? (
        <>
          <Button
            mode="contained"
            compact
            onPress={() => onRequest(id)}
            contentStyle={{paddingHorizontal: 6, paddingVertical: 0}}
            labelStyle={{fontSize: 14, textTransform: 'none'}}
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 20,
            }}>
            Follow Back
          </Button>
        </>
      ) : (
        <>
          <Button
            mode="contained"
            compact
            onPress={() => onRequest(id)}
            contentStyle={{paddingHorizontal: 6, paddingVertical: 0}}
            labelStyle={{fontSize: 14, textTransform: 'none'}}
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 20,
            }}>
            Follow
          </Button>
        </>
      )}
    </Animated.View>
  );
};

export default RequestButton;
