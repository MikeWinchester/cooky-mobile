import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Navigation from './Navigation';
import { useImmersiveMode } from '../../hooks/useImmersiveMode';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { isImmersive } = useImmersiveMode(true);

  return (
    <View style={[styles.container, { 
      paddingTop: isImmersive ? 0 : insets.top,
      paddingBottom: isImmersive ? 0 : insets.bottom,
      backgroundColor: '#FFF8EC'
    }]}>
      <Navigation />
      <View style={[styles.content, { backgroundColor: '#FFF8EC' }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8EC',
  },
  content: {
    flex: 1,
  },
});

export default AppLayout;
