import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!__DEV__) return;
    LogBox.ignoreLogs([
      'shadow*',
      'shadowColor',
      'shadowOffset', 
      'shadowOpacity',
      'shadowRadius',
      'fetchPriority',
      'React does not recognize the `fetchPriority` prop',
      'shadow* style props are deprecated',
    ]);
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_left' }} />
          </Stack>
        </SafeAreaProvider>
      </AuthProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
