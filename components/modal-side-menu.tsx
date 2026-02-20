import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';

interface ModalSideMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (screen: string) => void;
  user?: {
    name: string;
    position: string;
    employeeId: string;
  } | null;
}

export function ModalSideMenu({ isVisible, onClose, onLogout, onNavigate, user }: ModalSideMenuProps) {
  const insets = useSafeAreaInsets();

  const menuItems = [
    { id: 1, title: 'Dashboard', icon: 'grid-outline', screen: '/employee/dashboard' },
    { id: 2, title: 'Profile', icon: 'person-outline', screen: '/employee/profile' },
    { id: 3, title: 'Leave Request', icon: 'calendar-outline', screen: '/employee/leave' },
    { id: 4, title: 'Payslip', icon: 'document-text-outline', screen: '/employee/payslip' },
    { id: 5, title: 'Schedule', icon: 'time-outline', screen: '/employee/schedule' },
    { id: 6, title: 'Announcements', icon: 'megaphone-outline', screen: '/employee/announcements' },
    { id: 7, title: 'Settings', icon: 'settings-outline', screen: '/employee/settings' },
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        {/* Overlay */}
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        
        {/* Menu Content */}
        <View style={styles.menuContent}>
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
              <Ionicons name="close-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem}
                onPress={() => {
                  if (item.screen) {
                    onNavigate(item.screen);
                  }
                  onClose();
                }}
              >
                <View style={[styles.menuItemIcon, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name={item.icon as any} size={22} color="#FFFFFF" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color="#C7C7CC" 
                  style={styles.menuItemArrow}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.menuFooter}>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    flex: 1,
  },
  menuContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  menuHeader: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userPosition: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  userId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuScroll: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  menuItemArrow: {
    marginLeft: 8,
  },
  menuFooter: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 12,
    fontWeight: '600',
  },
});
