import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AppNavigator from './android/app/src/navigation/routes';
import './global.css';
import {StatusBar, Text, StyleSheet} from 'react-native';
import {PaperProvider, DefaultTheme, configureFonts} from 'react-native-paper';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {MD3Theme} from 'react-native-paper/lib/typescript/types';

const fontConfig = {
  android: {
    displayLarge: {fontFamily: 'Gilroy-Regular', fontWeight: '400'},
    displayMedium: {fontFamily: 'Gilroy-Regular', fontWeight: '400'},
    displaySmall: {fontFamily: 'Gilroy-Regular', fontWeight: '400'},
    headlineLarge: {fontFamily: 'Gilroy-Medium', fontWeight: '500'},
    headlineMedium: {fontFamily: 'Gilroy-Medium', fontWeight: '500'},
    headlineSmall: {fontFamily: 'Gilroy-Medium', fontWeight: '500'},
    titleLarge: {fontFamily: 'Gilroy-Medium', fontWeight: '500'},
    titleMedium: {fontFamily: 'Gilroy-Medium', fontWeight: '500'},
    titleSmall: {fontFamily: 'Gilroy-Medium', fontWeight: '500'},
    labelLarge: {fontFamily: 'Gilroy-Regular', fontWeight: '400'},
    labelMedium: {fontFamily: 'Gilroy-Regular', fontWeight: '400'},
    labelSmall: {fontFamily: 'Gilroy-Regular', fontWeight: '400'},
    bodyLarge: {fontFamily: 'Gilroy-Regular', fontWeight: '400'},
    bodyMedium: {fontFamily: 'Gilroy-Regular', fontWeight: '400'},
    bodySmall: {fontFamily: 'Gilroy-Regular', fontWeight: '400'},
  },
};

const spotifyTheme: MD3Theme = {
  ...DefaultTheme,
  dark: true,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1DB954',
    secondary: '#535353',
    accent: '#1ED760',
    background: '#121212',
    surface: '#181818',
    text: '#FFFFFF',
    onSurface: '#FFFFFF',
    disabled: '#535353',
    placeholder: '#B3B3B3',
    backdrop: 'rgba(24, 24, 24, 0.8)',
    notification: '#1DB954',
    error: '#CF6679',
    outline: '#333333',
    surfaceVariant: '#1E1E1E',
    inversePrimary: '#0F0F0F',
    elevation: {
      level0: 'transparent',
      level1: '#1A1A1A',
      level2: '#1F1F1F',
      level3: '#232323',
      level4: '#262626',
      level5: '#2C2C2C',
    },
  },
  fonts: configureFonts({config: fontConfig, isV3: false}),
};

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
    <PaperProvider theme={spotifyTheme}>
      <SafeAreaProvider>
        <StatusBar barStyle="default" translucent />
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
