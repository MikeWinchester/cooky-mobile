import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../styles/globalStyles';

interface ImmersiveIndicatorProps {
  isImmersive: boolean;
}

const ImmersiveIndicator: React.FC<ImmersiveIndicatorProps> = ({ isImmersive }) => {
  if (!isImmersive) return null;

  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.btn.primary,
    opacity: 0.6,
  },
  indicator: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.btn.primary,
  },
});

export default ImmersiveIndicator;


