import React from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';

export interface ScrollAreaProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
}

const ScrollArea = React.forwardRef<ScrollView, ScrollAreaProps>(
  ({ style, children, horizontal = false, showsVerticalScrollIndicator = true, showsHorizontalScrollIndicator = true, ...props }, ref) => (
    <ScrollView
      ref={ref}
      style={[styles.scrollArea, style]}
      horizontal={horizontal}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      {...props}
    >
      {children}
    </ScrollView>
  )
);
ScrollArea.displayName = "ScrollArea";

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
  },
});

export { ScrollArea };
