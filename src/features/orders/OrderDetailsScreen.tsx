import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../../config/theme';
import { useOrderById, updateOrderStatus } from '../../store/ordersStore';
import type { Order } from '../../types';

type RouteParams = {
  orderId: string;
};

export default function OrderDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as RouteParams;
  
  const order = useOrderById(orderId);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return '#f59e0b';
      case 'CONFIRMED': return '#3b82f6';
      case 'PREPARING': return '#8b5cf6';
      case 'READY': return '#10b981';
      case 'DELIVERED': return '#16a34a';
      case 'CANCELLED': return '#dc2626';
      default: return theme.colors.textMuted;
    }
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstimatedDelivery = (timestamp?: number) => {
    if (!timestamp) return 'Not available';
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date < now) {
      return 'Delivered';
    }
    
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `In ${diffMins} minutes`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `In ${diffHours} hours`;
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            updateOrderStatus(orderId, 'CANCELLED');
            Alert.alert('Order Cancelled', 'Your order has been cancelled.');
          },
        },
      ]
    );
  };

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Order not found</Text>
        <Text style={styles.errorSubtitle}>The order you're looking for doesn't exist.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Order Info */}
      <View style={styles.orderInfo}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        <View style={styles.orderMeta}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Order Date:</Text>
            <Text style={styles.metaValue}>{formatDateTime(order.createdAt)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Last Updated:</Text>
            <Text style={styles.metaValue}>{formatDateTime(order.updatedAt)}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Estimated Delivery:</Text>
            <Text style={styles.metaValue}>{getEstimatedDelivery(order.estimatedDelivery)}</Text>
          </View>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, index) => (
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
        ))}
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

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryContainer}>
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
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>₹ {order.total}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      {order.status === 'PENDING' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelOrder}
          >
            <Text style={styles.cancelButtonText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  errorTitle: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  errorSubtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  orderInfo: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  orderNumber: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
  },
  statusText: {
    color: '#fff',
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  orderMeta: {
    gap: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
  },
  metaValue: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
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
  summaryContainer: {
    gap: theme.spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  actionsContainer: {
    padding: theme.spacing.md,
  },
  cancelButton: {
    backgroundColor: '#dc2626',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
  },
});
