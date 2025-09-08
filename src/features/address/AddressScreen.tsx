import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../config/theme';
import { useAddresses, deleteAddress, setDefaultAddress, seedMockAddresses } from '../../store/addressStore';
import type { Address } from '../../types';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AddressScreen() {
  const navigation = useNavigation<NavigationProp>();
  const addresses = useAddresses();

  useEffect(() => {
    // Seed mock addresses for development
    if (addresses.length === 0) {
      seedMockAddresses();
    }
  }, [addresses.length]);

  const handleAddAddress = () => {
    navigation.navigate('AddAddress', {});
  };

  const handleEditAddress = (address: Address) => {
    navigation.navigate('EditAddress', { address });
  };

  const handleDeleteAddress = (address: Address) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete "${address.label}" address?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAddress(address.id),
        },
      ]
    );
  };

  const handleSetDefault = (address: Address) => {
    setDefaultAddress(address.id);
  };

  const getAddressTypeColor = (type: Address['type']) => {
    switch (type) {
      case 'HOME': return '#16a34a';
      case 'OFFICE': return '#3b82f6';
      case 'OTHER': return '#8b5cf6';
      default: return theme.colors.textMuted;
    }
  };

  const getAddressTypeIcon = (type: Address['type']) => {
    switch (type) {
      case 'HOME': return '🏠';
      case 'OFFICE': return '🏢';
      case 'OTHER': return '📍';
      default: return '📍';
    }
  };

  const renderAddressItem = ({ item: address }: { item: Address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <Text style={styles.addressTypeIcon}>{getAddressTypeIcon(address.type)}</Text>
          <View>
            <Text style={styles.addressLabel}>{address.label}</Text>
            {address.isDefault && (
              <Text style={styles.defaultBadge}>Default</Text>
            )}
          </View>
        </View>
        <View style={styles.addressActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditAddress(address)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteAddress(address)}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.addressDetails}>
        <Text style={styles.fullName}>{address.fullName}</Text>
        <Text style={styles.phoneNumber}>{address.phoneNumber}</Text>
        <Text style={styles.addressText}>
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </Text>
        {address.landmark && (
          <Text style={styles.landmark}>Landmark: {address.landmark}</Text>
        )}
        <Text style={styles.locationText}>
          {address.city}, {address.state} - {address.pincode}
        </Text>
      </View>

      {!address.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(address)}
        >
          <Text style={styles.setDefaultButtonText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (addresses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Addresses</Text>
        <Text style={styles.emptySubtitle}>
          Add your first address to get started with deliveries.
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddAddress}
        >
          <Text style={styles.addButtonText}>Add Address</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddAddress}
        >
          <Text style={styles.addButtonText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressItem}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
  },
  addButtonText: {
    color: '#fff',
    fontSize: theme.typography.body,
    fontWeight: '600',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  addressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
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
  addressActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    fontSize: theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    borderColor: '#dc2626',
  },
  deleteButtonText: {
    color: '#dc2626',
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
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#f0fdf4',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  setDefaultButtonText: {
    color: '#16a34a',
    fontSize: theme.typography.caption,
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
});
