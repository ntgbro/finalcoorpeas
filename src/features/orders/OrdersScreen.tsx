import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../config/theme';
import { useAllOrders, seedMockOrders } from '../../store/ordersStore';
import type { Order } from '../../types';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OrdersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const orders = useAllOrders();

  useEffect(() => {
    // Seed mock orders for development
    if (orders.length === 0) {
      seedMockOrders();
    }
  }, [orders.length]);

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { orderId: order.id });
  };

  const renderOrderItem = ({ item: order }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(order)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.slice(0, 2).map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemRow}>
              {item.vegFlag === 'VEG' ? <View style={[styles.dot, styles.veg]} /> : null}
              {item.vegFlag === 'NON_VEG' ? <View style={[styles.dot, styles.nonveg]} /> : null}
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemQuantity}>×{item.quantity}</Text>
            </View>
          </View>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{order.items.length - 2} more items
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>₹ {order.total}</Text>
        <Text style={styles.viewDetails}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptySubtitle}>
          Your order history will appear here once you place your first order.
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.headerSubtitle}>{orders.length} orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
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
  listContent: {
    padding: theme.spacing.md,
  },
  orderCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  orderNumber: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  orderDate: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
  },
  statusText: {
    color: '#fff',
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: theme.spacing.sm,
  },
  orderItem: {
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  veg: {
    backgroundColor: '#16a34a',
  },
  nonveg: {
    backgroundColor: '#b00020',
  },
  itemName: {
    flex: 1,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  itemQuantity: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  moreItems: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  totalAmount: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  viewDetails: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.pill,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
  },
});
