import React from 'react';
import { View } from 'react-native';
import { Card, Text, Avatar, Badge, useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
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
  isChatting?: boolean;
  onPress?: any;
  messageCount?: number;
}

const UserCard: React.FC<Props> = ({
  user,
  onRequest,
  isChatting,
  onPress,
  messageCount,
}) => {
  const theme = useTheme();
  const avatarSource = user.profile_pic ? { uri: user.profile_pic } : undefined;

  return (
    <Animated.View entering={FadeInUp.duration(300)}>
      <Card
        onPress={isChatting && onPress}
        mode="contained"
        style={{
          backgroundColor: 'transparent',
          borderRadius: 12,
          marginVertical: 1,
        }}>
        <Card.Content
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  position: 'relative',
                }}>
                {avatarSource ? (
                  <Avatar.Image size={48} source={avatarSource} />
                ) : (
                  <Avatar.Text
                    style={{ backgroundColor: theme.colors.secondary }}
                    size={48}
                    label={user.name ? user.name.slice(0, 2).toUpperCase() : '??'}
                  />
                )}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                  }}>
                  <Badge
                    size={12}
                    style={{
                      backgroundColor: user.isOnline
                        ? theme.colors.primary
                        : theme.colors.error,
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onPrimary }}>
                {user.name}
              </Text>
              {!isChatting && (
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.secondary }}>
                  {user.email}
                </Text>
              )}
              {!user.isOnline && user.lastSeen && (
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.secondary }}>
                  Last seen: {moment(user.lastSeen).fromNow()}
                </Text>
              )}
            </View>
          </View>

          {isChatting ? (
            <View>
              {messageCount && messageCount > 0 && (
                <Badge style={{ backgroundColor: theme.colors.primary }}>
                  {messageCount}
                </Badge>
              )}
            </View>
          ) : (
            <View>
              <RequestButton id={user.id} onRequest={onRequest} />
            </View>
          )}
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

export default UserCard;
