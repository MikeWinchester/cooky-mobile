import { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export const useImmersiveMode = (enabled: boolean = true) => {
  const [isImmersive, setIsImmersive] = useState(false);

  // Verificar si setBehaviorAsync está disponible
  const isBehaviorSupported = () => {
    return typeof NavigationBar.setBehaviorAsync === 'function';
  };

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return; // Solo funciona en Android
    }

    const setImmersiveMode = async () => {
      try {
        if (enabled) {
          // Configurar modo inmersivo completo
          await NavigationBar.setVisibilityAsync('hidden');
          
          // No llamar setBehaviorAsync para evitar warnings con edge-to-edge
          
          // Configurar StatusBar para modo inmersivo
          StatusBar.setHidden(false, 'fade');
          StatusBar.setTranslucent(true);
          StatusBar.setBackgroundColor('transparent', true);
          
          setIsImmersive(true);
        } else {
          // Desactivar modo inmersivo
          await NavigationBar.setVisibilityAsync('visible');
          
          // No llamar setBehaviorAsync para evitar warnings con edge-to-edge
          
          StatusBar.setHidden(false, 'fade');
          StatusBar.setTranslucent(false);
          StatusBar.setBackgroundColor('#FFF8EC', true);
          
          setIsImmersive(false);
        }
      } catch (error) {
        console.log('Error setting immersive mode:', error);
      }
    };

    setImmersiveMode();

    // Cleanup al desmontar
    return () => {
      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('visible').catch(console.log);
        // No llamar setBehaviorAsync para evitar warnings con edge-to-edge
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor('#FFF8EC', true);
      }
    };
  }, [enabled]);

  return {
    isImmersive,
    setImmersive: async (value: boolean) => {
      if (Platform.OS === 'android') {
        try {
          if (value) {
            await NavigationBar.setVisibilityAsync('hidden');
            // No llamar setBehaviorAsync para evitar warnings con edge-to-edge
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('transparent', true);
          } else {
            await NavigationBar.setVisibilityAsync('visible');
            // No llamar setBehaviorAsync para evitar warnings con edge-to-edge
            StatusBar.setTranslucent(false);
            StatusBar.setBackgroundColor('#FFF8EC', true);
          }
          setIsImmersive(value);
        } catch (error) {
          console.log('Error setting immersive mode:', error);
        }
      }
    }
  };
};
