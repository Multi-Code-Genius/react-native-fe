import React, {useState} from 'react';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import {BottomNavigation, useTheme} from 'react-native-paper';
import ReelsScreen from '../screens/ReelsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {SettingScreen} from '../screens/SettingScreen';

type RouteKey = 'home' | 'map' | 'reels' | 'account';

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
      inactiveColor="#B3B3B3"
      activeColor="#fff"
      activeIndicatorStyle={{backgroundColor: 'none'}}
      theme={theme}
      barStyle={{
        backgroundColor: '#121212',
        borderTopColor: '#282828',
        borderTopWidth: 1,
      }}
    />
  );
};
