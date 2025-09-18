import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationHook {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  isLoading: boolean;
  getCurrentLocation: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

export const useLocation = (): LocationHook => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return false;
      }
      return true;
    } catch (error) {
      setErrorMsg('Error requesting location permission');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(currentLocation);
    } catch (error) {
      setErrorMsg('Error getting current location');
      console.error('Location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    location,
    errorMsg,
    isLoading,
    getCurrentLocation,
    requestPermissions,
  };
};
