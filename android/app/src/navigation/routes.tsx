import React, {useEffect} from 'react';
import {NavigationContainer, LinkingOptions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuthStore} from '../store/authStore';
import WelcomeScreen from '../screens/WelcomeScreen';
import {SignUpFormScreen} from '../screens/SignUpFormScreen';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import ResetPassword1 from '../screens/ResetPassword1';
import {ProfileReelList} from '../components/ProfileReelList';
import {ProfileSinglePost} from '../components/ProfilePosts/ProfileSinglePost';
import {PrivateRoutes} from './PrivateRoutes';
import {FreindsListScreen} from '../screens/FreindsListScreen';
import {FriendsRequestAcceptScreen} from '../screens/FriendsRequestAcceptScreen';
import {SettingScreen} from '../screens/SettingScreen';
import {useTheme} from 'react-native-paper';
import ChatList from '../screens/ChatList';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const PublicRoutes = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUpFormScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPasswordScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ResetPassword1"
      component={ResetPassword1}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

type AppNavigatorProps = {
  linking?: LinkingOptions<any>;
  fallback?: React.ReactNode;
};

const AppNavigator: React.FC<AppNavigatorProps> = ({linking, fallback}) => {
  const {isAuthenticated, initializeAuth} = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await initializeAuth();
    };
    initialize();
  }, [initializeAuth]);

  const configSlow = {
    animation: 'spring',
    config: {
      stiffness: 60,
      damping: 15,
      mass: 1.5,
    },
  };
  const theme = useTheme();
  return (
    <NavigationContainer linking={linking} fallback={fallback}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={PrivateRoutes} />
            <Stack.Screen
              name="Settings"
              component={SettingScreen}
              options={{
                title: 'Settings',
                transitionSpec: {
                  open: configSlow,
                  close: configSlow,
                },
              }}
            />
            <Stack.Screen
              name="ChatList"
              component={ChatList}
              options={{
                title: 'Chat List',
                headerShown: true,
                headerStyle: {
                  backgroundColor: theme.colors.background,
                },
                headerTintColor: theme.colors.onPrimary,
                headerShadowVisible: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="ChatScreen"
              component={ChatScreen}
              options={{
                title: 'Chats',
                animation: 'slide_from_right',
              }}
            />

            <Stack.Screen
              name="ProfileList"
              component={ProfileReelList}
              options={{
                transitionSpec: {
                  open: configSlow,
                  close: configSlow,
                },
              }}
            />
            <Stack.Screen
              name="FriendsList"
              component={FreindsListScreen}
              options={{
                transitionSpec: {
                  open: configSlow,
                  close: configSlow,
                },
              }}
            />
            <Stack.Screen
              name="FriendsRequestAcceptScreen"
              component={FriendsRequestAcceptScreen}
              options={{
                transitionSpec: {
                  open: configSlow,
                  close: configSlow,
                },
              }}
            />
            <Stack.Screen
              name="SinglePostPhoto"
              component={ProfileSinglePost}
              options={{
                transitionSpec: {
                  open: configSlow,
                  close: configSlow,
                },
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Auth" component={PublicRoutes} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
