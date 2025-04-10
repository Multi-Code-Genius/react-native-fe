import React, {useState} from 'react';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import {BottomNavigation, useTheme} from 'react-native-paper';
import {SettingScreen} from '../screens/SettingScreen';
import ReelsScreen from '../screens/ReelsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';

type RouteKey = 'home' | 'map' | 'reels' | 'setting' | 'account';

type Route = {
  key: RouteKey;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
};

export const PrivateRoutes: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
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
      key: 'setting',
      title: 'Setting',
      focusedIcon: 'cog',
      unfocusedIcon: 'cog-outline',
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
      case 'setting':
        return <SettingScreen />;
      case 'account':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
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
