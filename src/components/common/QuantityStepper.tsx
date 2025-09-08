import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

type Props = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  style?: ViewStyle;
};

export default function QuantityStepper({ quantity, onIncrement, onDecrement, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <TouchableOpacity accessibilityRole="button" onPress={onDecrement} style={styles.btn}>
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.qty}>{quantity}</Text>
      <TouchableOpacity accessibilityRole="button" onPress={onIncrement} style={styles.btn}>
        <Text style={styles.btnText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 32,
    alignSelf: 'flex-start',
  },
  btn: { paddingHorizontal: 10, paddingVertical: 4 },
  btnText: { fontSize: 16, fontWeight: '800', color: theme.colors.text },
  qty: { minWidth: 20, textAlign: 'center', fontWeight: '700', color: theme.colors.text },
});


