import React, {useRef, useCallback} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme, Card, IconButton, Portal, Text} from 'react-native-paper';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ReelsScreen from '../screens/ReelsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {PhotoPostUploader} from '../components/PhotoPostUploader';
import {VideoUploaderComponent} from '../components/VideoUploaderComponent';
import ReelList from '../components/ReelList';

const Tab = createBottomTabNavigator();
const NoScreen = () => null;

export const PrivateRoutes: React.FC = () => {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedScale = useRef(new Animated.Value(1)).current;

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

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
        style={{backgroundColor: theme.colors.backdrop}}
      />
    ),
    [theme.colors.backdrop],
  );

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Animated.View style={{flex: 1, transform: [{scale: animatedScale}]}}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.secondary,
            tabBarStyle: {
              backgroundColor: theme.colors.scrim,
              borderTopWidth: 0,
              maxHeight: 60,
              height: '100%',
            },
            tabBarItemStyle: {
              marginVertical: 20,
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
              tabBarIcon: ({color, size}) => (
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
            component={ReelList}
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
      </Animated.View>

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
          handleIndicatorStyle={{backgroundColor: theme.colors.onSecondary}}
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
