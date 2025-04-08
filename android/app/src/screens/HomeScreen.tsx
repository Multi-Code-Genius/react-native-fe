import React from 'react';
import {Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuthStore} from '../store/authStore';
import {Button} from 'react-native-paper';

const HomeScreen = () => {
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView className="">
      <Text>Home Screen</Text>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={{width: '50%', margin: 'auto'}}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default HomeScreen;
