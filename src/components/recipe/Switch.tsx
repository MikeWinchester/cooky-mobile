import React from 'react';
import { Switch as RNSwitch, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../styles/globalStyles';

export interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const Switch = React.forwardRef<RNSwitch, SwitchProps>(
  ({ value = false, onValueChange, disabled = false, style, ...props }, ref) => (
    <RNSwitch
      ref={ref}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      style={[styles.switch, style]}
      trackColor={{
        false: '#FFFFFF',
        true: colors.btn.primary,
      }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#FFFFFF"
      {...props}
    />
  )
);
Switch.displayName = "Switch";

const styles = StyleSheet.create({
  switch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }],
  },
});

export { Switch };
