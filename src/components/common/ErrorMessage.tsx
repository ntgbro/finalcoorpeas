import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

type Props = { children: React.ReactNode };

export default function ErrorMessage({ children }: Props) {
  if (!children) return null;
  return <Text style={styles.err}>{children}</Text>;
}

const styles = StyleSheet.create({
  err: { color: theme.colors.error, marginTop: 4 },
});


