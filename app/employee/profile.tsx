import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { API_ENDPOINTS, IMAGE_URLS } from '@/config/api';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployeeProfile() {
  const insets = useSafeAreaInsets();
  const { user, isLoading: authLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [refreshTimestamp, setRefreshTimestamp] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedData, setEditedData] = useState({
    email: '',
    phone: '',
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
  });
  const [employeeData, setEmployeeData] = useState({
    name: 'Loading...',
    position: 'Loading...',
    department: 'Loading...',
    employeeId: 'Loading...',
    email: 'Loading...',
    phone: 'Loading...',
    address: 'Loading...',
    joinDate: 'Loading...',
    birthDate: 'Loading...',
    emergencyContact: 'Loading...',
    civilStatus: 'Loading...',
    religion: 'Loading...',
    citizenship: 'Loading...',
    height: 'Loading...',
    weight: 'Loading...',
    sss: 'Loading...',
    philhealth: 'Loading...',
    pagibig: 'Loading...',
    tin: 'Loading...',
    user_img: '', // Add user_img field to state
  });

  // Global state for real-time updates across all components
  const [globalImageUpdate, setGlobalImageUpdate] = useState(0);

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

  // Format date function (same as dashboard)
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Not specified') return 'Not specified';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Not specified';
      }
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${month}, ${day}, ${year}`;
    } catch (error) {
      return 'Not specified';
    }
  };

  // Get employee image URL (same as dashboard)
  const getEmployeeImageUrl = () => {
    // Prioritize employeeData for real-time updates, fallback to auth context
    const userImg = employeeData.user_img || (user?.employee as any)?.user_img;
    if (userImg) {
      const imageUrl = `${IMAGE_URLS.USER_IMAGES}/${userImg}`;
      console.log('Profile: Getting image URL:', imageUrl, 'global update:', globalImageUpdate);
      return imageUrl;
    }
    return undefined;
  };

  // Fetch employee data from API
  const fetchEmployeeData = async () => {
    if (!user?.bio_id) return;
    
    try {
      const response = await fetch(`${API_ENDPOINTS.PROFILE}?bio_id=${user.bio_id}`);
      const result = await response.json();
      
      if (result.ok && result.employee) {
        const emp = result.employee;
        
        // Format employee name (same as dashboard)
        const firstName = String(emp.first_name ?? '');
        const middleName = String(emp.middle_name ?? '');
        const lastName = String(emp.last_name ?? '');
        
        let formattedName = firstName;
        if (middleName && middleName.trim()) {
          formattedName += ` ${middleName.trim().charAt(0).toUpperCase()}.`;
        }
        if (lastName) {
          formattedName += ` ${lastName}`;
        }
        
        setEmployeeData({
          name: formattedName.trim() || user?.user_name || 'Unknown Employee',
          position: String(emp.position_name ?? 'Employee'),
          department: String(emp.department_name ?? 'General Department'),
          employeeId: user?.bio_id ? `EMP-${String(user.bio_id).padStart(4, '0')}` : 'EMP-000',
          email: String(emp.b_email ?? 'Not specified'),
          phone: String(emp.b_cont_no ?? 'Not specified'),
          address: String(emp.b_permanent_address ?? 'Not specified'),
          joinDate: formatDate(emp.date_hired),
          birthDate: formatDate(emp.b_date),
          emergencyContact: `${emp.emergency_contact_name || 'Not specified'} - ${emp.emergency_contact_number || 'Not specified'}`,
          civilStatus: String(emp.b_civil_status ?? 'Not specified'),
          religion: String(emp.b_religion ?? 'Not specified'),
          citizenship: String(emp.b_citizenship ?? 'Not specified'),
          height: String(emp.b_height ?? 'Not specified'),
          weight: String(emp.b_weight ?? 'Not specified'),
          sss: String(emp.b_sss ?? 'Not specified'),
          philhealth: String(emp.b_philhealth ?? 'Not specified'),
          pagibig: String(emp.b_pagibig ?? 'Not specified'),
          tin: String(emp.b_tinnumber ?? 'Not specified'),
          user_img: String(emp.user_img ?? ''), // Add user_img from API response
        });
      }
    } catch (error) {
      console.error('Failed to fetch employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchEmployeeData();
    }
  }, [user, authLoading]);

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  // Image update flow
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const uploadImage = async (uri: string) => {
    try {
      setUpdating(true);
      console.log('Starting image upload for URI:', uri);
      
      // Create FormData with proper format
      const form = new FormData();
      // Generate filename with timestamp: user_{bio_id}_{timestamp}.jpg
      const timestamp = Date.now();
      const fileName = `user_${user?.bio_id || '1'}_${timestamp}.jpg`;
      
      console.log('Generated filename:', fileName);
      
      // Add image file with correct format for React Native
      form.append('image', {
        uri: uri,
        type: 'image/jpeg',
        name: fileName,
      } as any);
      form.append('bio_id', String(user?.bio_id || ''));
      form.append('filename', fileName); // Add filename for backend reference

      console.log('Uploading to:', API_ENDPOINTS.UPLOAD_IMAGE);
      
      const res = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      });
      
      console.log('Upload response status:', res.status);
      const json = await res.json();
      console.log('Upload response:', json);
      
      if (!json?.ok) {
        throw new Error(json?.error || 'Upload failed');
      }

      // Update employee table with the new filename
      console.log('Updating employee table with image filename...');
      
      // Skip separate database update since upload_image.php now handles it
      console.log('Database update handled by upload_image.php');
      
      setSelectedImage(null);
      
      // Force refresh the employee data to get the updated image
      console.log('Fetching updated employee data...');
      await fetchEmployeeData();
      
      // Trigger global image update for all components
      const newGlobalTimestamp = Date.now();
      setGlobalImageUpdate(newGlobalTimestamp);
      setRefreshTimestamp(newGlobalTimestamp);
      
      // Notify other components via localStorage
      try {
        localStorage.setItem('globalImageUpdate', newGlobalTimestamp.toString());
        console.log('Global image update notification sent via localStorage');
      } catch (e) {
        console.log('LocalStorage not available, using state only');
      }
      
      console.log('Global image update triggered:', newGlobalTimestamp);
      
      // Wait a moment for the state to update
      setTimeout(() => {
        const imageUrl = getEmployeeImageUrl();
        console.log('Final image URL after update:', imageUrl);
        Alert.alert('Success', 'Profile photo updated');
      }, 500);
    } catch (e) {
      console.error('uploadImage error:', e);
      Alert.alert('Error', `Failed to update image: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
  };

  const pickImageFromCamera = async () => {
    try {
      const granted = await requestCameraPermission();
      if (!granted) {
        Alert.alert('Permission required', 'Camera permission is required.');
        return;
      }
      
      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      
      console.log('Camera result:', result);
      
      if (!result.canceled && result.assets?.[0]?.uri) {
        console.log('Image selected from camera:', result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      } else {
        console.log('Camera operation cancelled or failed');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const granted = await requestMediaLibraryPermission();
      if (!granted) {
        Alert.alert('Permission required', 'Gallery permission is required.');
        return;
      }
      
      console.log('Launching gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      
      console.log('Gallery result:', result);
      
      if (!result.canceled && result.assets?.[0]?.uri) {
        console.log('Image selected from gallery:', result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      } else {
        console.log('Gallery operation cancelled or failed');
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert('Update Profile Picture', 'Choose a source', [
      { text: 'Camera', onPress: pickImageFromCamera },
      { text: 'Gallery', onPress: pickImageFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Start editing profile
  const handleEditProfile = () => {
    setEditing(true);
    setEditedData({
      email: employeeData.email,
      phone: employeeData.phone,
      address: employeeData.address,
      emergencyContactName: employeeData.emergencyContact.split(' - ')[0] || '',
      emergencyContactNumber: employeeData.emergencyContact.split(' - ')[1] || '',
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditing(false);
    setSelectedImage(null);
    setEditedData({
      email: '',
      phone: '',
      address: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
    });
  };

  // Update profile data (without image upload for now)
  const updateProfile = async () => {
    setUpdating(true);
    
    try {
      // Update profile data
      const updateData = {
        bio_id: user?.bio_id,
        email: editedData.email,
        phone: editedData.phone,
        address: editedData.address,
        emergency_contact_name: editedData.emergencyContactName,
        emergency_contact_number: editedData.emergencyContactNumber,
      };

      const response = await fetch(`${API_ENDPOINTS.PROFILE.replace('/profile.php', '/update_profile.php')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      
      if (result.ok) {
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => {
            setEditing(false);
            setSelectedImage(null);
            fetchEmployeeData(); // Refresh data
          }}
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const onRefresh = () => {
    try {
      setRefreshing(true);
      fetchEmployeeData().finally(() => {
        setRefreshing(false);
      });
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      setRefreshing(false);
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
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.avatarImage} />
              ) : getEmployeeImageUrl() ? (
                <Image 
                  source={{ 
                    uri: `${getEmployeeImageUrl()}?t=${globalImageUpdate || refreshTimestamp}`
                  }} 
                  style={styles.avatarImage} 
                  onError={() => console.log('Profile: Image failed to load')}
                  onLoad={() => console.log('Profile: Image loaded successfully')}
                />
              ) : (
                <Ionicons name="person" size={60} color="#FFFFFF" />
              )}
            </View>
            <TouchableOpacity style={styles.editAvatarButton} onPress={showImagePickerOptions}>
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
          <ProfileItem icon="heart-outline" label="Civil Status" value={employeeData.civilStatus} />
          <ProfileItem icon="leaf-outline" label="Religion" value={employeeData.religion} />
          <ProfileItem icon="flag-outline" label="Citizenship" value={employeeData.citizenship} />
          <ProfileItem icon="man-outline" label="Height" value={employeeData.height} />
          <ProfileItem icon="scale-outline" label="Weight" value={employeeData.weight} />
        </View>

        {/* Work Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Work Information</ThemedText>
          <ProfileItem icon="card-outline" label="Employee ID" value={employeeData.employeeId} />
          <ProfileItem icon="briefcase-outline" label="Position" value={employeeData.position} />
          <ProfileItem icon="business-outline" label="Department" value={employeeData.department} />
          <ProfileItem icon="calendar-outline" label="Join Date" value={employeeData.joinDate} />
        </View>

        {/* Government Information */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Government Information</ThemedText>
          <ProfileItem icon="document-text-outline" label="SSS" value={employeeData.sss} />
          <ProfileItem icon="medical-outline" label="PhilHealth" value={employeeData.philhealth} />
          <ProfileItem icon="home-outline" label="Pag-IBIG" value={employeeData.pagibig} />
          <ProfileItem icon="receipt-outline" label="TIN" value={employeeData.tin} />
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Emergency Contact</ThemedText>
          <ProfileItem icon="call-outline" label="Contact Person" value={employeeData.emergencyContact} />
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
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
