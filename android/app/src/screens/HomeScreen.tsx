import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRequestRoom, useUserInfo} from '../api/user/user';
import {useUserStore} from '../store/userStore';
import {ActivityIndicator} from 'react-native-paper';

const HomeScreen = () => {
  const {data} = useUserInfo();
  const {mutate, isPending} = useRequestRoom();
  const {loadUserData, setUserData} = useUserStore();

  useEffect(() => {
    setUserData(data?.user);
    loadUserData();
  }, []);

  const handlerPress = () => {
    let payload = {
      latitude: 19.076,
      longitude: 72.8777,
      platform: 'platform Name',
    };
    mutate(payload);
  };

  return (
    <SafeAreaView className=" flex-1 bg-white">
      <View className="flex justify-center items-center h-full w-full">
        <TouchableOpacity onPress={handlerPress} className="text-red-700 ">
          {isPending ? (
            <ActivityIndicator size="large" color="#52aafc" />
          ) : (
            <Text className="bg-blue-500 w-full p-4 rounded-md text-white">
              Request For Room
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
