import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Text, TextInput, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import {useUserSignup} from '../api/auth/auth';
import {useNavigation} from '@react-navigation/native';
import {useAuthStore} from '../store/authStore';

export function SignUpFormScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState({name: '', email: '', password: ''});
  const {mutate: signup} = useUserSignup();
  const saveToken = useAuthStore(state => state.saveToken);
  const handleChange = (field: keyof typeof data, value: string) => {
    setData(prev => ({...prev, [field]: value}));
  };

  const handleSignup = async () => {
    const {name, email, password} = data;

    if (!name || !email || !password) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }
    signup(data, {
      onSuccess: async ({token}) => {
        if (!token) {
          Alert.alert('Error', 'No token received.');
          return;
        }
        await saveToken(token);
      },
      onError: () => {
        Alert.alert('Error', 'Signup failed. Please try again.');
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white justify-center px-8">
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
      <View className="absolute bottom-6 left-0 right-0 items-center border-t border-gray-300 pt-4">
        <TouchableOpacity onPress={() => (navigation as any).navigate('Login')}>
          <Text className="text-slate-600 text-lg">
            Already have an account?{' '}
            <Text className="text-[#007BFF] font-bold">Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
