
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface CardSectionProps {
  title: string;
  children: React.ReactNode;
}

function CardSection({ title, children }: CardSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.sm,
    color: '#381C08',
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  childrenContainer: {
    gap: spacing.sm,
  },
});

export default CardSection;