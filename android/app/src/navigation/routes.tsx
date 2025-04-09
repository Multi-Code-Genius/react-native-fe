import React, { useEffect } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '../config/queryClient';
import WelcomeScreen from '../screens/WelcomeScreen';
import { SignUpFormScreen } from '../screens/SignUpFormScreen';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import { PrivateRoutes } from './PrivateRoutes';
import ResetPassword1 from '../screens/ResetPassword1';

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
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
    <Stack.Screen
      name="ResetPassword1"
      component={ResetPassword1}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
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
