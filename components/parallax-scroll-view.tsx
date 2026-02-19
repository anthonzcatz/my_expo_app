import * as React from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

export default function ParallaxScrollView({
  headerBackgroundColor,
  headerImage,
  children,
}: {
  headerBackgroundColor: { light: string; dark: string };
  headerImage: React.ReactNode;
  children: React.ReactNode;
}) {
  const bg = headerBackgroundColor.light;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.header, { backgroundColor: bg } as ViewStyle]}>{headerImage}</View>
      <View style={styles.body}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 24 },
  header: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
