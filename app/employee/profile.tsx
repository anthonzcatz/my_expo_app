import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployeeProfile() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: 'John Doe',
    position: 'Senior Developer',
    department: 'IT Department',
    employeeId: 'EMP-2024-001',
    email: 'john.doe@company.com',
    phone: '+63 912 345 6789',
    address: '123 Main St, Manila, Philippines',
    joinDate: 'January 15, 2024',
    birthDate: 'March 15, 1990',
    emergencyContact: 'Jane Doe - +63 912 345 6790',
  });

  const ProfileItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.profileItem}>
      <View style={styles.profileIcon}>
        <Ionicons name={icon as any} size={20} color="#007AFF" />
      </View>
      <View style={styles.profileContent}>
        <ThemedText style={styles.profileLabel}>{label}</ThemedText>
        <ThemedText style={styles.profileValue}>{value}</ThemedText>
      </View>
    </View>
  );

  const handleEditProfile = () => {
    try {
      Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
    } catch (error) {
      console.error('Failed to edit profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Profile edit error details:', {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : 'No stack trace',
      });
      Alert.alert('Network Error', `Cannot connect to server: ${errorMessage}`);
    }
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const onRefresh = () => {
    try {
      setRefreshing(true);
      setTimeout(() => {
        // simulate fetch profile
        setRefreshing(false);
      }, 1200);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Profile refresh error details:', {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : 'No stack trace',
      });
      Alert.alert('Network Error', `Cannot connect to server: ${errorMessage}`);
    }
  };

  // Use 'any' for now so TS won't complain before Expo Router regenerates types for new routes
  const goTo = (path: any) => router.push(path as any);
  const handleLogout = () => {
    // TODO: clear auth state/token when integrated
    router.replace('/');
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={60} color="#FFFFFF" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.profileName}>{employeeData.name}</ThemedText>
          <ThemedText style={styles.profilePosition}>{employeeData.position}</ThemedText>
          <View style={styles.statusBadge}>
            <ThemedText style={styles.statusText}>Active</ThemedText>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          <ProfileItem icon="person-outline" label="Full Name" value={employeeData.name} />
          <ProfileItem icon="mail-outline" label="Email" value={employeeData.email} />
          <ProfileItem icon="call-outline" label="Phone" value={employeeData.phone} />
          <ProfileItem icon="home-outline" label="Address" value={employeeData.address} />
          <ProfileItem icon="calendar-outline" label="Birth Date" value={employeeData.birthDate} />
        </View>

        {/* Work Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Work Information</ThemedText>
          <ProfileItem icon="card-outline" label="Employee ID" value={employeeData.employeeId} />
          <ProfileItem icon="briefcase-outline" label="Department" value={employeeData.department} />
          <ProfileItem icon="calendar-outline" label="Join Date" value={employeeData.joinDate} />
          <ProfileItem icon="medal-outline" label="Position" value={employeeData.position} />
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Emergency Contact</ThemedText>
          <ProfileItem icon="call-outline" label="Contact" value={employeeData.emergencyContact} />
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color="#007AFF" />
            <ThemedText style={styles.actionButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Ionicons name="lock-closed-outline" size={20} color="#007AFF" />
            <ThemedText style={styles.actionButtonText}>Change Password</ThemedText>
          </TouchableOpacity>
          <View style={styles.quickLinksRow}>
            <TouchableOpacity style={styles.quickLink} onPress={() => goTo('/employee/memos')}>
              <Ionicons name="document-text-outline" size={20} color="#007AFF" />
              <ThemedText style={styles.quickLinkText}>Memos</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink} onPress={() => goTo('/employee/incidents')}>
              <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />
              <ThemedText style={styles.quickLinkText}>Incidents</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.quickLinksRow}>
            <TouchableOpacity style={styles.quickLink} onPress={() => goTo('/employee/awards')}>
              <Ionicons name="trophy-outline" size={20} color="#34C759" />
              <ThemedText style={styles.quickLinkText}>Awards</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLink} onPress={() => goTo('/employee/promotions')}>
              <Ionicons name="trending-up-outline" size={20} color="#FF9500" />
              <ThemedText style={styles.quickLinkText}>Promotions</ThemedText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FFE8E8' }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <ThemedText style={[styles.actionButtonText, { color: '#FF3B30' }]}>Logout</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  profilePosition: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 10,
    color: '#000000',
  },
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000000',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileContent: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
    color: '#000000',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  actionsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 12,
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  quickLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  quickLinkText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
});
