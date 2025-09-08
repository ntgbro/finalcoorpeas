import React, { useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../config/theme';

type Props = {
  size?: number;
  source?: ImageSourcePropType;
  name?: string; // used for initials fallback
  style?: StyleProp<ViewStyle>;
};

export default function Avatar({ size = 40, source, name, style }: Props) {
  const radius = size / 2;

  const initials = useMemo(() =>
    (name || '')
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase())
      .slice(0, 2)
      .join(''), [name]);

  if (source) {
    return <Image source={source} style={[{ width: size, height: size, borderRadius: radius }, style]} />;
  }

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: radius }, style]}>
      <Text style={[styles.initials, { fontSize: Math.max(12, radius * 0.9) }]}>{initials || '👤'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#E6EAF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: theme.colors.text,
    fontWeight: '700',
  },
});
