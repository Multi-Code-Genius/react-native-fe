import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, Card, IconButton, Portal, Text } from 'react-native-paper';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SportsScreen from '../screens/SportsScreen';
import { PhotoPostUploader } from '../components/PhotoPostUploader';
import { VideoUploaderComponent } from '../components/VideoUploaderComponent';
import RoomWrapper from '../screens/RoomWrapper';
import ChatList from '../screens/ChatList';

const Tab = createBottomTabNavigator();

export const PrivateRoutes: React.FC = () => {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedScale = useRef(new Animated.Value(1)).current;

  // const handleOpenSheet = useCallback(() => {
  //   bottomSheetRef.current?.expand();
  // }, []);

  const handleSheetChanges = useCallback((index: number) => {
    Animated.timing(animatedScale, {
      toValue: index >= 0 ? 1.1 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
        style={{ backgroundColor: theme.colors.backdrop }}
      />
    ),
    [theme.colors.backdrop],
  );

  const AnimatedTabBarIcon = ({ focused, iconName }) => {
    return (
      <Animatable.View
        animation={focused ? 'bounceIn' : 'fadeOut'}
        duration={500}
        easing="ease-out">
        <Ionicons
          name={iconName}
          size={24}
          color={focused ? '#1DB954' : 'gray'}
        />
      </Animatable.View>
    );
  };

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.secondary,
          tabBarInactiveBackgroundColor: 'transparent',

          tabBarStyle: {
            backgroundColor: theme.colors.scrim,
            borderTopWidth: 0,
            height: 70,
            paddingBottom: 0,
            elevation: 0,
            shadowOpacity: 0,
          },

          tabBarItemStyle: {
            marginVertical: 10,
            marginHorizontal: 6,
            overflow: 'hidden',
          },
          tabBarShowLabel: true,
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                color,
                marginLeft: 6,
                fontWeight: focused ? '600' : '400',
                fontSize: 14,
              }}>
              {route.name}
            </Text>
          ),
          animation: 'shift',
          headerShown: false,
          tabBarHideOnKeyboard: true,
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
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
            tabBarIcon: ({ color, size, focused }) => (
              <IconButton
                icon={focused ? 'map' : 'map-outline'}
                iconColor={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ChatList"
          component={ChatList}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <IconButton
                icon={focused ? 'chat' : 'chat-outline'}
                iconColor={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Rooms"
          component={RoomWrapper}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <IconButton
                icon={focused ? 'account-group' : 'account-group'}
                iconColor={color}
                size={size}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Game"
          component={SportsScreen}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <IconButton
                icon={focused ? 'gamepad-circle-down' : 'gamepad-circle-down'}
                iconColor={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>

      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['25%']}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: theme.colors.surface }}
          enableDynamicSizing
          enableOverDrag
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{ backgroundColor: theme.colors.onSecondary }}
          onChange={handleSheetChanges}>
          <BottomSheetScrollView>
            <View style={styles.sheetContainer}>
              <Card
                mode="contained"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 12,
                }}>
                <Card.Content>
                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme.colors.onSurface,
                      marginBottom: 16,
                      textAlign: 'center',
                    }}>
                    Upload Media
                  </Text>

                  <View style={styles.uploadRow}>
                    <View style={styles.uploadItem}>
                      <PhotoPostUploader />
                    </View>
                    <View style={styles.uploadItem}>
                      <VideoUploaderComponent />
                    </View>
                  </View>

                  <Text
                    variant="bodyMedium"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      textAlign: 'center',
                      marginTop: 8,
                    }}>
                    Choose photos or videos to share with your community
                  </Text>
                </Card.Content>
              </Card>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </Portal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 20,
  },
  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  uploadItem: {
    alignItems: 'center',
  },
});
