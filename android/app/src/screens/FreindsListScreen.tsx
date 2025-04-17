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
import {Searchbar} from 'react-native-paper';
import {useUserStore} from '../store/userStore';
import {useUserInfo} from '../api/user/user';

export function FreindsListScreen() {
  const {data} = useUserInfo();
  console.log('data=====>>>>>', data);

  const [searchQuery, setSearchQuery] = useState('');

  console.log('data?.users?.acceptedRequests', data?.user?.acceptedRequests);
  const acceptedRequests = data?.user?.acceptedRequest;

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
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center py-3 border-b border-gray-800">
            <View className="w-[50px] h-[50px] rounded-full overflow-hidden mr-4">
              <Image
                source={{uri: item.sender.profile_pic}}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-white text-[16px] font-semibold">
              {item.sender.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
