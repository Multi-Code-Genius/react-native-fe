import React, {useCallback, useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {getDistance, isPointWithinRadius} from 'geolib';
import {Button, IconButton, MD3Colors} from 'react-native-paper';

const LEAFLET_HTML_SOURCE = Platform.select({
  android: {uri: 'file:///android_asset/map.html'},
});

const DEFAULT_PROPS = {
  defaultZoom: 15,
  radius: 3000,
  showUserLocation: true,
  showRadiusCircle: true,
  locations: [],
  layers: [
    {
      baseLayerIsChecked: false,
      baseLayerName: 'OpenStreetMap Dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    },
  ],
  userIcon: '🧍‍♂️',
  userIconSize: [40, 40],
  markerIconSize: [30, 30],
  circleColor: '#3388ff',
  circleFillOpacity: 0.2,
  showUpdateButton: true,
  buttonTitle: 'Update my location',
};

type MapCompoProps = {
  defaultZoom?: number;
  radius?: number | null;
  showUserLocation?: boolean;
  showRadiusCircle?: boolean;
  locations?: any[]; // You can define a proper interface later
  layers?: any[];
  userIcon?: string;
  userIconSize?: [number, number];
  markerIconSize?: [number, number];
  circleColor?: string;
  circleFillOpacity?: number;
  showUpdateButton?: boolean;
  buttonTitle?: string;
  onLocationUpdate?: (location: any, nearbyMarkers: any[]) => void;
  onMapReady?: () => void;
  requestLocationPermission?: () => Promise<boolean>;
  webViewProps?: any;
};

const MapCompo: React.FC<MapCompoProps> = ({
  defaultZoom = DEFAULT_PROPS.defaultZoom,
  radius = null,
  showUserLocation = DEFAULT_PROPS.showUserLocation,
  showRadiusCircle = DEFAULT_PROPS.showRadiusCircle,
  locations = DEFAULT_PROPS.locations,
  layers = DEFAULT_PROPS.layers,
  userIcon = DEFAULT_PROPS.userIcon,
  userIconSize = DEFAULT_PROPS.userIconSize,
  markerIconSize = DEFAULT_PROPS.markerIconSize,
  circleColor = DEFAULT_PROPS.circleColor,
  circleFillOpacity = DEFAULT_PROPS.circleFillOpacity,
  showUpdateButton = DEFAULT_PROPS.showUpdateButton,
  buttonTitle = DEFAULT_PROPS.buttonTitle,
  onLocationUpdate,
  onMapReady,
  requestLocationPermission,
  webViewProps = {},
}) => {
  const webViewRef = useRef<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  const sendMessage = useCallback((payload: any) => {
    webViewRef.current?.injectJavaScript(
      `window.postMessage(${JSON.stringify(payload)}, '*');`,
    );
  }, []);

  const getNearbyMarkers = useCallback(
    (currentLocation: any) => {
      if (!currentLocation || !locations?.length) return [];

      return locations
        .filter((loc: any) =>
          radius === null
            ? true
            : isPointWithinRadius(
                {latitude: loc?.lat, longitude: loc?.lng},
                {latitude: currentLocation.lat, longitude: currentLocation.lng},
                radius,
              ),
        )
        .map((loc: any) => ({
          position: {lat: loc.lat, lng: loc.lng},
          icon: loc.icon,
          size: markerIconSize,
          title:
            radius === null
              ? loc.title
              : `${loc.title} (${Math.round(
                  getDistance(
                    {
                      latitude: currentLocation.lat,
                      longitude: currentLocation.lng,
                    },
                    {latitude: loc.lat, longitude: loc.lng},
                  ),
                )}m)`,
        }));
    },
    [locations, radius, markerIconSize],
  );

  const sendMapData = useCallback(
    (currentLocation: any) => {
      const nearbyMarkers = getNearbyMarkers(currentLocation);

      const payload = {
        mapCenterPosition: currentLocation,
        zoom: defaultZoom,
        mapMarkers: [
          ...(showUserLocation
            ? [
                {
                  position: currentLocation,
                  icon: userIcon,
                  size: userIconSize,
                  title: 'My Location',
                  isUser: true,
                },
              ]
            : []),
          ...nearbyMarkers,
        ],
        mapLayers: layers,
        ...(showRadiusCircle
          ? {
              mapCircles: [
                {
                  center: currentLocation,
                  radius: radius,
                  color: circleColor,
                  fillColor: circleColor,
                  fillOpacity: circleFillOpacity,
                },
              ],
            }
          : {}),
      };

      sendMessage(payload);
      setInitialized(true);

      if (onLocationUpdate) {
        onLocationUpdate(currentLocation, nearbyMarkers);
      }
    },
    [
      getNearbyMarkers,
      sendMessage,
      defaultZoom,
      showUserLocation,
      userIcon,
      userIconSize,
      layers,
      showRadiusCircle,
      radius,
      circleColor,
      circleFillOpacity,
      onLocationUpdate,
    ],
  );

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const data = event?.nativeEvent?.data;
        if (!data) return;
        const message = JSON.parse(data);

        if (message?.msg === 'MAP_READY') {
          if (location) {
            sendMapData(location);
          }
          if (onMapReady) {
            onMapReady();
          }
        }
      } catch (err) {
        console.warn('Invalid message from WebView:', err);
      }
    },
    [location, sendMapData, onMapReady],
  );

  const updateLocation = useCallback(async () => {
    try {
      let granted = true;
      if (requestLocationPermission) {
        granted = await requestLocationPermission();
      }
      if (!granted) return;

      Geolocation.getCurrentPosition(
        position => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          sendMapData(newLocation);
        },
        error => {
          console.error('Error getting location:', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (error) {
      console.error('Location permission error:', error);
    }
  }, [sendMapData, requestLocationPermission]);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webViewRef}
        source={LEAFLET_HTML_SOURCE}
        style={styles.container}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        originWhitelist={['*']}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator />}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        {...webViewProps}
      />
      {showUpdateButton && (
        <IconButton
          style={{width: '10%', position: 'absolute', right: 0, margin: 10}}
          icon="crosshairs-gps"
          onPress={updateLocation}
          mode="contained-tonal"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapCompo;
