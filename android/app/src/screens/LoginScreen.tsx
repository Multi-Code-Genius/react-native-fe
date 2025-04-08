import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import {StackScreenProps} from '@react-navigation/stack';
import {useUserLogin} from '../api/auth/auth';
import {useAuthStore} from '../store/authStore';
import GoogleSignin from '../config/google';

type Props = StackScreenProps<any, 'Login'>;

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [data, setData] = useState({email: '', password: ''});
  const {mutate: login} = useUserLogin();
  const saveToken = useAuthStore(state => state.saveToken);

  const handleChange = (field: keyof typeof data, value: string) => {
    setData(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = async () => {
    if (!data.email || !data.password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    login(data, {
      onSuccess: async ({token}) => {
        if (!token) {
          Alert.alert('Error', 'No token received.');
          return;
        }
        await saveToken(token);
      },
      onError: () => {
        Alert.alert('Error', 'Login failed. Please try again.');
      },
    });
  };

  const handleResetPassword = () => {
    navigation.navigate('ResetPassword1');
  };

  // const signInWithGoogle = async () => {
  //   try {
  //     // await GoogleSignin.hasPlayServices();
  //     // const userInfo = await GoogleSignin.signIn();
  //     // console.log('userInfo', userInfo);
  //     // const {idToken} = userInfo;

  // //     return data;
  // //   } catch (error) {
  // //     console.error(error);
  // //     throw error;
  // //   }
  // // };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white justify-center px-8">
      <View className="flex-1 justify-center items-center gap-16">
        <View className="flex-row gap-3 items-center justify-center w-full">
          <Ionicons name={'person'} size={35} color={'black'} />
          <Text className="font-bold text-4xl text-black">Login</Text>
        </View>
        <View className="w-full gap-5">
          <View className="gap-3">
            <Text className="text-black font-semibold text-[17px]">
              Your email address
            </Text>
            <TextInput
              value={data.email}
              onChangeText={text => handleChange('email', text)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg text-black"
              placeholder="Enter your email"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          <View className="gap-3">
            <Text className="text-black font-semibold text-[17px]">
              Choose a password
            </Text>
            <TextInput
              value={data.password}
              onChangeText={text => handleChange('password', text)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg text-black"
              placeholder="min, 8 characters"
              placeholderTextColor="#999"
              autoCapitalize="words"
              secureTextEntry={true}
            />
          </View>
          <Text>
            Forget Password?{' '}
            <Text
              style={{textDecorationLine: 'underline', color: 'blue'}}
              onPress={() => handleResetPassword()}>
              Reset password
            </Text>
          </Text>
          <TouchableOpacity
            className={`w-full h-12 rounded-lg flex justify-center mt-5 items-center ${
              isPressed ? 'bg-blue-500' : 'bg-blue-600'
            }`}
            activeOpacity={0.7}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handleSubmit}>
            <Text className="text-white text-[18px] font-semibold">LogIn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-full h-12 rounded-lg flex justify-center mt-5 items-center ${
              isPressed ? 'bg-blue-500' : 'bg-blue-600'
            }`}
            activeOpacity={0.7}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            // onPress={signInWithGoogle}
          >
            <Text className="text-white text-[18px] font-semibold">
              Google Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="absolute bottom-6 left-0 right-0 items-center border-t border-gray-300 pt-4">
        <TouchableOpacity
          onPress={() => (navigation as any).navigate('SignUp')}>
          <Text className="text-slate-600 text-lg">
            Don't have an account?{' '}
            <Text className="text-[#007BFF] font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
