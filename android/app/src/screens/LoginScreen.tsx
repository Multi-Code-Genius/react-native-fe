import React, { useState } from 'react';
import { View, TextInput, Text, Alert, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import { useUserLogin } from '../api/auth/auth';
import { useAuthStore } from '../store/authStore';
import { StackScreenProps } from '@react-navigation/stack';
import { Icon } from 'react-native-paper';
import { Dimensions } from 'react-native';

type Props = StackScreenProps<any, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState({ email: '', password: '' });
  const { mutate: login, isPending } = useUserLogin();
  const saveToken = useAuthStore(state => state.saveToken);

  const handleChange = (key: keyof typeof data, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const screenHeight = Dimensions.get('window').height;


  const handleLogin = () => {
    if (!data.email || !data.password) {
      Alert.alert('Error', 'Both fields are required');
      return;
    }

    login(data, {
      onSuccess: async ({ token }) => {
        if (!token) {
          Alert.alert('Error', 'No token received.');
          return;
        }
        await saveToken(token);
      },
      onError: (error: any) => {
        Alert.alert('Login Failed', error?.message || 'Something went wrong');
      },
    });
  };
  return (
    <Onboarding
      showDone
      showSkip={false}
      onDone={handleLogin}
      pages={[
        {
          backgroundColor: '#000',
          image: <View />,
          title: '',
          subtitle: (
            <View style={[styles.container, { position: 'relative' }]}>
              <View className="flex gap-[50px]">
                <Text style={styles.question}>Log In</Text>
                <View className='flex flex-col gap-7'>
                  <View className='flex flex-col gap-4'>
                    <Text className='text-white'>Email Address</Text>
                    <TextInput
                      placeholder="Enter your Email Address"
                      placeholderTextColor="#666"
                      style={styles.input}
                      value={data.email}
                      maxLength={30}
                      onChangeText={text => setData({ ...data, email: text })}
                    />
                  </View>
                  <View className='flex flex-col gap-4'>
                    <Text className='text-white'>Password</Text>
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor="#666"
                      style={styles.input}
                      secureTextEntry
                      value={data.password}
                      onChangeText={text => setData({ ...data, password: text })}
                    />
                  </View>
                </View>
                <View className='flex flex-col gap-5'>
                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={isPending}
                    style={[
                      styles.loginButton,
                      isPending && { opacity: 0.5 },
                    ]}
                  >
                    {isPending ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.loginButtonText}>Login</Text>
                    )}
                  </TouchableOpacity>
                  <Text style={styles.signupText}>
                    Don’t have an account?{' '}
                    <Text
                      style={styles.signupLink}
                      onPress={() => (navigation as any).navigate('SignUp')}>
                      Sign Up
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          ),
        }
      ]}
    />
  );

};

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    gap: 80,
    justifyContent: 'flex-start',
    backgroundColor: '#000',
    width: '100%'
  },
  question: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  charCount: {
    color: '#888',
    fontSize: 12,
  },
  arrowButton: {
    backgroundColor: '#1f1f1f',
    padding: 12,
    borderRadius: 999,
  },
  signupText: {
    textAlign: 'center',
    color: '#fff8f8',
  },
  signupLink: {
    color: '#e3e7e9',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
