import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {
  MapView,
  PointAnnotation,
  Callout,
  Camera,
  MarkerView,
} from '@maplibre/maplibre-react-native';
import {
  Card,
  Text,
  ActivityIndicator,
  IconButton,
  useTheme,
  Badge,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {requestLocation} from '../hooks/requestLocation';
import {useGetAllLocations, useUpdateLocation} from '../api/user/user';

const LOCATION_TIMEOUT = 10000;

const MapScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);
  const theme = useTheme();
  const {mutate} = useUpdateLocation();
  const {data} = useGetAllLocations();

  const getLocationWithTimeout = async () => {
    let timeoutId: NodeJS.Timeout;

    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, LOCATION_TIMEOUT);
    });

    try {
      const location = await Promise.race([requestLocation(), timeoutPromise]);
      console.log('location', location);
      clearTimeout(timeoutId);
      return location;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const fetchCurrentLocation = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      const location = await getLocationWithTimeout();
      if (location) {
        setUserLocation(location);
      }
    } catch (error: any) {
      console.error('Failed to get location:', error);
      setLocationError(error.message || 'Failed to get location');
      Alert.alert(
        'Location Error',
        error.message || 'Could not determine your location',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      console.log('trig');
      mutate(userLocation);
    }
  }, [userLocation, mutate]);

  const flyToUserLocation = async () => {
    setLoading(true);
    try {
      const location = await getLocationWithTimeout();
      if (location) {
        setUserLocation(location);

        await new Promise(resolve => setTimeout(resolve, 3000));

        mapRef.current?.flyTo([location.lng, location.lat], 14, 2000);
      }
    } catch (error: any) {
      console.error('Failed to get location:', error);
      setLocationError(error.message || 'Failed to get location');
      Alert.alert(
        'Location Error',
        error.message || 'Could not determine your location',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      );
    } finally {
      setLoading(false);
    }
  };

  // Utility function to group users by location
  const groupLocations = (users: any[]) => {
    const groups: Record<string, any[]> = {};

    users.forEach(user => {
      if (!user.location?.latitude || !user.location?.longitude) return;

      const key = `${user.location.latitude.toFixed(
        4,
      )},${user.location.longitude.toFixed(4)}`;

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(user);
    });

    return groups;
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View
        style={[
          styles.errorContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Text style={styles.errorText}>{locationError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchCurrentLocation}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        mapStyle="https://api.maptiler.com/maps/outdoor-v2/style.json?key=6R1qeXkgDjyItDGLuc5M"
        scrollEnabled
        zoomEnabled>
        {userLocation && (
          <Camera
            centerCoordinate={[userLocation.lng, userLocation.lat]}
            zoomLevel={11}
            animationMode="linearTo"
            animationDuration={2000}
          />
        )}

        {userLocation && (
          <PointAnnotation
            id="user-location"
            coordinate={[userLocation.lng, userLocation.lat]}>
            <View style={styles.markerContainer}>
              <Text className="text-4xl">🧍🏻‍♂️</Text>
            </View>

            <Callout style={styles.callout}>
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.cardTitle}>
                    Your Location
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{color: theme.colors.primary}}>
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </Text>
                </Card.Content>
              </Card>
            </Callout>
          </PointAnnotation>
        )}
        {data?.usersWithLocations &&
          Object.entries(groupLocations(data.usersWithLocations)).map(
            ([key, users]) => {
              const [latStr, lngStr] = key.split(',');
              const lat = parseFloat(latStr);
              const lng = parseFloat(lngStr);

              return (
                <PointAnnotation
                  key={key}
                  id={`group-${key}`}
                  coordinate={[lng, lat]}>
                  <View style={styles.markerContainer}>
                    {users.length > 1 ? (
                      <Badge size={20}>{users.length}</Badge>
                    ) : (
                      <Text style={{fontSize: 30}}>📍</Text>
                    )}
                  </View>

                  <Callout style={styles.callout}>
                    <Card style={styles.card}>
                      <Card.Content>
                        {users.map(user => (
                          <View key={user.id} style={{marginBottom: 8}}>
                            <Text variant="titleSmall" style={styles.cardTitle}>
                              {user.name}
                            </Text>
                            <Text
                              variant="bodySmall"
                              style={styles.cardDescription}>
                              {user.isOnline
                                ? '🟢 Online'
                                : `Last seen: ${new Date(
                                    user.lastSeen,
                                  ).toLocaleString()}`}
                            </Text>
                          </View>
                        ))}
                      </Card.Content>
                    </Card>
                  </Callout>
                </PointAnnotation>
              );
            },
          )}
      </MapView>

      <IconButton
        icon="crosshairs-gps"
        iconColor={theme.colors.primary}
        size={24}
        style={[styles.locationButton, {backgroundColor: theme.colors.surface}]}
        onPress={flyToUserLocation}
      />

      {loading && (
        <View
          style={[
            styles.loadingOverlay,
            {backgroundColor: theme.colors.backdrop},
          ]}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  markerContainer: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  callout: {
    borderRadius: 8,
    padding: 3,
    width: 220,
  },
  card: {
    borderRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardDescription: {
    color: '#666',
  },
  locationButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,

    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  locationButtonIcon: {
    margin: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },

  profileName: {
    marginTop: 2,
    fontSize: 10,
    color: 'black',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },

  markerView: {
    alignItems: 'center',
  },
  clusterMarker: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapScreen;
