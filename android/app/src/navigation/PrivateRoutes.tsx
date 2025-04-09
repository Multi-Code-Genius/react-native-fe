import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationProps } from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import { SettingScreen } from '../screens/SettingScreen';

type RouteKey = 'home' | 'map' | 'setting';

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
      key: 'setting',
      title: 'Setting',
      focusedIcon: 'cog',
      unfocusedIcon: 'setting-outline',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    map: MapScreen,
    setting: SettingScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      inactiveColor="gray"
    />
  );
};
