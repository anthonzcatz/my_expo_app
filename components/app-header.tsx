import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function AppHeader({
  title,
  subtitle,
  showLogout,
  onLogout,
  onMenuPress,
}: {
  title: string;
  subtitle?: string;
  showLogout?: boolean;
  onLogout?: () => void | Promise<void>;
  onMenuPress?: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        {/* Left side - Logo */}
        <View style={styles.leftSection}>
          <Image 
            source={require('../assets/images/logo.png')} 
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        
        {/* Center - Title and Subtitle */}
        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        
        {/* Right side - Menu and Logout buttons */}
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
            <Ionicons name="menu-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          {showLogout && (
            <TouchableOpacity style={styles.iconButton} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logo: {
    width: 52,
    height: 52,
  },
  centerSection: {
    flex: 2,
    alignItems: 'flex-start',
    paddingHorizontal: 6,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  iconButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'left',
    fontWeight: '400',
  },
});
