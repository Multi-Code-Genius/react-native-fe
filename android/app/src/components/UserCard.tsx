import React from 'react';
import {View} from 'react-native';
import {Card, Text, Avatar, Badge, useTheme} from 'react-native-paper';
import Animated, {FadeInUp} from 'react-native-reanimated';
import RequestButton from './RequestButton';
import moment from 'moment';

type User = {
  id: string;
  name: string;
  email: string;
  profile_pic: string | null;
  isOnline: boolean;
  lastSeen: string | null;
};

interface Props {
  user: User;
  onRequest: (id: string) => void;
}

const UserCard: React.FC<Props> = ({user, onRequest}) => {
  const theme = useTheme();
  const avatarSource = user.profile_pic ? {uri: user.profile_pic} : undefined;

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      style={{marginVertical: 8}}>
      <Card
        mode="elevated"
        style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 12,
          marginVertical: 8,
        }}>
        <Card.Content
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {/* Left side: Avatar + info */}{' '}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              flex: 1,
            }}>
            <View style={{position: 'relative'}}>
              {avatarSource ? (
                <Avatar.Image size={48} source={avatarSource} />
              ) : (
                <Avatar.Text
                  style={{backgroundColor: theme.colors.secondary}}
                  size={48}
                  label={user.name.slice(0, 2).toUpperCase()}
                />
              )}
              <Badge
                size={16}
                style={{
                  backgroundColor: user.isOnline
                    ? theme.colors.primary
                    : theme.colors.error,
                  position: 'absolute',
                  bottom: 0,
                  right: -4,
                }}
              />
            </View>

            <View style={{flex: 1}}>
              <Text
                variant="titleMedium"
                style={{color: theme.colors.onPrimary}}>
                {user.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{color: theme.colors.secondary}}>
                {user.email}
              </Text>
              {!user.isOnline && (
                <Text
                  variant="bodySmall"
                  style={{color: theme.colors.secondary}}>
                  Last seen: {moment(user.lastSeen).fromNow()}
                </Text>
              )}
            </View>
          </View>
          <View>
            <RequestButton id={user.id} onRequest={onRequest} />
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

export default UserCard;
