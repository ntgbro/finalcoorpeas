import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../config/theme';
import type { Product } from '../../../types';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.row}>
        {product.vegFlag === 'VEG' ? <View style={[styles.dot, styles.veg]} /> : null}
        {product.vegFlag === 'NON_VEG' ? <View style={[styles.dot, styles.nonveg]} /> : null}
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
      </View>
      <Text style={styles.price}>₹ {product.price.selling}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.spacing.sm,
    margin: theme.spacing.xs,
  },
  imagePlaceholder: {
    height: 90,
    backgroundColor: '#EEF2F7',
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  veg: { backgroundColor: '#16a34a' },
  nonveg: { backgroundColor: '#b00020' },
  name: { flex: 1, color: theme.colors.text, fontWeight: '600' },
  price: { marginTop: 4, color: theme.colors.text },
});


