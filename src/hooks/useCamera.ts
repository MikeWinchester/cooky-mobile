import { useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export interface CameraHook {
  hasPermission: boolean | null;
  cameraRef: React.RefObject<Camera> | null;
  takePicture: () => Promise<string | null>;
  pickImage: () => Promise<string | null>;
  requestPermissions: () => Promise<void>;
}

export const useCamera = (): CameraHook => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<React.RefObject<Camera> | null>(null);

  const requestPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const takePicture = async (): Promise<string | null> => {
    if (!cameraRef?.current) return null;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      return photo.uri;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  };

  const pickImage = async (): Promise<string | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  };

  return {
    hasPermission,
    cameraRef,
    takePicture,
    pickImage,
    requestPermissions,
  };
};
