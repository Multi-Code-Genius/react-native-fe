import React from 'react';
import {View, Text} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';

type Props = StackScreenProps<any, 'Login'>;

const LoginScreen: React.FC<Props> = () => {
  return (
    <View className="bg-blue-400 w-full h-full">
      <Text className="text-red-700">Login</Text>
    </View>
  );
};

export default LoginScreen;
