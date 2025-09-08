import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../config/theme';
import { useSelectedAddress, selectAddress } from '../../store/addressStore';
import { AddressSelector } from '../address';
import type { Order, PromoCode, AppliedPromo } from '../../types';
import type { RootStackParamList } from '../../navigation/types';

// Mock Promo Codes
const PROMO_CODES: PromoCode[] = [
  {
    code: 'WELCOME10',
    description: '10% off on first order',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscount: 200,
    isActive: true,
  },
  {
    code: 'SAVE50',
    description: '₹50 off on orders above ₹1000',
    discountType: 'FIXED',
    discountValue: 50,
    minOrderAmount: 1000,
    isActive: true,
  },
  {
    code: 'FLAT20',
    description: '20% off on all orders',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 300,
    maxDiscount: 500,
    isActive: true,
  },
];

type RouteParams = {
  order: Order;
};

export default function CheckoutScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { order } = route.params as RouteParams;
  
  const selectedAddress = useSelectedAddress();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
  const [promoError, setPromoError] = useState('');

  // Calculate final amount with promo discount
  const calculateFinalAmount = () => {
    if (appliedPromo) {
      return appliedPromo.finalAmount;
    }
    return order.total;
  };

  const handleApplyPromoCode = () => {
    setPromoError('');
    
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    const foundPromo = PROMO_CODES.find(
      promo => promo.code.toUpperCase() === promoCode.toUpperCase() && promo.isActive
    );

    if (!foundPromo) {
      setPromoError('Invalid promo code');
      return;
    }

    if (foundPromo.minOrderAmount && order.total < foundPromo.minOrderAmount) {
      setPromoError(`Minimum order amount of ₹${foundPromo.minOrderAmount} required`);
      return;
    }

    let discountAmount = 0;
    
    if (foundPromo.discountType === 'PERCENTAGE') {
      discountAmount = (order.total * foundPromo.discountValue) / 100;
      if (foundPromo.maxDiscount) {
        discountAmount = Math.min(discountAmount, foundPromo.maxDiscount);
      }
    } else {
      discountAmount = foundPromo.discountValue;
    }

    const finalAmount = Math.max(0, order.total - discountAmount);
    
    setAppliedPromo({
      code: foundPromo.code,
      discountAmount,
      finalAmount,
    });
    
    setPromoError('');
  };

  const handleRemovePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const handleSelectAddress = () => {
    navigation.navigate('Address');
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      Alert.alert('Address Required', 'Please select a delivery address to continue.');
      return;
    }

    const finalAmount = calculateFinalAmount();
    const updatedOrder = {
      ...order,
      total: finalAmount,
      deliveryAddress: {
        addressId: selectedAddress.id,
        address: selectedAddress,
      },
    };
    
    navigation.navigate('Payment', { order: updatedOrder });
  };

  const renderOrderItem = (item: any, index: number) => (
    <View key={index} style={styles.orderItem}>
      <View style={styles.itemHeader}>
        <View style={styles.itemRow}>
          {item.vegFlag === 'VEG' ? <View style={[styles.dot, styles.veg]} /> : null}
          {item.vegFlag === 'NON_VEG' ? <View style={[styles.dot, styles.nonveg]} /> : null}
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <Text style={styles.itemPrice}>₹ {item.price}</Text>
      </View>
      <View style={styles.itemFooter}>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemTotal}>₹ {item.price * item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Text style={styles.headerSubtitle}>Order #{order.orderNumber}</Text>
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <AddressSelector
          selectedAddress={selectedAddress}
          onSelectAddress={handleSelectAddress}
        />
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, index) => renderOrderItem(item, index))}
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>₹ {order.subtotal}</Text>
        </View>
        {order.tax && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (GST):</Text>
            <Text style={styles.summaryValue}>₹ {order.tax}</Text>
          </View>
        )}
        {appliedPromo && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount ({appliedPromo.code}):</Text>
            <Text style={[styles.summaryValue, styles.discountValue]}>-₹ {appliedPromo.discountAmount}</Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>₹ {calculateFinalAmount()}</Text>
        </View>
      </View>

      {/* Promo Code Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Promo Code</Text>
        
        {!appliedPromo ? (
          <View style={styles.promoCodeContainer}>
            <View style={styles.promoInputRow}>
              <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code"
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyPromoCode}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {promoError ? (
              <Text style={styles.promoError}>{promoError}</Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.appliedPromoContainer}>
            <View style={styles.appliedPromoRow}>
              <View style={styles.appliedPromoInfo}>
                <Text style={styles.appliedPromoCode}>{appliedPromo.code}</Text>
                <Text style={styles.appliedPromoDiscount}>
                  You saved ₹{appliedPromo.discountAmount}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removePromoButton}
                onPress={handleRemovePromoCode}
              >
                <Text style={styles.removePromoButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Order Notes */}
      {order.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        </View>
      )}

      {/* Action Button */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleProceedToPayment}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  section: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  orderItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.sm,
  },
  veg: {
    backgroundColor: '#16a34a',
  },
  nonveg: {
    backgroundColor: '#b00020',
  },
  itemName: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
  },
  itemPrice: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
  },
  itemTotal: {
    fontSize: theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
  },
  summaryValue: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  totalRow: {
    paddingTop: theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: theme.typography.subtitle,
    color: theme.colors.text,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: theme.typography.subtitle,
    color: theme.colors.primary,
    fontWeight: '800',
  },
  discountValue: {
    color: '#16a34a',
  },
  promoCodeContainer: {
    marginTop: theme.spacing.sm,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: theme.typography.body,
    fontWeight: '600',
  },
  promoError: {
    color: '#dc2626',
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.sm,
  },
  appliedPromoContainer: {
    marginTop: theme.spacing.sm,
    backgroundColor: '#f0fdf4',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  appliedPromoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedPromoInfo: {
    flex: 1,
  },
  appliedPromoCode: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: '#16a34a',
  },
  appliedPromoDiscount: {
    fontSize: theme.typography.caption,
    color: '#16a34a',
    marginTop: 2,
  },
  removePromoButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  removePromoButtonText: {
    color: '#fff',
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  notesContainer: {
    backgroundColor: '#EFF3FF',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  notesText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontStyle: 'italic',
  },
  actionsContainer: {
    padding: theme.spacing.md,
  },
  proceedButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
  },
});
