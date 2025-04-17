import React, {useState} from 'react';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import {
  BottomNavigation,
  Button,
  Icon,
  IconButton,
  MD3Colors,
  useTheme,
} from 'react-native-paper';
import ReelsScreen from '../screens/ReelsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {SettingScreen} from '../screens/SettingScreen';
import TestScreen from '../screens/TestScreen';
import {StyleSheet, View} from 'react-native';
import {BlurView} from '@react-native-community/blur';

type RouteKey = 'home' | 'map' | 'test' | 'reels' | 'account';

type Route = {
  key: RouteKey;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
};

export const PrivateRoutes: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false); // <-- NEW
  const theme = useTheme();

  const [routes] = useState<Route[]>([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'map',
      title: 'Map',
      focusedIcon: 'map',
      unfocusedIcon: 'map-outline',
    },
    {
      key: 'test',
      title: '',
      focusedIcon: 'plus-circle',
      unfocusedIcon: 'plus-circle-outline',
    },

    {
      key: 'reels',
      title: 'Reels',
      focusedIcon: 'play-box-multiple',
      unfocusedIcon: 'play-box-multiple-outline',
    },
    {
      key: 'account',
      title: 'Profile',
      focusedIcon: 'account',
    },
  ]);

  const renderScene = ({route}: {route: Route}) => {
    switch (route.key) {
      case 'home':
        return <HomeScreen />;
      case 'map':
        return <MapScreen />;
      case 'test':
        return <TestScreen />;
      case 'reels':
        return <ReelsScreen isActive={index === 2} />;
      case 'account':
        return showSettings ? (
          <SettingScreen
            setIndex={setIndex}
            setShowSettings={setShowSettings}
          />
        ) : (
          <ProfileScreen
            setIndex={setIndex}
            setShowSettings={setShowSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={i => {
        setIndex(i);
        setShowSettings(false);
      }}
      renderScene={renderScene}
      inactiveColor={theme.colors.secondary}
      activeColor={theme.colors.primary}
      labeled={false}
      activeIndicatorStyle={{backgroundColor: 'none'}}
      theme={theme}
      compact
      keyboardHidesNavigationBar
      sceneAnimationType="shifting"
      sceneAnimationEnabled
      barStyle={{
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderColor: theme.colors.outline,
      }}
      renderIcon={({route, color}) => {
        if (route.key === 'test') {
          return (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <IconButton
                icon={
                  index === 2
                    ? route.focusedIcon
                    : route.unfocusedIcon || route.focusedIcon
                }
                iconColor={color}
                size={50}
              />
            </View>
          );
        }
        return <Icon source={route.focusedIcon} color={color} size={30} />;
      }}
    />
  );
};
