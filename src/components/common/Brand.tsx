import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../config/theme';
import { Title, Caption } from './Typography';

type Props = ViewProps & {
  showTagline?: boolean;
  tagline?: string;
};

export function BrandHeader({ style, showTagline = true, tagline = 'Corporate Solutions for Managers', ...rest }: Props) {
  return (
    <View style={[styles.container, style]} {...rest}>
      <Text style={styles.logo} accessibilityRole="image" accessibilityLabel="Corpeas logo">🏢</Text>
      <Title style={styles.name} color={theme.colors.primary}>
        CORPEAS
      </Title>
      {showTagline ? <Caption style={styles.tagline}>{tagline}</Caption> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  logo: { fontSize: 56 },
  name: { marginTop: 8, letterSpacing: 2 },
  tagline: { marginTop: 4 },
});


