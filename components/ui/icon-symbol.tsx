import * as React from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { StyleProp, TextStyle } from 'react-native';

type Props = {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

const mapToIoniconName = (name: string): keyof typeof Ionicons.glyphMap => {
  switch (name) {
    case 'house.fill':
      return 'home';
    case 'paperplane.fill':
      return 'paper-plane';
    case 'chevron.left.forwardslash.chevron.right':
      return 'code-slash';
    default:
      return 'help-circle';
  }
};

export function IconSymbol({ name, size = 24, color = '#000', style }: Props) {
  return <Ionicons name={mapToIoniconName(name)} size={size} color={color} style={style} />;
}
