import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

type Props = { title: string; message?: string; emoji?: string };

export default function EmptyState({ title, message, emoji = '📭' }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.msg}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 40 },
  title: { marginTop: 8, fontWeight: '700', color: theme.colors.text },
  msg: { marginTop: 4, color: theme.colors.textMuted, textAlign: 'center' },
});


