import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../styles/globalStyles';

interface CardProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardHeaderProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardTitleProps {
  style?: TextStyle;
  children?: React.ReactNode;
}

interface CardDescriptionProps {
  style?: TextStyle;
  children?: React.ReactNode;
}

interface CardContentProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

interface CardFooterProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

const Card = ({ style, children, ...props }: CardProps) => (
  <View
    style={[styles.card, style]}
    {...props}
  >
    {children}
  </View>
);

const CardHeader = ({ style, children, ...props }: CardHeaderProps) => (
  <View
    style={[styles.cardHeader, style]}
    {...props}
  >
    {children}
  </View>
);

const CardTitle = ({ style, children, ...props }: CardTitleProps) => (
  <Text
    style={[styles.cardTitle, style]}
    {...props}
  >
    {children}
  </Text>
);

const CardDescription = ({ style, children, ...props }: CardDescriptionProps) => (
  <Text
    style={[styles.cardDescription, style]}
    {...props}
  >
    {children}
  </Text>
);

const CardContent = ({ style, children, ...props }: CardContentProps) => (
  <View
    style={[styles.cardContent, style]}
    {...props}
  >
    {children}
  </View>
);

const CardFooter = ({ style, children, ...props }: CardFooterProps) => (
  <View
    style={[styles.cardFooter, style]}
    {...props}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc', // Corregido: se elimina el acceso a colors.border, que no existe
    backgroundColor: colors.bg.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'column',
    gap: spacing.xs,
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.normal * typography.fontSize['2xl'],
  },
  cardDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  cardContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 0,
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
