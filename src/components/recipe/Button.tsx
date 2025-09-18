import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../styles/globalStyles';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

const getButtonStyles = (variant: ButtonVariant = 'default', size: ButtonSize = 'default') => {
  const baseStyles = {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 6,
    flexDirection: 'row' as const,
  };

  const variantStyles = {
    default: {
      backgroundColor: colors.btn.primary,
      borderWidth: 0,
    },
    destructive: {
      backgroundColor: colors.feedback.error,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.btn.outline,
    },
    secondary: {
      backgroundColor: colors.btn.secondary,
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    link: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };

  const sizeStyles = {
    default: {
      height: 40,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    sm: {
      height: 36,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    lg: {
      height: 44,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    icon: {
      height: 40,
      width: 40,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
  };

  return {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };
};

const getTextStyles = (variant: ButtonVariant = 'default', size: ButtonSize = 'default') => {
  const baseTextStyles = {
    fontWeight: typography.fontWeight.medium,
  };

  const variantTextStyles = {
    default: {
      color: colors.text.secondary,
    },
    destructive: {
      color: '#FFFFFF',
    },
    outline: {
      color: colors.text.primary,
    },
    secondary: {
      color: colors.text.primary,
    },
    ghost: {
      color: colors.text.primary,
    },
    link: {
      color: colors.btn.primary,
      textDecorationLine: 'underline' as const,
    },
  };

  const sizeTextStyles = {
    default: {
      fontSize: typography.fontSize.sm,
    },
    sm: {
      fontSize: typography.fontSize.sm,
    },
    lg: {
      fontSize: typography.fontSize.base,
    },
    icon: {
      fontSize: typography.fontSize.sm,
    },
  };

  return {
    ...baseTextStyles,
    ...variantTextStyles[variant],
    ...sizeTextStyles[size],
  };
};

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  ({ variant = 'default', size = 'default', style, textStyle, children, onPress, disabled, ...props }, ref) => {
    const buttonStyles = getButtonStyles(variant, size);
    const textStyles = getTextStyles(variant, size);

    return (
      <TouchableOpacity
        ref={ref}
        style={[
          buttonStyles,
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        <Text style={[textStyles, textStyle]}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
);
Button.displayName = "Button";

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

export { Button };
