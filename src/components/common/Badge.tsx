import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../config/theme';

type Props = {
  value: number;
  max?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Badge({ value, max = 99, style, textStyle }: Props) {
  const display = value > max ? `${max}+` : String(value);
  if (value <= 0) return null;
  return (
    <View style={[styles.badge, style]}>
      <Text style={[styles.text, textStyle]}>{display}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff', fontSize: 10, fontWeight: '700' },
});


