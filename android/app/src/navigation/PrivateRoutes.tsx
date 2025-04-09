import React, {useState} from 'react';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';

import {BottomNavigation} from 'react-native-paper';

import {SettingScreen} from '../screens/SettingScreen';
import ReelsScreen from '../screens/ReelsScreen';

type RouteKey = 'home' | 'map' | 'reels' | 'setting';

type Route = {
  key: RouteKey;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
};

export const PrivateRoutes: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
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
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      inactiveColor="gray"
      shifting
    />
  );
};
