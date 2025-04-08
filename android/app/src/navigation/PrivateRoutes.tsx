import React, {useState} from 'react';
import {BottomNavigation} from 'react-native-paper';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import {SettingScreen} from '../screens/SettingScreen';

export const PrivateRoutes = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
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
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    map: MapScreen,
    setting: SettingScreen,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      inactiveColor="gray"
    />
  );
};
