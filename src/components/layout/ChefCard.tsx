import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';
import type { Chef } from '../../types';

type Props = { chef: Chef };

export default function ChefCard({ chef }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{chef.name}</Text>
        <Text style={styles.meta}>
          {chef.expertise?.join(', ')} • {chef.experienceYears ?? 0} yrs
        </Text>
        {chef.signatureDishes && (
          <Text numberOfLines={1} style={styles.dishes}>
            {chef.signatureDishes.join(', ')}
          </Text>
        )}
        <Text style={styles.price}>₹ {chef.pricePerSlot} / slot</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E6EAF2',
    marginRight: theme.spacing.md,
  },
  info: { flex: 1 },
  name: { fontWeight: '700', color: theme.colors.text },
  meta: { color: theme.colors.textMuted, marginTop: 2 },
  dishes: { color: theme.colors.textMuted, marginTop: 2 },
  price: { color: theme.colors.text, marginTop: 6, fontWeight: '700' },
});


