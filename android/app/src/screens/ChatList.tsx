import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import {useUserListLogic} from '../hooks/useUserListLogic';
import UserCard from '../components/UserCard';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';

const ChatList = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {data, onRefresh, refreshing, profileRefetch} = useUserListLogic();
  const isFocused = useIsFocused();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
  });

  useFocusEffect(
    useCallback(() => {
      profileRefetch();
    }, [profileRefetch, isFocused]),
  );

  const messagesReceived = data?.user?.messagesReceived || [];

  const messageMap = messagesReceived.reduce(
    (acc: Record<string, any[]>, msg: any) => {
      if (!acc[msg.senderId]) {
        acc[msg.senderId] = [];
      }
      acc[msg.senderId].push(msg);
      return acc;
    },
    {},
  );

  const handleNavigation = (id: string, profile_pic: string, name: string) => {
    (navigation as any).navigate('ChatScreen', {
      receiverId: id,
      profile_pic,
      name,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.user?.friends || []}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const messageCount = messageMap[item.id]?.length || 0;

          return (
            <View style={{flex: 1}}>
              <UserCard
                user={item}
                onRequest={() => {}}
                isChatting={true}
                onPress={() =>
                  handleNavigation(item.id, item.profile_pic, item.name)
                }
                messageCount={messageCount}
              />
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatList;
