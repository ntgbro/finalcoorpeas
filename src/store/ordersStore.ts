import { useSyncExternalStore } from 'react';
import type { Order, OrderItem, OrderStatus } from '../types';

type OrdersState = {
  orders: Order[];
};

// ---------------- Internal store ----------------
let state: OrdersState = { orders: [] };
const subscribers = new Set<() => void>();

function emitChange() {
  for (const fn of subscribers) fn();
}

function subscribe(listener: () => void) {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}

function getSnapshot(): OrdersState {
  return state;
}

// ---------------- Order Creation ----------------
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

export function createOrderFromCart(cartItems: any[], notes?: string): Order {
  const now = Date.now();
  const orderNumber = generateOrderNumber();
  
  const items: OrderItem[] = cartItems.map(item => ({
    productId: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    vegFlag: item.vegFlag,
  }));

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  const newOrder: Order = {
    id: `order-${now}`,
    orderNumber,
    items,
    subtotal,
    tax,
    total,
    status: 'PENDING',
    createdAt: now,
    updatedAt: now,
    estimatedDelivery: now + (30 * 60 * 1000), // 30 minutes from now
    notes,
  };

  state = {
    ...state,
    orders: [newOrder, ...state.orders],
  };
  
  emitChange();
  return newOrder;
}

// ---------------- Order Management ----------------
export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orderIndex = state.orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) return;

  const updatedOrder = {
    ...state.orders[orderIndex],
    status,
    updatedAt: Date.now(),
  };

  state = {
    ...state,
    orders: [
      ...state.orders.slice(0, orderIndex),
      updatedOrder,
      ...state.orders.slice(orderIndex + 1),
    ],
  };

  emitChange();
}

export function cancelOrder(orderId: string) {
  updateOrderStatus(orderId, 'CANCELLED');
}

// ---------------- Selectors ----------------
export function selectAllOrders(snapshot: OrdersState = state): Order[] {
  return [...snapshot.orders].sort((a, b) => b.createdAt - a.createdAt);
}

export function selectOrderById(orderId: string, snapshot: OrdersState = state): Order | undefined {
  return snapshot.orders.find(o => o.id === orderId);
}

export function selectOrdersByStatus(status: OrderStatus, snapshot: OrdersState = state): Order[] {
  return snapshot.orders.filter(o => o.status === status);
}

export function selectRecentOrders(limit: number = 5, snapshot: OrdersState = state): Order[] {
  return selectAllOrders(snapshot).slice(0, limit);
}

// ---------------- Hooks ----------------
export function useOrdersSnapshot(): OrdersState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useAllOrders(): Order[] {
  const snap = useOrdersSnapshot();
  return selectAllOrders(snap);
}

export function useOrderById(orderId: string): Order | undefined {
  const snap = useOrdersSnapshot();
  return selectOrderById(orderId, snap);
}

export function useOrdersByStatus(status: OrderStatus): Order[] {
  const snap = useOrdersSnapshot();
  return selectOrdersByStatus(status, snap);
}

export function useRecentOrders(limit: number = 5): Order[] {
  const snap = useOrdersSnapshot();
  return selectRecentOrders(limit, snap);
}

// ---------------- Mock Data for Development ----------------
export function seedMockOrders() {
  const mockOrders: Order[] = [
    {
      id: 'order-1',
      orderNumber: 'ORD-123456-001',
      items: [
        {
          productId: 'fresh_serve-paneer-butter-masala',
          name: 'Paneer Butter Masala',
          price: 240,
          quantity: 2,
          vegFlag: 'VEG',
        },
        {
          productId: 'fresh_serve-dal-makhani',
          name: 'Dal Makhani',
          price: 200,
          quantity: 1,
          vegFlag: 'VEG',
        },
      ],
      subtotal: 680,
      tax: 122,
      total: 802,
      status: 'DELIVERED',
      createdAt: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
      estimatedDelivery: Date.now() - (2 * 24 * 60 * 60 * 1000) + (30 * 60 * 1000),
    },
    {
      id: 'order-2',
      orderNumber: 'ORD-123457-002',
      items: [
        {
          productId: 'fmcg-potato-chips',
          name: 'Potato Chips',
          price: 35,
          quantity: 3,
          vegFlag: 'NA',
        },
        {
          productId: 'fmcg-cookies-chocolate-chip',
          name: 'Cookies (Chocolate Chip)',
          price: 60,
          quantity: 2,
          vegFlag: 'NA',
        },
      ],
      subtotal: 225,
      tax: 41,
      total: 266,
      status: 'PREPARING',
      createdAt: Date.now() - (1 * 60 * 60 * 1000), // 1 hour ago
      updatedAt: Date.now() - (30 * 60 * 1000), // 30 minutes ago
      estimatedDelivery: Date.now() + (15 * 60 * 1000), // 15 minutes from now
    },
    {
      id: 'order-3',
      orderNumber: 'ORD-123458-003',
      items: [
        {
          productId: 'gifting-laptop-bag',
          name: 'Laptop Bag',
          price: 1499,
          quantity: 1,
          vegFlag: 'NA',
        },
      ],
      subtotal: 1499,
      tax: 270,
      total: 1769,
      status: 'CONFIRMED',
      createdAt: Date.now() - (30 * 60 * 1000), // 30 minutes ago
      updatedAt: Date.now() - (30 * 60 * 1000),
      estimatedDelivery: Date.now() + (2 * 60 * 60 * 1000), // 2 hours from now
    },
  ];

  state = { orders: mockOrders };
  emitChange();
}
