import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  style?: ViewStyle;
  size?: number;
};

export default function Checkbox({ checked, onChange, style, size = 20 }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={[styles.box, { width: size, height: size, borderRadius: 4 }, style]}
    >
      {checked ? <View style={[styles.tick, { width: size - 8, height: size - 8 }]} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    backgroundColor: theme.colors.primary,
  },
});


