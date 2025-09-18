import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, typography } from '../../styles/globalStyles';

export interface InputProps extends TextInputProps {
  style?: any;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        placeholderTextColor={colors.text.secondary}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.text.primary,
    backgroundColor: colors.bg.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
});

export { Input };
