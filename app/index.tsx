import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Animated, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing details', 'Please enter your username and password.');
      return;
    }
    
    // Start login animation
    setLoading(true);
    
    // Fade out and scale down animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    try {
      // Use dynamic API configuration
      const url = API_ENDPOINTS.LOGIN;
      console.log('Login attempt to URL:', url);
      console.log('Username:', username);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', res.status);
      const data = await res.json().catch(() => null);
      console.log('Login response data:', data);

      if (!res.ok || !data?.ok) {
        const code = data?.error ?? 'LOGIN_FAILED';
        console.log('Login failed with code:', code);
        
        // Fade back in on error
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        if (code === 'ACCOUNT_DISABLED') {
          Alert.alert('Account disabled', 'Please contact HR/admin.');
        } else {
          Alert.alert('Login failed', 'Invalid username or password.');
        }
        return;
      }

      // Success animation - slide up and fade
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Wait for animation to complete before navigation
      setTimeout(async () => {
        await login(data.user);
        router.replace('/employee/dashboard');
      }, 500);
      
    } catch (e) {
      console.error('Login error:', e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      console.error('Error details:', {
        message: errorMessage,
        stack: e instanceof Error ? e.stack : 'No stack trace',
        url: API_ENDPOINTS.LOGIN,
        username: username
      });
      
      // Fade back in on error
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      Alert.alert('Network Error', `Cannot connect to server: ${errorMessage}\n\nURL: ${API_ENDPOINTS.LOGIN}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Logo at the top */}
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }]
        }
      ]}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logoImage}
        />
      </Animated.View>
      
      {/* Welcome text below logo */}
      <Animated.View style={[
        styles.welcomeContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }]
        }
      ]}>
        <ThemedText style={styles.title}>Welcome Back</ThemedText>
        <ThemedText style={styles.subtitle}>Sign in to continue to your account</ThemedText>
      </Animated.View>
      
      <Animated.View style={[
        styles.form,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }]
        }
      ]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>
        
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <ThemedText style={styles.forgotPasswordText}>Forgot password?</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} disabled={loading} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Sign In</ThemedText>
          )}
        </TouchableOpacity>
        
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <ThemedText style={styles.dividerText}>OR</ThemedText>
          <View style={styles.divider} />
        </View>
        
        <TouchableOpacity style={styles.socialButton}>
          <ThemedText style={styles.socialButtonText}>Continue with Google</ThemedText>
        </TouchableOpacity>
        
        <View style={styles.signupContainer}>
          <ThemedText style={styles.signupText}>Don't have an account? </ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.signupLinkText}>Sign Up</ThemedText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 40,
    paddingTop: 80,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 350,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#333',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  socialButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  socialButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLinkText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
