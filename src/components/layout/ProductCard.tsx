import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../config/theme';
import type { Product } from '../../types';
import { addItem, decrement, increment, useCartItemQuantity } from '../../store/cartStore';
import QuantityStepper from '../common/QuantityStepper';
import type { RootStackParamList } from '../../navigation/types';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const qty = useCartItemQuantity(product.id);

  const handleProductPress = () => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleProductPress} activeOpacity={0.7}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.row}>
        {product.vegFlag === 'VEG' ? <View style={[styles.dot, styles.veg]} /> : null}
        {product.vegFlag === 'NON_VEG' ? <View style={[styles.dot, styles.nonveg]} /> : null}
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
      </View>
      <Text style={styles.price}>₹ {product.price.selling}</Text>
      <View style={styles.footer}>
        {qty > 0 ? (
          <QuantityStepper
            style={styles.stepper}
            quantity={qty}
            onIncrement={() => increment(product.id)}
            onDecrement={() => decrement(product.id)}
          />
        ) : (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={(e) => {
              e.stopPropagation();
              addItem(product, 1);
            }}
            style={styles.addBtn}
          >
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
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
    minHeight: 170,
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
  footer: {
    marginTop: theme.spacing.xs,
    alignItems: 'flex-start',
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  addText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  stepper: { marginTop: theme.spacing.xs },
});


