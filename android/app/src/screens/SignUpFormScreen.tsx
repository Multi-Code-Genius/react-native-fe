import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Text, TextInput, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialIcons';

export function SignUpFormScreen() {
  return (
    <View className="flex p-8 justify-center items-center h-full w-full gap-16">
      <View className="flex-row gap-5 items-center">
        <Ionicons name={'person'} size={35} color={'black'} />
      </View>
      <View className=" w-full gap-5">
        <View className=" gap-3">
          <Text className="text-black font-semibold text-[17px]">
            User Name
          </Text>
          <TextInput
            className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-100 text-black"
            placeholder="Enter your user name"
            placeholderTextColor="#999"
          />
        </View>
        <View className=" gap-3">
          <Text className="text-black font-semibold text-[17px]">
            Your email address
          </Text>
          <TextInput
            className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-100 text-black"
            placeholder="Enter your email"
            placeholderTextColor="#999"
          />
        </View>
        <View className="w-full gap-3">
          <Text className="text-black font-semibold text-[17px]">
            Choose a password
          </Text>
          <TextInput
            className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-gray-100 text-black"
            placeholder="min, 8 characters"
            placeholderTextColor="#999"
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          className={`w-full h-12 rounded-lg flex justify-center mt-5 items-center bg-slate-600`}
          activeOpacity={0.7}
          onPress={() => console.log('Button Pressed')}>
          <Text className="text-white text-[18px] font-semibold">SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
