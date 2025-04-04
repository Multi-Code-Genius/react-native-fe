import React from 'react';
import {View, Text} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';

type Props = StackScreenProps<any, 'Login'>;

const LoginScreen: React.FC<Props> = () => {
  return (
    <View className="h-full w-full">
      <Text className="text-red-700">Login</Text>
    </View>
  );
};

export default LoginScreen;
