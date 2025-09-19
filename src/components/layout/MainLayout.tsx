import React from 'react';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navigation from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  
  // Calcular altura total del navbar (status bar + header)
  const navbarHeight = insets.top + 50; // 50px para el header

  return (
    <View style={styles.container}>
      {/* Fondo negro para la barra de navegación del sistema */}
      <View style={[styles.systemNavBackground, { height: insets.bottom }]} />
      
      {/* Contenido principal */}
      <View style={[styles.content, { 
        backgroundColor: '#FFF8EC',
        paddingBottom: insets.bottom,
        paddingTop: navbarHeight,
      }]}>
        {children}
      </View>
      
      {/* Navigation con posición absoluta */}
      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8EC',
  },
  systemNavBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    zIndex: 1000,
  },
  content: {
    flex: 1,
  },
});

export default AppLayout;
