import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ReelsScreen from '../screens/ReelsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import TestScreen from '../screens/TestScreen';
import {IconButton} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {BlurView} from '@react-native-community/blur';
import {StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator();

export const PrivateRoutes: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarBackground: () => (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={100}
          />
        ),

        tabBarStyle: {
          backgroundColor: theme.colors.scrim,
          position: 'absolute',
          borderRadius: 30,
          bottom: 10,
          width: '90%',
          marginHorizontal: '5%',
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          marginVertical: 10,
        },
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <IconButton
              icon={focused ? 'home' : 'home-outline'}
              iconColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <IconButton
              icon={focused ? 'map' : 'map-outline'}
              iconColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <IconButton
              icon={focused ? 'plus-circle' : 'plus-circle-outline'}
              iconColor={color}
              size={40}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Reels"
        component={ReelsScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <IconButton
              icon={focused ? 'play-box-multiple' : 'play-box-multiple-outline'}
              iconColor={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <IconButton
              icon={focused ? 'account' : 'account-outline'}
              iconColor={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
