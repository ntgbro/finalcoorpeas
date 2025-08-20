import React from 'react';
import { View } from 'react-native';

type Props = { size?: number; horizontal?: boolean };

export function Spacer({ size = 8, horizontal = false }: Props) {
  if (horizontal) return <View style={{ width: size }} />;
  return <View style={{ height: size }} />;
}


