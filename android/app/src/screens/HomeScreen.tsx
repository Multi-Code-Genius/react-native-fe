import { Button, ButtonText } from '@gluestack-ui/themed';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';

const HomeScreen = () => {
  const logout = useAuthStore(state => state.logout);

  const handleLogout = async () => {
    await logout();
  };


  return (
    <SafeAreaView className="">
      <Text>Home Screen</Text>
      <Button onPress={handleLogout} >
        <ButtonText>LogOut</ButtonText>
      </Button>
    </SafeAreaView>
  );
};

export default HomeScreen;
