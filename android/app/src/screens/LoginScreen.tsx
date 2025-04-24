import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useUserLogin } from '../api/auth/auth';
import { useAuthStore } from '../store/authStore';
import { Animated } from 'react-native';
import { ActivityIndicator, Snackbar } from 'react-native-paper';

type Props = StackScreenProps<any, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState({ email: '', password: '' });
  const { mutate: login, isPending, isSuccess } = useUserLogin();
  const saveToken = useAuthStore(state => state.saveToken);
  const slideAnim = useRef(new Animated.Value(500)).current;
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleChange = (field: keyof typeof data, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!data.email || !data.password) {
      setSnackbarMessage('Please fill all fields');
      setSnackbarVisible(true);
      return;
    }
    login(data, {
      onSuccess: async ({ token }) => {
        if (!token) {
          setSnackbarMessage('No token received.');
          setSnackbarVisible(true);
          return;
        }
        await saveToken(token);
      },
      onError: (error: any) => {
        const message =
          error?.message || 'Login failed. Please try again.';
        setSnackbarMessage(message);
        setSnackbarVisible(true);
      },
    });
  };

  const handleResetPassword = () => {
    navigation.navigate('ResetPassword1');
  };

  return (
    <ImageBackground
      source={require('../assets/image/backgroundimage.png')}
      style={styles.background}
      resizeMode="cover">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <Animated.View
            style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.loginTitle}>👤 Login</Text>
            <Text style={styles.label}>Your email address</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="email-address"
              onChangeText={text => handleChange('email', text)}
              value={data.email}
            />
            <Text style={styles.label}>Choose a password</Text>
            <TextInput
              value={data.password}
              onChangeText={text => handleChange('password', text)}
              placeholder="min, 8 characters"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
            />
            <TouchableOpacity>
              <Text style={styles.forgotText}>
                Forget Password?{' '}
                <Text style={styles.resetLink} onPress={handleResetPassword}>
                  Reset password
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              disabled={isPending}
              onPress={handleSubmit}>
              {isPending ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Don’t have an account?
              <Text
                style={styles.signupLink}
                onPress={() => (navigation as any).navigate('SignUp')}>
                Sign Up
              </Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
          textColor: 'white'
        }}>
        {snackbarMessage}
      </Snackbar>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#fff',
  },
  forgotText: {
    color: '#fff',
    textAlign: 'left',
    marginBottom: 24,
  },
  resetLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
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