import { useSyncExternalStore } from 'react';
import type { Product } from '../types';

export type CartLineItem = {
  productId: string;
  name: string;
  price: number; // snapshot of selling price
  quantity: number;
  vegFlag?: Product['vegFlag'];
};

type CartState = {
  itemsById: Record<string, CartLineItem>;
};

// ---------------- Internal store ----------------
let state: CartState = { itemsById: {} };
const subscribers = new Set<() => void>();

function emitChange() {
  for (const fn of subscribers) fn();
}

function subscribe(listener: () => void) {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
}

function getSnapshot(): CartState {
  return state;
}

// ---------------- Mutations ----------------
export function addItem(product: Product, quantity: number = 1) {
  const id = product.id;
  const existing = state.itemsById[id];
  const nextQty = (existing?.quantity ?? 0) + quantity;
  state = {
    ...state,
    itemsById: {
      ...state.itemsById,
      [id]: {
        productId: id,
        name: product.name,
        price: product.price.selling,
        quantity: nextQty,
        vegFlag: product.vegFlag,
      },
    },
  };
  emitChange();
}

export function increment(productId: string) {
  const line = state.itemsById[productId];
  if (!line) return;
  state = {
    ...state,
    itemsById: { ...state.itemsById, [productId]: { ...line, quantity: line.quantity + 1 } },
  };
  emitChange();
}

export function decrement(productId: string) {
  const line = state.itemsById[productId];
  if (!line) return;
  const nextQty = line.quantity - 1;
  const { [productId]: _omit, ...rest } = state.itemsById;
  state = nextQty > 0
    ? { ...state, itemsById: { ...state.itemsById, [productId]: { ...line, quantity: nextQty } } }
    : { ...state, itemsById: rest };
  emitChange();
}

export function removeItem(productId: string) {
  if (!state.itemsById[productId]) return;
  const { [productId]: _omit, ...rest } = state.itemsById;
  state = { ...state, itemsById: rest };
  emitChange();
}

export function clearCart() {
  state = { itemsById: {} };
  emitChange();
}

// ---------------- Selectors ----------------
export function selectItems(snapshot: CartState = state): CartLineItem[] {
  return Object.values(snapshot.itemsById);
}

export function selectItemQuantity(productId: string, snapshot: CartState = state): number {
  return snapshot.itemsById[productId]?.quantity ?? 0;
}

export function selectTotalQuantity(snapshot: CartState = state): number {
  return Object.values(snapshot.itemsById).reduce((sum, l) => sum + l.quantity, 0);
}

export function selectSubtotal(snapshot: CartState = state): number {
  return Object.values(snapshot.itemsById).reduce((sum, l) => sum + l.quantity * l.price, 0);
}

// ---------------- Hooks ----------------
export function useCartSnapshot(): CartState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useCartTotalQuantity(): number {
  const snap = useCartSnapshot();
  return selectTotalQuantity(snap);
}

export function useCartItemQuantity(productId: string): number {
  const snap = useCartSnapshot();
  return selectItemQuantity(productId, snap);
}

export function useCartItems(): CartLineItem[] {
  const snap = useCartSnapshot();
  return selectItems(snap);
}

export function useCartSubtotal(): number {
  const snap = useCartSnapshot();
  return selectSubtotal(snap);
}


