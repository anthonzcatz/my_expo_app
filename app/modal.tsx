import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IMAGE_URLS } from '@/config/api';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

function MenuItem({ icon, color, label, onPress }: { icon: any; color: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress} style={styles.menuItem}>
      <View style={[styles.menuIconWrap, { backgroundColor: `${color}15` }]}> 
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <ThemedText style={styles.menuLabel}>{label}</ThemedText>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
}

export default function ModalScreen() {
  const { user } = useAuth();
  const go = (path: string) => router.push(path as any);
  const [loggingOut, setLoggingOut] = useState(false);
  
  // Format employee name from database (same as dashboard)
  const getEmployeeName = () => {
    if (user?.employee) {
      const firstName = String((user.employee as any)?.first_name ?? '');
      const middleName = String((user.employee as any)?.middle_name ?? '');
      const lastName = String((user.employee as any)?.last_name ?? '');
      
      let formattedName = firstName;
      
      // Add middle initial with period if middle name exists
      if (middleName && middleName.trim()) {
        formattedName += ` ${middleName.trim().charAt(0).toUpperCase()}.`;
      }
      
      // Add last name
      if (lastName) {
        formattedName += ` ${lastName}`;
      }
      
      return formattedName.trim() || user?.user_name || 'Unknown Employee';
    }
    return user?.user_name || 'Unknown Employee';
  };

  const getEmployeePosition = () => {
    return String((user?.employee as any)?.position_name ?? 'Employee');
  };

  const getEmployeeDepartment = () => {
    return String((user?.employee as any)?.department_name ?? 'General Department');
  };

  // Get employee image URL
  const getEmployeeImageUrl = () => {
    const userImg = (user?.employee as any)?.user_img;
    if (userImg) {
      const imageUrl = `${IMAGE_URLS.USER_IMAGES}/${userImg}`;
      console.log('Modal: Getting image URL:', imageUrl);
      return imageUrl;
    }
    return undefined;
  };

  const doLogout = async () => {
    setLoggingOut(true);
    try {
      // TODO: clear auth state/token once wired
      await new Promise((r) => setTimeout(r, 1000));
      router.replace('/');
    } finally {
      setLoggingOut(false);
    }
  };
  const confirmLogout = () => {
    if (loggingOut) return;
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: doLogout },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Status bar spacer */}
      <View style={styles.statusBarSpacer} />
      
      {/* Header */}
      <View style={styles.headerRow}>
        <ThemedText style={styles.headerTitle}>Menu</ThemedText>
        <TouchableOpacity accessibilityLabel="Close" onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile summary */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {getEmployeeImageUrl() ? (
              <Image
                source={{ 
                  uri: `${getEmployeeImageUrl()}?t=${Date.now()}`
                }}
                style={styles.avatarImage}
                contentFit="cover"
                onError={() => console.log('Modal: Image failed to load')}
                onLoad={() => console.log('Modal: Image loaded successfully')}
              />
            ) : (
              <Ionicons name="person" size={28} color="#fff" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.profileName}>{getEmployeeName()}</ThemedText>
            <ThemedText style={styles.profileMeta}>{getEmployeePosition()} • {getEmployeeDepartment()}</ThemedText>
          </View>
          <TouchableOpacity onPress={() => go('/employee/profile')}>
            <ThemedText style={styles.viewProfile}>View</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Navigation section */}
        <ThemedText style={styles.sectionTitle}>Navigation</ThemedText>
        <View style={styles.card}>
          <MenuItem icon="home" color="#007AFF" label="Dashboard" onPress={() => go('/employee/dashboard')} />
          <MenuItem icon="person-outline" color="#007AFF" label="Profile" onPress={() => go('/employee/profile')} />
          <MenuItem icon="calendar-outline" color="#007AFF" label="Leave" onPress={() => go('/employee/leave')} />
          <MenuItem icon="wallet-outline" color="#007AFF" label="Payslip" onPress={() => go('/employee/payslip')} />
        </View>

        {/* Records */}
        <ThemedText style={styles.sectionTitle}>Records</ThemedText>
        <View style={styles.card}>
          <MenuItem icon="document-text-outline" color="#34C759" label="Memos" onPress={() => go('/employee/memos')} />
          <MenuItem icon="alert-circle-outline" color="#FF3B30" label="Incidents" onPress={() => go('/employee/incidents')} />
          <MenuItem icon="trophy-outline" color="#FF9500" label="Awards" onPress={() => go('/employee/awards')} />
          <MenuItem icon="trending-up-outline" color="#8E8E93" label="Promotions" onPress={() => go('/employee/promotions')} />
        </View>

        {/* Help & Settings */}
        <ThemedText style={styles.sectionTitle}>Help & Settings</ThemedText>
        <View style={styles.card}>
          <MenuItem icon="help-circle-outline" color="#8E8E93" label="Support" onPress={() => go('/modal')} />
          <MenuItem icon="settings-outline" color="#8E8E93" label="Settings" onPress={() => go('/modal')} />
        </View>

        {/* Logout */}
        <TouchableOpacity style={[styles.logoutBtn, loggingOut && { opacity: 0.7 }]} disabled={loggingOut} onPress={confirmLogout}>
          {loggingOut ? (
            <ActivityIndicator color="#FF3B30" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
              <ThemedText style={styles.logoutText}>Logout</ThemedText>
            </>
          )}
        </TouchableOpacity>

        {/* Developer credit */}
        <View style={styles.devFooter}>
          <ThemedText style={styles.devFooterText}>Developed by anthonz</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  statusBarSpacer: {
    height: 44,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF0',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  closeBtn: { padding: 6 },
  content: { padding: 16, gap: 12 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  profileName: { fontSize: 16, fontWeight: '700', color: '#000' },
  profileMeta: { fontSize: 12, color: '#666' },
  viewProfile: { color: '#007AFF', fontWeight: '600' },
  sectionTitle: { marginTop: 8, marginBottom: 4, fontSize: 14, color: '#666', fontWeight: '600' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EFEFF0' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F3',
  },
  menuIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: '#000', fontWeight: '500' },
  logoutBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFE8E8',
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  logoutText: { color: '#FF3B30', fontWeight: '700', fontSize: 15 },
  devFooter: { alignItems: 'center', marginTop: 10, paddingVertical: 8 },
  devFooterText: { color: '#9BA1A6', fontSize: 12 },
});
