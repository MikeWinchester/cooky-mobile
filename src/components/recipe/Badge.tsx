import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../styles/globalStyles';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps {
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const getBadgeStyles = (variant: BadgeVariant = 'default') => {
  switch (variant) {
    case 'default':
      return {
        backgroundColor: colors.btn.primary,
        borderColor: 'transparent',
        textColor: colors.text.secondary,
      };
    case 'secondary':
      return {
        backgroundColor: colors.btn.secondary,
        borderColor: 'transparent',
        textColor: colors.text.primary,
      };
    case 'destructive':
      return {
        backgroundColor: colors.feedback.error,
        borderColor: 'transparent',
        textColor: '#FFFFFF',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderColor: colors.btn.outline,
        textColor: colors.text.primary,
      };
    default:
      return {
        backgroundColor: colors.btn.primary,
        borderColor: 'transparent',
        textColor: colors.text.secondary,
      };
  }
};

function Badge({ variant = 'default', style, textStyle, children, ...props }: BadgeProps) {
  const badgeStyles = getBadgeStyles(variant);
  
  return (
    <View 
      style={[
        styles.badge,
        {
          backgroundColor: badgeStyles.backgroundColor,
          borderColor: badgeStyles.borderColor,
        },
        style
      ]} 
      {...props}
    >
      <Text 
        style={[
          styles.badgeText,
          { color: badgeStyles.textColor },
          textStyle
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});

export { Badge };
