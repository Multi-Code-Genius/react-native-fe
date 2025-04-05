import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../config/queryClient';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PublicRoutes = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const PrivateRoutes = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    }}>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen name="Home" component={HomeScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await initializeAuth();
    };
    initialize();
  }, [isAuthenticated, initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Main" component={PrivateRoutes} />
          ) : (
            <Stack.Screen name="Auth" component={PublicRoutes} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default AppNavigator;