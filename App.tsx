import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AppNavigator from './android/app/src/navigation/routes';
import './global.css';
import {StatusBar, Text, StyleSheet} from 'react-native';
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
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <AppNavigator linking={linking} fallback={<Text>Loading...</Text>} />
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
