import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text, TextInput, View} from 'react-native';
import {Animated} from 'react-native';
import {useUserSignup} from '../api/auth/auth';
import {useNavigation} from '@react-navigation/native';
import {useAuthStore} from '../store/authStore';

export function SignUpFormScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState({name: '', email: '', password: ''});
  const {mutate: signup} = useUserSignup();
  const saveToken = useAuthStore(state => state.saveToken);
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChange = (field: keyof typeof data, value: string) => {
    setData(prev => ({...prev, [field]: value}));
  };

  const handleSignup = async () => {
    const {name, email, password} = data;
    console.log('trigger');

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
    <ImageBackground
      source={require('../assets/image/backgroundimage1.png')}
      style={{flex: 1, backgroundColor: '#4754ccef'}}
      resizeMode="cover">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1  justify-center">
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <Animated.View
            style={[styles.content, {transform: [{translateY: slideAnim}]}]}>
            <View className="flex justify-center items-center h-fit w-full">
              <View className="flex-row gap-5 items-center">
                <Text style={styles.loginTitle}>👤 Signup</Text>
              </View>
              <View className=" w-full gap-6">
                <View className=" gap-3">
                  <Text className="text-white font-semibold text-[14px]">
                    User Name
                  </Text>
                  <TextInput
                    className="w-full h-12 px-4 rounded-lg bg-black text-white"
                    placeholder="Enter your user name"
                    placeholderTextColor="#999"
                    value={data.name}
                    onChangeText={text => handleChange('name', text)}
                  />
                </View>
                <View className=" gap-3">
                  <Text className="text-white font-semibold text-[14px]">
                    Your email address
                  </Text>
                  <TextInput
                    className="w-full h-12 px-4 rounded-lg bg-black text-white"
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={data.email}
                    onChangeText={text => handleChange('email', text)}
                  />
                </View>
                <View className="w-full gap-2 mb-4">
                  <Text className="text-white font-semibold text-[14px]">
                    Choose a password
                  </Text>
                  <TextInput
                    className="w-full h-12 px-4 rounded-lg bg-black text-white"
                    placeholder="min, 8 characters"
                    placeholderTextColor="#999"
                    secureTextEntry={true}
                    value={data.password}
                    onChangeText={text => handleChange('password', text)}
                  />
                </View>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleSignup}>
                  <Text style={styles.loginButtonText}>SignUp</Text>
                </TouchableOpacity>

                <Text style={styles.signupText}>
                  Already have an account?
                  <TouchableOpacity>
                    <Text
                      style={styles.signupLink}
                      onPress={() => (navigation as any).navigate('Login')}>
                      {' '}
                      Log In
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    backgroundColor: 'rgba(29, 28, 28, 0.692)',
    padding: 30,
    borderRadius: 16,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#918e8e',
    textAlign: 'center',
  },
  signupLink: {
    color: '#e3e7e9',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
