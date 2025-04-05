import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './android/app/src/navigation/routes';
import './global.css';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
