import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Searchbar, useTheme} from 'react-native-paper';
import {useUserStore} from '../store/userStore';
import {useUserInfo} from '../api/user/user';

export function FreindsListScreen() {
  const {data} = useUserInfo();
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  const acceptedRequests = data?.user?.acceptedRequests;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-4">
        <Text className="text-center text-base text-gray-400 font-semibold">
          {data?.user?.name}
        </Text>
        <Text className="text-center text-xl text-white font-bold">
          FRIENDS
        </Text>
        <View className=" h-[1px] bg-gray-300 w-full mt-2" />
      </View>

      <Searchbar
        placeholder="Search"
        placeholderTextColor="#666"
        onChangeText={setSearchQuery}
        value={searchQuery}
        inputStyle={{color: 'white'}}
        style={{
          backgroundColor: '#1a1a1a',
          marginHorizontal: 16,
          marginBottom: 12,
        }}
        iconColor="white"
      />

      <FlatList
        data={acceptedRequests}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingHorizontal: 16}}
        renderItem={({item}) => (
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-4">
              {item.sender.profile_pic ? (
                <View style={{position: 'relative'}}>
                  <Image
                    source={{uri: item.sender.profile_pic}}
                    className="w-12 h-12 rounded-full "
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View style={{position: 'relative'}}>
                  <Avatar.Text
                    style={{backgroundColor: theme.colors.secondary}}
                    size={42}
                    label={item.sender?.name?.slice(0, 2).toUpperCase() ?? ''}
                  />
                </View>
              )}

              <Text className="text-white text-md font-medium">
                {item.sender.name}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
