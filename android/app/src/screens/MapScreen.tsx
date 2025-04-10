import React, {useEffect, useState} from 'react';
import MapCompo from '../components/MapCompo';
import {requestLocation} from '../hooks/requestLocation';
import {useGetAllUser} from '../hooks/useGetAllUser';

type LocationMarker = {
  lat: number | null;
  lng: number | null;
  title: string | null;
  icon: string | null;
};

const currentUserId = 'c3b212c1-18fb-4cdf-8698-7469ac85b20b';

const MapScreen: React.FC = () => {
  const [locations, setLocations] = useState<LocationMarker[]>([]);
  const {users} = useGetAllUser();

  useEffect(() => {
    const initializeLocations = async () => {
      try {
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

          const userLocations: LocationMarker[] = filteredUsers.map(user => ({
            lat: user.location.lat,
            lng: user.location.lng,
            title: user.name,
            icon: '🕺',
          }));

          markers.push(...userLocations);
        }

        setLocations(markers);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    initializeLocations();
  }, [users]);

  return (
    <MapCompo
      locations={locations}
      defaultZoom={16}
      requestLocationPermission={requestLocation}
      onLocationUpdate={(location: any, nearbyMarkers: any[]) => {
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
