import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

type Props = ViewProps & { padded?: boolean };

export default function Card({ style, children, padded = true, ...rest }: Props) {
  return (
    <View style={[styles.card, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: theme.radius.md,
  },
  padded: {
    padding: theme.spacing.sm,
  },
});


