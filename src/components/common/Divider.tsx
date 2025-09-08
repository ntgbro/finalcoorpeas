import React from 'react';
import { View } from 'react-native';
import { theme } from '../../config/theme';

type Props = { inset?: number };

export default function Divider({ inset = 0 }: Props) {
  return <View style={{ height: 1, backgroundColor: theme.colors.border, marginLeft: inset }} />;
}


