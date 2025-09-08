import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

type Props = {
  selected: boolean;
  onSelect: () => void;
  size?: number;
  style?: ViewStyle;
};

export default function RadioButton({ selected, onSelect, size = 18, style }: Props) {
  const radius = size / 2;
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.outer, { width: size, height: size, borderRadius: radius }, style]}
    >
      {selected ? <View style={[styles.inner, { width: size - 8, height: size - 8, borderRadius: radius - 4 }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: { backgroundColor: theme.colors.primary },
});


