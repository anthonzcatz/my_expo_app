import * as React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: PressableProps) {
  const { onPress, ...rest } = props;

  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        try {
          Haptics.selectionAsync();
        } catch {
          // ignore
        }
        onPress?.(e);
      }}
    />
  );
}
