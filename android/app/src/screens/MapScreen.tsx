import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import {
  MapView,
  PointAnnotation,
  Callout,
  Camera,
} from '@maplibre/maplibre-react-native';
import {Card, Text, ActivityIndicator, IconButton} from 'react-native-paper';
import {requestLocation} from '../hooks/requestLocation';

const LOCATION_TIMEOUT = 10000; // 10 seconds timeout

const MapScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  const getLocationWithTimeout = async () => {
    let timeoutId: NodeJS.Timeout;

    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, LOCATION_TIMEOUT);
    });

    try {
      const location = await Promise.race([requestLocation(), timeoutPromise]);
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

  const flyToUserLocation = async () => {
    setLoading(true);
    try {
      const location = await getLocationWithTimeout();
      if (location) {
        setUserLocation(location);

        // Add 3-second delay before flying to location
        await new Promise(resolve => setTimeout(resolve, 3000));

        mapRef.current?.flyTo(
          [location.lng, location.lat],
          14, // Higher zoom level when manually requested
          2000, // Animation duration
        );
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.errorContainer}>
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
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        scrollEnabled
        zoomEnabled>
        {userLocation && (
          <Camera
            centerCoordinate={[userLocation.lng, userLocation.lat]}
            zoomLevel={11}
            animationMode="flyTo"
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
                  <Text variant="bodyMedium" style={styles.cardDescription}>
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </Text>
                </Card.Content>
              </Card>
            </Callout>
          </PointAnnotation>
        )}
      </MapView>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={flyToUserLocation}>
        <IconButton
          icon="crosshairs-gps"
          iconColor="#000"
          size={24}
          style={styles.locationButtonIcon}
        />
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
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
    backgroundColor: '#fff',
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
    height: 48,
    width: 48,
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
    backgroundColor: 'white',
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
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

export default MapScreen;
