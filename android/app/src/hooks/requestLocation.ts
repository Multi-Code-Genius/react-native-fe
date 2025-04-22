import {PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

type Location = {
  lat: number;
  lng: number;
};

const LOCATION_PERMISSION = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
const PERMISSION_REQUEST_OPTIONS = {
  title: 'Location Permission Required',
  message: 'This app needs precise location access to function properly',
  buttonPositive: 'Grant',
  buttonNegative: 'Deny',
};

const hasLocationPermission = async (): Promise<boolean> => {
  try {
    const hasPermission = await PermissionsAndroid.check(LOCATION_PERMISSION);
    if (hasPermission) return true;

    const granted = await PermissionsAndroid.request(
      LOCATION_PERMISSION,
      PERMISSION_REQUEST_OPTIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
};

const getCurrentPosition = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error => {
        reject(new Error(`LOCATION_ERROR:${error.code}:${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
};

export const requestLocation = async (): Promise<Location> => {
  try {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      throw new Error('LOCATION_PERMISSION_DENIED');
    }

    return await getCurrentPosition();
  } catch (error) {
    console.error('Location request failed:', error);
    throw error;
  }
};
