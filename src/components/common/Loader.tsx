import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../config/theme';

type Props = ViewProps & { color?: string; size?: 'small' | 'large' };

export default function Loader({ style, color = theme.colors.primary, size = 'small', ...rest }: Props) {
  return (
    <View style={[styles.wrap, style]} {...rest}>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});


