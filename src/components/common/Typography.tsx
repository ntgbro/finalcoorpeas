import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';

type Props = TextProps & { weight?: 'regular' | 'medium' | 'bold' | 'extra'; color?: string };

export function Display(props: Props) {
  const { style, weight = 'extra', color = theme.colors.text, ...rest } = props;
  return <Text style={[styles.display, weightStyle(weight), { color }, style]} {...rest} />;
}

export function Title(props: Props) {
  const { style, weight = 'bold', color = theme.colors.text, ...rest } = props;
  return <Text style={[styles.title, weightStyle(weight), { color }, style]} {...rest} />;
}

export function Subtitle(props: Props) {
  const { style, weight = 'medium', color = theme.colors.textMuted, ...rest } = props;
  return <Text style={[styles.subtitle, weightStyle(weight), { color }, style]} {...rest} />;
}

export function Body(props: Props) {
  const { style, weight = 'regular', color = theme.colors.text, ...rest } = props;
  return <Text style={[styles.body, weightStyle(weight), { color }, style]} {...rest} />;
}

export function Caption(props: Props) {
  const { style, weight = 'regular', color = theme.colors.textMuted, ...rest } = props;
  return <Text style={[styles.caption, weightStyle(weight), { color }, style]} {...rest} />;
}

function weightStyle(w: Props['weight']) {
  switch (w) {
    case 'extra':
      return { fontWeight: '800' as const };
    case 'bold':
      return { fontWeight: '700' as const };
    case 'medium':
      return { fontWeight: '600' as const };
    default:
      return { fontWeight: '400' as const };
  }
}

const styles = StyleSheet.create({
  display: { fontSize: theme.typography.display, letterSpacing: 2 },
  title: { fontSize: theme.typography.title, letterSpacing: 1.2 },
  subtitle: { fontSize: theme.typography.subtitle },
  body: { fontSize: theme.typography.body },
  caption: { fontSize: theme.typography.caption },
});


