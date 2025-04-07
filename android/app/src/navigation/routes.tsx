import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../config/queryClient';
import WelcomeScreen from '../screens/WelcomeScreen';
import { SignUpFormScreen } from '../screens/SignUpFormScreen';
import { LinkingOptions } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

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
    <Stack.Screen
      name="SignUp"
      component={SignUpFormScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

const PrivateRoutes = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    }}>
    <Tab.Screen name="Home" component={HomeScreen} />
  </Tab.Navigator>
);

type AppNavigatorProps = {
  linking?: LinkingOptions<any>;
  fallback?: React.ReactNode;
};

const AppNavigator: React.FC<AppNavigatorProps> = ({ linking, fallback }) => {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await initializeAuth();
    };
    initialize();
  }, [initializeAuth]);


  console.log("isAuthenticated>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", isAuthenticated)
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer linking={linking} fallback={fallback}>
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
