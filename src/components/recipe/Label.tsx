import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, typography } from '../../styles/globalStyles';

export interface LabelProps {
  style?: TextStyle;
  children?: React.ReactNode;
}

const Label = React.forwardRef<Text, LabelProps>(
  ({ style, children, ...props }, ref) => (
    <Text
      ref={ref}
      style={[styles.label, style]}
      {...props}
    >
      {children}
    </Text>
  )
);
Label.displayName = "Label";

const styles = StyleSheet.create({
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
});

export { Label };
