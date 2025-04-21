import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import {useUserListLogic} from '../hooks/useUserListLogic';
import {IconButton, Text, useTheme} from 'react-native-paper';
import UserCard from '../components/UserCard';
import {useNavigation} from '@react-navigation/native';

const ChatList = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    data,
    users,
    isLoading,
    refreshing,
    onRefresh,
    refetch,
    profileRefetch,
  } = useUserListLogic();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: 10,
    },
  });

  const handleNavigation = id => {
    navigation.navigate('ChatScreen', {userId: id});
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
                isChatting={true}
                onPress={() => handleNavigation(item.id)}
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
