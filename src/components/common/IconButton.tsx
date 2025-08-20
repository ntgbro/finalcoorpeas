import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

type Props = {
  label: string; // emoji or short text
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export default function IconButton({ label, onPress, style, accessibilityLabel }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      hitSlop={theme.hitSlop}
      style={[styles.btn, style]}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF3FF',
  },
  text: { fontSize: 16 },
});


