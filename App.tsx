import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './android/app/src/navigation/routes';
import './global.css';
import {Text} from 'react-native';
// import { GluestackUIProvider } from '@gluestack-ui/themed';
// import { config } from '@gluestack-ui/config';

const linking = {
  prefixes: ['initialproject://'],
  config: {
    screens: {
      Auth: {
        screens: {
          ResetPassword: 'reset-password/:token',
        },
      },
    },
  },
};

export default function App() {
  return (
    // <GluestackUIProvider config={config}>
    <SafeAreaProvider>
      <AppNavigator linking={linking} fallback={<Text>Loading...</Text>} />
    </SafeAreaProvider>
    // </GluestackUIProvider>
  );
}
