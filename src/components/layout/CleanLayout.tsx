import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CleanLayoutProps {
  children: React.ReactNode;
}

// Layout completamente limpio sin navegación (para landing page)
const CleanLayout: React.FC<CleanLayoutProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8EC',
  },
});

export default CleanLayout;
