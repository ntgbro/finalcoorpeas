import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../../config/theme';
import type { Address } from '../../types';

interface AddressSelectorProps {
  selectedAddress: Address | null;
  onSelectAddress: () => void;
  showAddButton?: boolean;
}

export default function AddressSelector({ 
  selectedAddress, 
  onSelectAddress, 
  showAddButton = true 
}: AddressSelectorProps) {
  const getAddressTypeIcon = (type: Address['type']) => {
    switch (type) {
      case 'HOME': return '🏠';
      case 'OFFICE': return '🏢';
      case 'OTHER': return '📍';
      default: return '📍';
    }
  };

  const getAddressTypeColor = (type: Address['type']) => {
    switch (type) {
      case 'HOME': return '#16a34a';
      case 'OFFICE': return '#3b82f6';
      case 'OTHER': return '#8b5cf6';
      default: return theme.colors.textMuted;
    }
  };

  if (!selectedAddress) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Address Selected</Text>
          <Text style={styles.emptySubtitle}>
            Please select a delivery address to continue
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={onSelectAddress}
          >
            <Text style={styles.selectButtonText}>
              {showAddButton ? 'Select Address' : 'Choose Address'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addressCard}
        onPress={onSelectAddress}
        activeOpacity={0.7}
      >
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeContainer}>
            <Text style={styles.addressTypeIcon}>
              {getAddressTypeIcon(selectedAddress.type)}
            </Text>
            <View>
              <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
              {selectedAddress.isDefault && (
                <Text style={styles.defaultBadge}>Default</Text>
              )}
            </View>
          </View>
          <Text style={styles.changeText}>Change</Text>
        </View>

        <View style={styles.addressDetails}>
          <Text style={styles.fullName}>{selectedAddress.fullName}</Text>
          <Text style={styles.phoneNumber}>{selectedAddress.phoneNumber}</Text>
          <Text style={styles.addressText}>
            {selectedAddress.addressLine1}
            {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
          </Text>
          {selectedAddress.landmark && (
            <Text style={styles.landmark}>Landmark: {selectedAddress.landmark}</Text>
          )}
          <Text style={styles.locationText}>
            {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  addressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTypeIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  addressLabel: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
  },
  defaultBadge: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  changeText: {
    fontSize: theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  addressDetails: {
    marginBottom: theme.spacing.sm,
  },
  fullName: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  addressText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  landmark: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  locationText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  selectButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.pill,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: theme.typography.body,
    fontWeight: '600',
  },
});
