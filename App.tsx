import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './android/app/src/navigation/routes';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
