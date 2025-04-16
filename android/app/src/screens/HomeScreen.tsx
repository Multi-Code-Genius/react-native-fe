import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUserInfo} from '../api/user/user';
import {useUserStore} from '../store/userStore';
import {useAuthStore} from '../store/authStore';
import {connectSocket} from '../config/socket';

const HomeScreen = () => {
  const {data} = useUserInfo();
  const {loadUserData, setUserData} = useUserStore();
  const {token} = useAuthStore();

  useEffect(() => {
    setUserData(data?.user);
    loadUserData();
    connectSocket(token ?? '');
  }, []);

  const handlerPress = () => {};

  return (
    <SafeAreaView className=" flex-1 bg-white">
      <View className="flex justify-center items-center h-full w-full">
        <TouchableOpacity onPress={handlerPress} className="text-red-700 ">
          <Text className="bg-blue-500 w-full p-4 rounded-md text-white">
            Active
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
