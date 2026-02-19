import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        { color: '#000000' },
        type === 'title' && { fontSize: 24, fontWeight: 'bold' },
        type === 'defaultSemiBold' && { fontSize: 16, fontWeight: '600' },
        type === 'subtitle' && { fontSize: 18, fontWeight: '500' },
        type === 'link' && { color: '#007AFF', textDecorationLine: 'underline' },
        style,
      ]}
      {...rest}
    />
  );
}
