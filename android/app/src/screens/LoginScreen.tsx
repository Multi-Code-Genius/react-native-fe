import React, {useState} from 'react';
import {View, Text, TextInput, Button, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialIcons';

import {StackScreenProps} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

type Props = StackScreenProps<any, 'Login'>;

const LoginScreen: React.FC<Props> = () => {
  const navigation = useNavigation();

  const [isPressed, setIsPressed] = useState(false);

  return (
    <View className="flex p-8 justify-center items-center h-full w-full gap-16">
      <View className="flex-row gap-5 items-center">
        <Ionicons name={'person'} size={35} color={'black'} />
        <Text className=" font-bold text-[20px]">Login</Text>
      </View>
      <View className=" w-full gap-5">
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
          className={`w-full h-12 rounded-lg flex justify-center mt-5 items-center ${
            isPressed ? 'bg-green-200' : 'bg-green-800'
          }`}
          activeOpacity={0.7}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}>
          <Text className="text-white text-[18px] font-semibold">Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-end"
          onPress={() => (navigation as any).navigate('SignUp')}>
          <Text className="text-slate-600 text-lg">
            Don't have an account?{' '}
            <Text className="text-[#007BFF] font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
