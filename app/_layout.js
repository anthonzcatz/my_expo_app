import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { NetworkStatus } from '@/components/network-status';
import { AuthProvider } from '@/contexts/auth-context';
import { NetworkProvider } from '@/contexts/network-context';
import LoginScreen from './index';

function AppContent() {
  return (
    <>
      <NetworkStatus />
      <LoginScreen />
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <NetworkProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
        </NetworkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
