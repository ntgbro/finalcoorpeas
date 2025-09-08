import React from 'react';
import type { Address, AddressType } from '../types';

// Simple state management without external dependencies
let addresses: Address[] = [];
let selectedAddressId: string | null = null;
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Actions
export const addAddress = (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newAddress: Address = {
    ...addressData,
    id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  addresses = [...addresses, newAddress];
  
  // If this is the first address or marked as default, make it default
  if (addresses.length === 1 || newAddress.isDefault) {
    addresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === newAddress.id
    }));
    selectedAddressId = newAddress.id;
  }
  
  notifyListeners();
};

export const updateAddress = (id: string, updates: Partial<Address>) => {
  addresses = addresses.map((addr) =>
    addr.id === id
      ? { ...addr, ...updates, updatedAt: Date.now() }
      : addr
  );
  notifyListeners();
};

export const deleteAddress = (id: string) => {
  const deletedAddress = addresses.find((addr) => addr.id === id);
  addresses = addresses.filter((addr) => addr.id !== id);
  
  // If deleted address was default, make another address default
  if (deletedAddress?.isDefault && addresses.length > 0) {
    addresses[0].isDefault = true;
  }
  
  // If deleted address was selected, clear selection
  if (selectedAddressId === id) {
    selectedAddressId = null;
  }
  
  notifyListeners();
};

export const setDefaultAddress = (id: string) => {
  addresses = addresses.map((addr) => ({
    ...addr,
    isDefault: addr.id === id,
  }));
  selectedAddressId = id;
  notifyListeners();
};

export const selectAddress = (id: string | null) => {
  selectedAddressId = id;
  notifyListeners();
};

export const getAddressById = (id: string) => {
  return addresses.find((addr) => addr.id === id);
};

export const getDefaultAddress = () => {
  return addresses.find((addr) => addr.isDefault);
};

export const clearAddresses = () => {
  addresses = [];
  selectedAddressId = null;
  notifyListeners();
};

// Simple hook for React components
export const useAddresses = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    const listener = () => forceUpdate();
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  return addresses;
};

export const useSelectedAddress = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    const listener = () => forceUpdate();
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  return selectedAddressId ? getAddressById(selectedAddressId) : undefined;
};

export const useDefaultAddress = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    const listener = () => forceUpdate();
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  return getDefaultAddress();
};

// Seed some mock addresses for development
export const seedMockAddresses = () => {
  const mockAddresses: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      userId: 'user_1',
      type: 'HOME',
      label: 'Home',
      fullName: 'John Doe',
      phoneNumber: '+91 98765 43210',
      addressLine1: '123 Main Street',
      addressLine2: 'Apartment 4B',
      landmark: 'Near City Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true,
      isActive: true,
    },
    {
      userId: 'user_1',
      type: 'OFFICE',
      label: 'Office',
      fullName: 'John Doe',
      phoneNumber: '+91 98765 43210',
      addressLine1: '456 Business Park',
      addressLine2: 'Floor 2, Suite 201',
      landmark: 'Opposite Metro Station',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false,
      isActive: true,
    },
  ];

  mockAddresses.forEach((address) => {
    addAddress(address);
  });
};

// Export individual functions for direct use
