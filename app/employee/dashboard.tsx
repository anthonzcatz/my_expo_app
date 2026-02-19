import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
  });

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
        
        const rawJoinDate = user?.employee?.date_hired || 'Not specified';
        console.log('Raw join date from database:', rawJoinDate);
        
        const newEmployeeData = {
          name: user.employee ? 
            (() => {
              const firstName = user.employee.first_name || '';
              const middleName = user.employee.middle_name;
              const lastName = user.employee.last_name || '';
              
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
          position: user.employee?.position_name || 'Employee',
          department: user.employee?.department_name || 'General Department',
          employeeId: user?.bio_id ? `EMP-${String(user.bio_id).padStart(4, '0')}` : 'EMP-000',
          joinDate: rawJoinDate,
          joinDateFormatted: formatDate(rawJoinDate),
          serviceYears: calculateService(rawJoinDate),
          status: user.employee?.employment_status_name || 'Active',
          // Additional data for display
          email: user.employee?.b_email || 'Not specified',
          contact: user.employee?.b_cont_no || 'Not specified',
          address: user.employee?.b_permanent_address || 'Not specified',
          subDepartment: user.employee?.sub_department_name || 'None',
          dailyRate: user.employee?.daily_rate ? `₱${user.employee.daily_rate}` : 'Not specified',
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
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate data refresh but maintain the same data format
      setEmployeeData(prev => {
        const updatedData = { ...prev };
        // Just refresh the service calculation in case date changed
        if (prev.joinDate !== 'Not specified') {
          updatedData.serviceYears = calculateService(prev.joinDate);
        }
        return updatedData;
      });
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: Math.floor(Math.random() * 20) + ' days'
      })));
      setRefreshing(false);
    }, 2000);
  };

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
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader 
        title="Employee Portal" 
        subtitle="Dashboard" 
        showLogout={true}
        onLogout={handleLogout}
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
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.employeeInfo}>
              <ThemedText style={styles.employeeName}>{employeeData.name}</ThemedText>
              <ThemedText style={styles.employeePosition}>{employeeData.position}</ThemedText>
              <View style={styles.departmentRow}>
                <ThemedText style={styles.employeeDepartment}>{employeeData.department}</ThemedText>
                {employeeData.subDepartment && employeeData.subDepartment !== 'None' && (
                  <>
                    <ThemedText style={styles.departmentSeparator}> / </ThemedText>
                    <ThemedText style={styles.employeeSubDepartment}>{employeeData.subDepartment}</ThemedText>
                  </>
                )}
              </View>
            </View>
            <View style={styles.statusBadge}>
              <ThemedText style={styles.statusText}>{employeeData.status}</ThemedText>
            </View>
          </View>
          <View style={styles.employeeDetails}>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Employee ID:</ThemedText>
              <ThemedText style={styles.detailValue}>{employeeData.employeeId}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Join Date:</ThemedText>
              <ThemedText style={styles.detailValue}>{employeeData.joinDateFormatted}</ThemedText>
            </View>
            <View style={styles.detailItem}>
              <ThemedText style={styles.detailLabel}>Service:</ThemedText>
              <ThemedText style={styles.detailValue}>{employeeData.serviceYears}</ThemedText>
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
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  employeeCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  employeePosition: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
    color: '#000000',
  },
  employeeDepartment: {
    fontSize: 12,
    opacity: 0.6,
    color: '#000000',
  },
  departmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  departmentSeparator: {
    fontSize: 12,
    opacity: 0.4,
    color: '#000000',
    marginHorizontal: 4,
  },
  employeeSubDepartment: {
    fontSize: 11,
    opacity: 0.5,
    color: '#000000',
    fontStyle: 'italic',
  },
  statusBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  employeeDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
    color: '#000000',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  statsContainer: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    color: '#000000',
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
    fontSize: 14,
    fontWeight: '600',
  },
  activitiesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  activityIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  activityDescription: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
    color: '#000000',
  },
  activityDate: {
    fontSize: 11,
    opacity: 0.5,
    color: '#000000',
  },
  quickActionsContainer: {
    margin: 16,
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    textAlign: 'center',
  },
  // Notification styles
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 10,
    color: '#999',
  },
  // Announcement styles
  announcementItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  announcementMessage: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  announcementDate: {
    fontSize: 10,
    color: '#999',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
