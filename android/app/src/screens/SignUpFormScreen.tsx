import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import { useUserSignup } from '../api/auth/auth';
import { useNavigation } from '@react-navigation/native';

export function SignUpFormScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const { mutate: signup } = useUserSignup();
  const handleChange = (field: keyof typeof data, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = () => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }
    signup(data);
  };

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
            value={data.name}
            onChangeText={text => handleChange('name', text)}
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
            value={data.email}
            onChangeText={text => handleChange('email', text)}
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
            value={data.password}
            onChangeText={text => handleChange('password', text)}
          />
        </View>
        <TouchableOpacity
          className="w-full h-12 rounded-lg flex justify-center mt-5 items-center bg-slate-600"
          activeOpacity={0.7}
          onPress={handleSignup}>
          <Text className="text-white text-[18px] font-semibold">SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
