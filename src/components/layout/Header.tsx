import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { theme } from '../../config/theme';
import IconButton from '../common/IconButton';

type Props = {
  onProfile?: () => void;
  onNotifications?: () => void;
  onLocation?: () => void;
  onSearch?: (q: string) => void;
  onVegToggle?: (isVeg: boolean) => void;
};

export default function Header({ onProfile, onNotifications, onLocation, onSearch, onVegToggle }: Props) {
  const [query, setQuery] = useState('');
  const [isVeg, setIsVeg] = useState(true);

  function toggleVeg(value: boolean) {
    setIsVeg(value);
    onVegToggle?.(value);
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <IconButton label="👤" onPress={onProfile} accessibilityLabel="Profile" />
        <View style={styles.locationWrap}>
          <IconButton label="📍" onPress={onLocation} accessibilityLabel="Location" />
          <Text style={styles.locationText}>Select location</Text>
        </View>
        <IconButton label="🔔" onPress={onNotifications} accessibilityLabel="Notifications" />
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            value={query}
            onChangeText={(t) => {
              setQuery(t);
              onSearch?.(t);
            }}
            placeholder="Search products, services..."
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        <View style={styles.segmentedWrap}>
          <Text
            onPress={() => toggleVeg(true)}
            style={[styles.segment, styles.segmentLeft, isVeg && styles.segmentActive]}
          >
            Veg
          </Text>
          <Text
            onPress={() => toggleVeg(false)}
            style={[styles.segment, styles.segmentRight, !isVeg && styles.segmentActive]}
          >
            Non-Veg
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as unknown as number,
  },
  locationText: {
    marginLeft: 6,
    color: theme.colors.text,
    fontWeight: '600',
  },
  searchWrap: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 42,
    flex: 1,
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
  },
  segmentedWrap: {
    marginLeft: 10,
    flexDirection: 'row',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EFF3FF',
    color: theme.colors.text,
    fontWeight: '700',
  },
  segmentLeft: {},
  segmentRight: { borderLeftWidth: 1, borderLeftColor: theme.colors.border },
  segmentActive: { backgroundColor: theme.colors.primary, color: '#fff' },
});


