import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import AppNavigator from './android/app/src/navigation/routes';
import './global.css';
import {StatusBar, Text, StyleSheet} from 'react-native';
import {PaperProvider, DefaultTheme, configureFonts} from 'react-native-paper';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {MD3Theme} from 'react-native-paper/lib/typescript/types';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {MenuProvider} from 'react-native-popup-menu';
import {SheetProvider} from 'react-native-actions-sheet';
import {QueryClientProvider} from '@tanstack/react-query';
import queryClient from './android/app/src/config/queryClient';

const fontConfig = {
  android: {
    displayLarge: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: '400',
      fontSize: 34,
    },
    displayMedium: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: '400',
      fontSize: 28,
    },
    displaySmall: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: '400',
      fontSize: 22,
    },
    headlineLarge: {
      fontFamily: 'Gilroy-Medium',
      fontWeight: '500',
      fontSize: 24,
    },
    headlineMedium: {
      fontFamily: 'Gilroy-Medium',
      fontWeight: '500',
      fontSize: 20,
    },
    headlineSmall: {
      fontFamily: 'Gilroy-Medium',
      fontWeight: '500',
      fontSize: 18,
    },
    titleLarge: {fontFamily: 'Gilroy-Medium', fontWeight: '500', fontSize: 22},
    titleMedium: {fontFamily: 'Gilroy-Medium', fontWeight: '500', fontSize: 18},
    titleSmall: {fontFamily: 'Gilroy-Medium', fontWeight: '500', fontSize: 16},
    labelLarge: {fontFamily: 'Gilroy-Regular', fontWeight: '400', fontSize: 14},
    labelMedium: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: '400',
      fontSize: 12,
    },
    labelSmall: {fontFamily: 'Gilroy-Regular', fontWeight: '400', fontSize: 10},
    bodyLarge: {fontFamily: 'Gilroy-Regular', fontWeight: '400', fontSize: 16},
    bodyMedium: {fontFamily: 'Gilroy-Regular', fontWeight: '400', fontSize: 14},
    bodySmall: {fontFamily: 'Gilroy-Regular', fontWeight: '400', fontSize: 12},
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
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <PaperProvider theme={spotifyTheme}>
          <SafeAreaProvider>
            <StatusBar barStyle="default" translucent />
            <SafeAreaView
              style={styles.container}
              edges={['top', 'left', 'right']}>
              <SheetProvider context="global">
                <AppNavigator
                  linking={linking}
                  fallback={<Text>Loading...</Text>}
                />
              </SheetProvider>
            </SafeAreaView>
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
