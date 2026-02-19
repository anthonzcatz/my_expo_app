import * as React from 'react';
import { Linking, Pressable, type PressableProps } from 'react-native';

export function ExternalLink({
  href,
  children,
  ...rest
}: PressableProps & { href: string; children: React.ReactNode }) {
  return (
    <Pressable
      {...rest}
      onPress={async () => {
        await Linking.openURL(href);
      }}
    >
      {children}
    </Pressable>
  );
}
