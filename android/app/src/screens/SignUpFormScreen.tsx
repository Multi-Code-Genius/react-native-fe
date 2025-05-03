import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import { useUserSignup } from '../api/auth/auth';
import { useAuthStore } from '../store/authStore';
import { ActivityIndicator } from 'react-native-paper';

export function SignUpFormScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const { mutate: signup, isPending } = useUserSignup();
  const saveToken = useAuthStore(state => state.saveToken);

  const handleChange = (key: keyof typeof data, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSignup = () => {
    const { name, email, password } = data;
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    signup(data, {
      onSuccess: async ({ token }) => {
        if (!token) {
          Alert.alert('Error', 'No token received.');
          return;
        }
        await saveToken(token);
      },
      onError: () => {
        Alert.alert('Error', 'Signup failed.');
      },
    });
  };

  return (
    <Onboarding
      showDone={true}
      showSkip={false}
      onDone={handleSignup}
      pages={[
        {
          backgroundColor: '#000',
          image: <View />,
          title: '',
          subtitle: (
            <View style={[styles.container, { position: 'relative' }]}>
              <View className="flex gap-[80px]">
                <Text style={styles.question}>What’s your Full Name?</Text>
                <TextInput
                  placeholder="Enter your name"
                  placeholderTextColor="#666"
                  value={data.name}
                  style={styles.input}
                  onChangeText={text => setData({ ...data, name: text })}
                />
              </View>

              <Text style={styles.signupText}>
                Already Have an Account?{' '}
                <Text
                  style={styles.signupLink}
                  onPress={() => (navigation as any).navigate('Login')}>
                  Log In
                </Text>
              </Text>
            </View>
          ),
        },
        {
          backgroundColor: '#000',
          image: <View />,
          title: '',
          subtitle: (
            <View style={[styles.container, { position: 'relative' }]}>
              <View className="flex gap-[80px]">
                <Text style={styles.question}>What’s your Email address?</Text>
                <TextInput
                  placeholder="Enter your Email Address"
                  placeholderTextColor="#666"
                  style={styles.input}
                  value={data.email}
                  maxLength={30}
                  onChangeText={text => setData({ ...data, email: text })}
                />
              </View>
            </View>
          ),
        },
        {
          backgroundColor: '#000',
          image: <View />,
          title: '',
          subtitle: (
            <View style={styles.container}>
              <Text style={styles.question}>What is Your Password?</Text>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#666"
                style={styles.input}
                secureTextEntry
                value={data.password}
                onChangeText={text => setData({ ...data, password: text })}
              />

              {isPending ? (
                <View style={{ marginTop: 20 }}>
                  <Text style={{ color: '#aaa', textAlign: 'center' }}>Sign in...</Text>
                  <ActivityIndicator size="small" color="#fff" style={{ marginTop: 10 }} />
                </View>
              ) : (
                <></>
              )}
            </View>
          ),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    gap: 80,
    justifyContent: 'flex-start',
    backgroundColor: '#000',
    width: '100%'
  },
  question: {
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#fff',
    marginBottom: 24,
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
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff8f8',
  },
  signupLink: {
    color: '#e3e7e9',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
