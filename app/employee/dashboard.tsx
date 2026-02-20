import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IMAGE_URLS } from '@/config/api';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployeeDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to format date as "Jan, 09 2021"
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Not specified') return 'Not specified';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log('Invalid date string:', dateString);
        return 'Not specified';
      }
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      
      const formattedDate = `${month}, ${day}, ${year}`;
      console.log('Formatted date:', dateString, '→', formattedDate);
      
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Not specified';
    }
  };

  // Helper function to calculate years and months of service
  const calculateService = (dateHired: string) => {
    if (!dateHired || dateHired === 'Not specified') return 'Not specified';
    
    const hireDate = new Date(dateHired);
    const today = new Date();
    
    let years = today.getFullYear() - hireDate.getFullYear();
    let months = today.getMonth() - hireDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
    }
  };
  
  const [employeeData, setEmployeeData] = useState({
    name: 'Loading...',
    position: 'Employee',
    department: 'General Department',
    employeeId: 'EMP-000',
    joinDate: 'Not specified',
    joinDateFormatted: 'Not specified',
    serviceYears: 'Not specified',
    status: 'Active',
    email: 'Not specified',
    contact: 'Not specified',
    address: 'Not specified',
    subDepartment: 'None',
    dailyRate: 'Not specified',
    user_img: '', // Add user_img field for real-time updates
  });

  // State for forcing re-render when image updates
  const [imageUpdateTrigger, setImageUpdateTrigger] = useState(0);

  useEffect(() => {
    // Only initialize when auth context is done loading
    if (authLoading) {
      console.log('Dashboard: Auth context still loading...');
      return;
    }

    // Initialize employee data when user is available
    const initializeEmployeeData = () => {
      console.log('Dashboard: Initializing data, user available:', !!user);
      console.log('Dashboard: Auth loading complete:', !authLoading);
      
      if (user) {
        console.log('Dashboard: User data available:', user);
        console.log('Dashboard: Employee data:', user.employee);
        
        const rawJoinDate = String(user?.employee?.date_hired ?? 'Not specified');
        console.log('Raw join date from database:', rawJoinDate);
        
        const newEmployeeData = {
          name: user.employee ? 
            (() => {
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
              
              return formattedName.trim() || 'Unknown Employee';
            })() :
            user?.user_name || 'Unknown Employee',
          position: String((user.employee as any)?.position_name ?? 'Employee'),
          department: String((user.employee as any)?.department_name ?? 'General Department'),
          employeeId: user?.bio_id ? `EMP-${String(user.bio_id).padStart(4, '0')}` : 'EMP-000',
          joinDate: rawJoinDate,
          joinDateFormatted: formatDate(rawJoinDate),
          serviceYears: calculateService(rawJoinDate),
          status: String((user.employee as any)?.employment_status_name ?? 'Active'),
          // Additional data for display
          email: String((user.employee as any)?.b_email ?? 'Not specified'),
          contact: String((user.employee as any)?.b_cont_no ?? 'Not specified'),
          address: String((user.employee as any)?.b_permanent_address ?? 'Not specified'),
          subDepartment: String((user.employee as any)?.sub_department_name ?? 'None'),
          dailyRate: (user.employee as any)?.daily_rate ? `₱${String((user.employee as any)?.daily_rate)}` : 'Not specified',
          user_img: String((user.employee as any)?.user_img ?? ''), // Add user_img from auth context
        };
        
        console.log('Dashboard: Setting employee data:', newEmployeeData);
        setEmployeeData(newEmployeeData);
      } else {
        console.log('Dashboard: No user data available, keeping defaults');
      }
      setLoading(false);
    };

    // Initialize immediately when auth is ready
    initializeEmployeeData();
  }, [user, authLoading]);

  const [stats, setStats] = useState([
    { label: 'Leave Balance', value: '12 days', icon: 'calendar-outline', color: '#007AFF' },
    { label: 'Pending Requests', value: '2', icon: 'time-outline', color: '#FF9500' },
    { label: 'Approved Leave', value: '5 days', icon: 'checkmark-circle-outline', color: '#34C759' },
    { label: 'Work Anniversary', value: '6 months', icon: 'gift-outline', color: '#FF3B30' },
  ]);

  const [notifications] = useState([
    { id: 1, title: 'Holiday Notice', message: 'Company holiday on Feb 25', time: '2 hours ago', type: 'info' },
    { id: 2, title: 'Payroll Released', message: 'January payslip is now available', time: '1 day ago', type: 'success' },
    { id: 3, title: 'Meeting Reminder', message: 'Team meeting tomorrow at 10 AM', time: '2 days ago', type: 'warning' },
  ]);

  const [announcements] = useState([
    { id: 1, title: 'New Policy Update', message: 'Remote work policy updated for 2024', date: 'Feb 15, 2024', priority: 'high' },
    { id: 2, title: 'Team Building Event', message: 'Annual team building on March 15', date: 'Feb 10, 2024', priority: 'medium' },
  ]);

  const [recentActivities] = useState([
    { id: 1, title: 'Leave Request', description: 'Sick leave - 2 days', date: '2 days ago', status: 'pending' },
    { id: 2, title: 'Profile Updated', description: 'Contact information updated', date: '1 week ago', status: 'completed' },
    { id: 3, title: 'Performance Review', description: 'Q2 2024 Review completed', date: '2 weeks ago', status: 'completed' },
    { id: 4, title: 'Training Completed', description: 'React Native Advanced Course', date: '1 month ago', status: 'completed' },
  ]);

  const handleMenuPress = () => {
    router.push('/modal');
  };

  const handleNavigate = (screen: any) => {
    router.push(screen);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/');
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate data refresh but maintain the same data format
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: Math.floor(Math.random() * 20) + ' days'
      })));
      setRefreshing(false);
    }, 2000);
  };

  // Get employee image URL
  const getEmployeeImageUrl = () => {
    // Check both employeeData state and auth context for real-time updates
    const userImg = employeeData.user_img || (user?.employee as any)?.user_img;
    if (userImg) {
      const imageUrl = `${IMAGE_URLS.USER_IMAGES}/${userImg}`;
      console.log('Dashboard: Getting image URL:', imageUrl, 'update trigger:', imageUpdateTrigger);
      return imageUrl;
    }
    return undefined;
  };

  // Listen for global image updates from profile
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if global image update happened
      const lastUpdate = localStorage.getItem('globalImageUpdate');
      if (lastUpdate) {
        console.log('Dashboard: Detected global image update, refreshing data...');
        
        // Refresh employee data from auth context
        if (user?.employee) {
          const updatedUserImg = String((user.employee as any)?.user_img ?? '');
          setEmployeeData(prev => ({ ...prev, user_img: updatedUserImg }));
        }
        
        // Force re-render by updating image trigger
        setImageUpdateTrigger(Date.now());
        
        localStorage.removeItem('globalImageUpdate');
        console.log('Dashboard: Image update processed');
      }
    }, 500); // Check every 500ms for faster updates

    return () => clearInterval(interval);
  }, [user]);

  const StatCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: item.color }]}>
      <View style={styles.statIcon}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <ThemedText style={styles.statValue}>{item.value}</ThemedText>
      <ThemedText style={styles.statLabel}>{item.label}</ThemedText>
    </TouchableOpacity>
  );

  const ActivityItem = ({ activity }: { activity: any }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons 
          name={activity.status === 'pending' ? 'time-outline' : 'checkmark-circle-outline'} 
          size={20} 
          color={activity.status === 'pending' ? '#FF9500' : '#34C759'} 
        />
      </View>
      <View style={styles.activityContent}>
        <ThemedText style={styles.activityTitle}>{activity.title}</ThemedText>
        <ThemedText style={styles.activityDescription}>{activity.description}</ThemedText>
        <ThemedText style={styles.activityDate}>{activity.date}</ThemedText>
      </View>
    </View>
  );

  const NotificationItem = ({ notification }: { notification: any }) => (
    <View style={styles.notificationItem}>
      <View style={[
        styles.notificationIcon,
        { backgroundColor: notification.type === 'success' ? '#34C759' : 
                           notification.type === 'warning' ? '#FF9500' : '#007AFF' }
      ]}>
        <Ionicons 
          name={notification.type === 'success' ? 'checkmark' : 
                notification.type === 'warning' ? 'warning' : 'information-circle'} 
          size={16} 
          color="#FFFFFF" 
        />
      </View>
      <View style={styles.notificationContent}>
        <ThemedText style={styles.notificationTitle}>{notification.title}</ThemedText>
        <ThemedText style={styles.notificationMessage}>{notification.message}</ThemedText>
        <ThemedText style={styles.notificationTime}>{notification.time}</ThemedText>
      </View>
    </View>
  );

  const AnnouncementItem = ({ announcement }: { announcement: any }) => (
    <View style={[
      styles.announcementItem,
      { borderLeftColor: announcement.priority === 'high' ? '#FF3B30' : '#FF9500' }
    ]}>
      <View style={styles.announcementContent}>
        <ThemedText style={styles.announcementTitle}>{announcement.title}</ThemedText>
        <ThemedText style={styles.announcementMessage}>{announcement.message}</ThemedText>
        <ThemedText style={styles.announcementDate}>{announcement.date}</ThemedText>
      </View>
      <View style={[
        styles.priorityBadge,
        { backgroundColor: announcement.priority === 'high' ? '#FF3B30' : '#FF9500' }
      ]}>
        <ThemedText style={styles.priorityText}>
          {announcement.priority === 'high' ? 'HIGH' : 'MED'}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <AppHeader 
        title="Employee Portal" 
        subtitle="Dashboard" 
        showLogout={true}
        onLogout={handleLogout}
        onMenuPress={handleMenuPress}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Loading dashboard...</ThemedText>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        {/* Employee Info Card */}
        <View style={styles.employeeCard}>
          <View style={styles.employeeHeader}>
            <View style={styles.avatar}>
              {getEmployeeImageUrl() ? (
                <Image
                  source={{ 
                    uri: `${getEmployeeImageUrl()}?t=${imageUpdateTrigger}`
                  }}
                  style={styles.avatarImage}
                  onError={() => console.log('Dashboard: Image failed to load')}
                  onLoad={() => console.log('Dashboard: Image loaded successfully')}
                />
              ) : (
                <Ionicons name="person" size={28} color="#FFFFFF" />
              )}
            </View>
            <View style={styles.employeeInfo}>
              <ThemedText style={styles.employeeName}>{employeeData.name}</ThemedText>
              <ThemedText style={styles.employeePosition}>{employeeData.position} • {employeeData.department}</ThemedText>
            </View>
            <TouchableOpacity onPress={() => router.push('/employee/profile')}>
              <ThemedText style={styles.viewProfile}>View</ThemedText>
            </TouchableOpacity>
          </View>
          
          {/* Compact Details */}
          <View style={styles.compactDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>ID</ThemedText>
                <ThemedText style={styles.detailValue}>{employeeData.employeeId}</ThemedText>
              </View>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Status</ThemedText>
                <View style={styles.statusBadge}>
                  <ThemedText style={styles.statusText}>{employeeData.status}</ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Joined</ThemedText>
                <ThemedText style={styles.detailValue}>{employeeData.joinDateFormatted}</ThemedText>
              </View>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Service</ThemedText>
                <ThemedText style={styles.detailValue}>{employeeData.serviceYears}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <ThemedText style={styles.sectionTitle}>Quick Stats</ThemedText>
          <View style={styles.statsGrid}>
            {stats.map((item, index) => (
              <StatCard key={index} item={item} />
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.activitiesContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Activities</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesList}>
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.quickActionText}>Request Leave</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="document-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.quickActionText}>View Payslip</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.quickActionText}>Contact HR</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="settings-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.quickActionText}>Settings</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  employeeCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    // For web compatibility
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
    color: '#1A1A1A',
  },
  employeePosition: {
    fontSize: 12,
    color: '#666',
  },
  viewProfile: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  compactDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  statsContainer: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1A1A1A',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    // For web compatibility
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    color: '#6B7280',
    textAlign: 'center',
  },
  activitiesContainer: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
  activitiesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    // For web compatibility
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  activityDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  announcementsContainer: {
    margin: 16,
  },
  announcementItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    // For web compatibility
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1A1A1A',
  },
  announcementMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  announcementDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  quickActionsContainer: {
    margin: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    // For web compatibility
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
  },
  quickActionText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  // Notification styles
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    // For web compatibility
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  notificationMessage: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
});
