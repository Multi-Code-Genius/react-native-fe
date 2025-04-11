import React, {useEffect, useState} from 'react';
import MapCompo from '../components/MapCompo';
import {requestLocation} from '../hooks/requestLocation';
import {useGetAllUser} from '../hooks/useGetAllUser';
import {useUserStore} from '../store/userStore';
import {Text} from 'react-native-paper';

type LocationMarker = {
  lat: number;
  lng: number;
  title: string;
  icon: string;
};

type UserLocation = {
  lat: number;
  lng: number;
};

const MapScreen: React.FC = () => {
  const [locations, setLocations] = useState<LocationMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {users} = useGetAllUser();
  const {userData} = useUserStore();

  const currentUserId = userData?.id;

  useEffect(() => {
    const initializeLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentLocation = await requestLocation();
        const markers: LocationMarker[] = [];

        if (currentLocation?.lat && currentLocation?.lng) {
          markers.push({
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            title: 'You',
            icon: '📍',
          });
        }

        if (users?.users) {
          const filteredUsers = users.users.filter(
            user =>
              user.id !== currentUserId &&
              user?.location?.lat != null &&
              user?.location?.lng != null,
          );

          filteredUsers.forEach(user => {
            markers.push({
              lat: user.location.lat,
              lng: user.location.lng,
              title: user.name || 'Unknown',
              icon: '🕺',
            });
          });
        }

        setLocations(markers);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Failed to load locations');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocations();
  }, [users, currentUserId]);

  if (isLoading) {
    return <Text>Loading map...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <MapCompo
      locations={locations}
      defaultZoom={16}
      radius={3000}
      circleColor="#ff0000"
      circleFillOpacity={0.1}
      showRadiusCircle
      requestLocationPermission={requestLocation}
      onLocationUpdate={(
        location: UserLocation,
        nearbyMarkers: LocationMarker[],
      ) => {
        console.log('User location:', location);
        console.log('Nearby markers:', nearbyMarkers);
      }}
      onMapReady={() => console.log('Map is ready')}
      showUpdateButton={true}
      buttonTitle="Refresh Location"
      webViewProps={{
        style: {backgroundColor: 'transparent'},
      }}
    />
  );
};

export default MapScreen;
