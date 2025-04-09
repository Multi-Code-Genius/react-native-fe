import { View, Text, TextInput, Button, Alert, ImageBackground, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useResetPassword } from '../api/auth/auth';

export default function ResetPasswordScreen({ route }: any) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutate } = useResetPassword();
  const { token } = route.params;

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    mutate({ token: token, newPassword: newPassword });
  };

  return (
    <ImageBackground
      source={require('../assets/image/backgroundimage.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text className="text-2xl  font-bold text-center text-white mb-6">
            Reset Password
          </Text>

          <TextInput
            placeholder="New Password"
            secureTextEntry
            className="border text-white placeholder:text-white border-gray-300 rounded-xl p-4 mb-4 text-base"
            onChangeText={setNewPassword}
          />

          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            className="border text-white placeholder:text-white border-gray-300 rounded-xl p-4 mb-6 text-base"
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.loginButtonText} onPress={handleResetPassword}>Send Reset Password Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  content: {
    backgroundColor: 'rgba(29, 24, 24, 0.877)',
    padding: 30,
    borderRadius: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});