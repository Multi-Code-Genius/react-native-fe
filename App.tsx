import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './android/app/src/navigation/routes';
import './global.css';
import {Text} from 'react-native';
import {PaperProvider} from 'react-native-paper';

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
    <PaperProvider>
      <SafeAreaProvider>
        <AppNavigator linking={linking} fallback={<Text>Loading...</Text>} />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
