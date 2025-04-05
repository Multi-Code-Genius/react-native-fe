import React from 'react';
import {Text, SafeAreaView} from 'react-native';

import {StackScreenProps} from '@react-navigation/stack';

type Props = StackScreenProps<any, 'Login'>;

const LoginScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView>
      <Text className="text-red-700">Login</Text>
    </SafeAreaView>
  );
};

export default LoginScreen;
