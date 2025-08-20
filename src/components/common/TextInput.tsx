import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { theme } from '../../config/theme';

type Props = TextInputProps & {
  label?: string;
  errorText?: string | null;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function TextInput({ label, errorText, left, right, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {left}
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.textMuted}
          {...rest}
        />
        {right}
      </View>
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: { marginBottom: theme.spacing.xs, color: theme.colors.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    fontSize: theme.typography.body,
  },
  error: {
    marginTop: theme.spacing.xs,
    color: theme.colors.error,
  },
});


