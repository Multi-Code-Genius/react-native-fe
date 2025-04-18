import React, {useRef, useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ReelsScreen from '../screens/ReelsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {Card, IconButton, Portal, Text} from 'react-native-paper';
import {useTheme} from 'react-native-paper';

import {StyleSheet, View} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {PhotoPostUploader} from '../components/PhotoPostUploader';
import {VideoUploaderComponent} from '../components/VideoUploaderComponent';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

const NoScreen = () => null;

export const PrivateRoutes: React.FC = () => {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
        style={{backgroundColor: theme.colors.backdrop}}
      />
    ),
    [],
  );

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',

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
          name="ActionButton"
          component={NoScreen}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <IconButton
                icon="plus-circle"
                iconColor={theme.colors.primary}
                size={40}
                onPress={handleOpenSheet}
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
                icon={
                  focused ? 'play-box-multiple' : 'play-box-multiple-outline'
                }
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
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['25%']}
          enablePanDownToClose
          backgroundStyle={{backgroundColor: theme.colors.surface}}
          enableDynamicSizing
          enableOverDrag
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{backgroundColor: theme.colors.onSecondary}}>
          <BottomSheetScrollView>
            <View className="p-5">
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

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 16,
                    }}>
                    <View style={{alignItems: 'center'}}>
                      <PhotoPostUploader />
                    </View>

                    <View style={{alignItems: 'center'}}>
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
    </>
  );
};
