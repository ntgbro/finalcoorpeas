import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';
import { useCartTotalQuantity } from '../../store/cartStore';
import Badge from '../common/Badge';

type TabKey = 'Home' | 'Cart' | 'Orders' | 'Settings';

type Props = {
  active: TabKey;
  onPress: (tab: TabKey) => void;
};

const LABELS: Record<TabKey, string> = {
  Home: 'Home',
  Cart: 'Cart',
  Orders: 'Orders',
  Settings: 'Settings',
};

const ICONS: Record<TabKey, string> = {
  Home: '🏠',
  Cart: '🛒',
  Orders: '📦',
  Settings: '⚙️',
};

export default function BottomNavBar({ active, onPress }: Props) {
  const cartCount = useCartTotalQuantity();
  return (
    <View style={styles.bar}>
      {(Object.keys(LABELS) as TabKey[]).map((key) => {
        const focused = key === active;
        return (
          <TouchableOpacity
            key={key}
            style={styles.tab}
            onPress={() => onPress(key)}
            accessibilityRole="button"
            accessibilityLabel={LABELS[key]}
          >
            <View>
              <Text style={[styles.icon, focused && styles.focused]}>{ICONS[key]}</Text>
              {key === 'Cart' && (
                <View style={styles.badgeWrap}>
                  <Badge value={cartCount} />
                </View>
              )}
            </View>
            <Text style={[styles.label, focused && styles.focused]}>{LABELS[key]}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopColor: theme.colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.surface,
  },
  tab: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 18, color: theme.colors.textMuted },
  label: { fontSize: 12, color: theme.colors.textMuted },
  focused: { color: theme.colors.primary },
  badgeWrap: {
    position: 'absolute',
    top: -4,
    right: -12,
  },
});


