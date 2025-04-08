import { View, Text, TextInput, Button, Alert } from 'react-native';
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
    <View className="flex-1 bg-white px-6 justify-center">
      <Text className="text-2xl  font-bold text-center text-black mb-6">
        Reset Password
      </Text>

      <TextInput
        placeholder="New Password"
        secureTextEntry
        className="border text-black border-gray-300 rounded-xl p-4 mb-4 text-base"
        onChangeText={setNewPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        className="border text-black border-gray-300 rounded-xl p-4 mb-6 text-base"
        onChangeText={setConfirmPassword}
      />

      <View className="rounded-xl overflow-hidden">
        <Button title="Reset Password" onPress={() => handleResetPassword()} />
      </View>
    </View>
  );
}
