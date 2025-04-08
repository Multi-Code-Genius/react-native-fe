import React, {useState} from 'react';
import MapCompo from '../components/MapCompo';
import {requestLocation} from '../hooks/requestLocation';

type LocationMarker = {
  lat: number;
  lng: number;
  title: string;
  icon: string;
};

const MapScreen: React.FC = () => {
  const [locations, setLocations] = useState<LocationMarker[]>([
    {lat: 21.198, lng: 72.785, title: 'Surat - Coffee Shop', icon: '☕'},
  ]);

  return (
    <MapCompo
      locations={locations}
      defaultZoom={14}
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
