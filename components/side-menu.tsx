import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  user?: {
    name: string;
    position: string;
    employeeId: string;
  } | null;
}

export function SideMenu({ isVisible, onClose, onLogout, user }: SideMenuProps) {
  const insets = useSafeAreaInsets();

  if (!isVisible) return null;

  const menuItems = [
    { id: 1, title: 'Dashboard', icon: 'grid-outline', onPress: () => {} },
    { id: 2, title: 'Profile', icon: 'person-outline', onPress: () => {} },
    { id: 3, title: 'Leave Request', icon: 'calendar-outline', onPress: () => {} },
    { id: 4, title: 'Payslip', icon: 'document-text-outline', onPress: () => {} },
    { id: 5, title: 'Schedule', icon: 'time-outline', onPress: () => {} },
    { id: 6, title: 'Announcements', icon: 'megaphone-outline', onPress: () => {} },
    { id: 7, title: 'Settings', icon: 'settings-outline', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      
      {/* Menu Content */}
      <View style={[styles.menuContent, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.menuHeader}>
          <View style={styles.userInfo}>
            <ExpoImage 
              source={require('../assets/images/logo.png')} 
              style={styles.userAvatar}
              contentFit="contain"
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'Employee'}</Text>
              <Text style={styles.userPosition}>{user?.position || 'Staff'}</Text>
              <Text style={styles.userId}>{user?.employeeId || 'EMP-000'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => {
                item.onPress();
                onClose();
              }}
            >
              <Ionicons name={item.icon as any} size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.menuFooter}>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFFFFF',
  },
  menuHeader: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userPosition: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  userId: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  menuScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  menuFooter: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    fontSize: 15,
    color: '#FF3B30',
    marginLeft: 10,
    fontWeight: '600',
  },
});
