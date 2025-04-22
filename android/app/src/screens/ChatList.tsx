import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {useUserListLogic} from '../hooks/useUserListLogic';
import UserCard from '../components/UserCard';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';

const ChatList = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {data} = useUserListLogic();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 10,
    },
  });

  const messagesReceived = data?.user?.messagesReceived;

  const groupedBySender = Object.values(
    messagesReceived.reduce((acc: any, msg: any) => {
      if (!acc[msg.senderId]) {
        acc[msg.senderId] = [];
      }
      acc[msg.senderId].push(msg);
      return acc;
    }, {}),
  );

  console.log('groupedBySender', groupedBySender);

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
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flex: 1,
              }}>
              <UserCard
                user={item}
                onRequest={() => {}}
                isChatting={true}
                onPress={() =>
                  handleNavigation(item.id, item.profile_pic, item.name)
                }
              />
            </View>
          );
        }}
        contentContainerStyle={{paddingVertical: 10}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatList;
