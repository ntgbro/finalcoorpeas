import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../config/theme';

export type ServiceKey = 'FRESH_SERVE' | 'FMCG' | 'GIFTING' | 'SUPPLIES' | 'LIVE_CHEF';

export const SERVICES: { key: ServiceKey; label: string }[] = [
  { key: 'FRESH_SERVE', label: 'FRESH SERVE' },
  { key: 'FMCG', label: 'FMCG' },
  { key: 'GIFTING', label: 'GIFTING' },
  { key: 'SUPPLIES', label: 'SUPPLIES' },
  { key: 'LIVE_CHEF', label: 'LIVE CHEF' },
];

type Props = {
  selected: ServiceKey;
  onSelect: (key: ServiceKey) => void;
};

export default function ServiceTabs({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {SERVICES.map(svc => {
          const active = selected === svc.key;
          return (
            <TouchableOpacity
              key={svc.key}
              onPress={() => onSelect(svc.key)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityLabel={svc.label}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{svc.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.surface,
  },
  row: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chip: {
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EFF3FF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 12,
  },
  chipTextActive: {
    color: '#ffffff',
  },
});


