import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../config/theme';
import { useCartItems, useCartSubtotal, increment, decrement, removeItem, clearCart } from '../../store/cartStore';
import { createOrderFromCart } from '../../store/ordersStore';
import QuantityStepper from '../../components/common/QuantityStepper';
import type { RootStackParamList } from '../../navigation/types';

export default function CartScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = useCartItems();
  const subtotal = useCartSubtotal();
  const [notes, setNotes] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsCheckingOut(true);
    try {
      // Create order but don't clear cart yet - wait for payment completion
      const order = createOrderFromCart(items, notes.trim() || undefined);
      
      // Navigate to AddAddressScreen to add address first
      navigation.navigate('AddAddress', { order });
    } catch (error) {
      Alert.alert('Error', 'Failed to create order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Browse products and add items to your cart.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.productId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.dotWrap}>
              {item.vegFlag === 'VEG' ? <View style={[styles.dot, styles.veg]} /> : null}
              {item.vegFlag === 'NON_VEG' ? <View style={[styles.dot, styles.nonveg]} /> : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>₹ {item.price}</Text>
            </View>
            <QuantityStepper
              quantity={item.quantity}
              onIncrement={() => increment(item.productId)}
              onDecrement={() => decrement(item.productId)}
            />
            <TouchableOpacity onPress={() => removeItem(item.productId)} style={styles.removeBtn}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 200 }}
      />

      {/* Special Instructions */}
      <View style={styles.notesContainer}>
        <Text style={styles.notesLabel}>Special Instructions (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special requests or notes..."
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.summaryBar}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryAmount}>₹ {subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Tax (GST 18%)</Text>
          <Text style={styles.summaryAmount}>₹ {tax}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>₹ {total}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.checkoutBtn, isCheckingOut && styles.checkoutBtnDisabled]}
          onPress={handleCheckout}
          disabled={isCheckingOut}
        >
          <Text style={styles.checkoutText}>
            {isCheckingOut ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  emptySub: { marginTop: 6, color: theme.colors.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  dotWrap: { marginRight: theme.spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  veg: { backgroundColor: '#16a34a' },
  nonveg: { backgroundColor: '#b00020' },
  name: { fontWeight: '700', color: theme.colors.text },
  price: { marginTop: 2, color: theme.colors.textMuted },
  removeBtn: { marginLeft: theme.spacing.sm },
  removeText: { color: theme.colors.primary, fontWeight: '700' },
  notesContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  notesLabel: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    textAlignVertical: 'top',
  },
  summaryBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: theme.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  summaryText: { fontWeight: '600', color: theme.colors.text },
  summaryAmount: { fontWeight: '600', color: theme.colors.text },
  totalRow: {
    paddingTop: theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  totalText: { fontSize: theme.typography.subtitle, fontWeight: '700', color: theme.colors.text },
  totalAmount: { fontSize: theme.typography.subtitle, fontWeight: '800', color: theme.colors.primary },
  checkoutBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
  },
  checkoutBtnDisabled: {
    backgroundColor: theme.colors.textMuted,
  },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: theme.typography.subtitle },
});


