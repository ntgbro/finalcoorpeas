import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

type Props = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
};

export default function ListItem({ title, subtitle, left, right, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      {left ? <View style={styles.left}>{left}</View> : null}
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  left: { marginRight: 12 },
  body: { flex: 1 },
  right: { marginLeft: 12 },
  title: { color: theme.colors.text, fontWeight: '700' },
  subtitle: { color: theme.colors.textMuted, marginTop: 2 },
});


