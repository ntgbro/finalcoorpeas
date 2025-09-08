import React from 'react';
import { Text, TextProps } from 'react-native';
import { theme } from '../../config/theme';

export default function HeaderText(props: TextProps) {
  return <Text {...props} style={[{ fontSize: 18, fontWeight: '700', color: theme.colors.text }, props.style]} />;
}


