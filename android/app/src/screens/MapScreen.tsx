import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  MapView,
  PointAnnotation,
  Callout,
  Camera,
  UserLocation,
} from '@maplibre/maplibre-react-native';
import {Card, Text, ActivityIndicator} from 'react-native-paper';
import {requestLocation} from '../hooks/requestLocation';
import LottieView from 'lottie-react-native';

const MapScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const location = await requestLocation();
        if (location) {
          setUserLocation(location);
        }
      } catch (error) {
        console.error('Failed to get location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=6R1qeXkgDjyItDGLuc5M"
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
      <UserLocation
        visible
        animated
        androidRenderMode="gps"
        showsUserHeadingIndicator
        renderMode="native"
      />
      {/* {userLocation && (
        <PointAnnotation
          id="user-location"
          coordinate={[userLocation.lng, userLocation.lat]}>
          <View style={styles.markerContainer}>
            <LottieView
              source={require('../assets/MapMarker.json')}
              autoPlay
              loop
              style={styles.lottieView}
              resizeMode="cover"
            />
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
      )} */}
    </MapView>
  );
};

const styles = StyleSheet.create({
  lottieView: {
    width: 50,
    height: 50,
  },
  markerContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
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
});

export default MapScreen;
