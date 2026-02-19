import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

export default function EmployeeLeave() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState({
    sick: 5,
    vacation: 10,
    personal: 3,
    total: 18,
  });

  const [leaveRequests] = useState([
    {
      id: 1,
      type: 'Sick Leave',
      startDate: '2024-02-20',
      endDate: '2024-02-21',
      days: 2,
      reason: 'Fever and flu symptoms',
      status: 'pending',
      appliedOn: '2024-02-18',
    },
    {
      id: 2,
      type: 'Vacation Leave',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      days: 3,
      reason: 'Family vacation',
      status: 'approved',
      appliedOn: '2024-01-10',
    },
    {
      id: 3,
      type: 'Personal Leave',
      startDate: '2024-01-05',
      endDate: '2024-01-05',
      days: 1,
      reason: 'Personal matters',
      status: 'rejected',
      appliedOn: '2024-01-03',
    },
  ]);

  const LeaveBalanceCard = ({ type, days, color }: { type: string; days: number; color: string }) => (
    <View style={[styles.balanceCard, { borderLeftColor: color }]}>
      <ThemedText style={styles.balanceType}>{type}</ThemedText>
      <ThemedText style={styles.balanceDays}>{days} days</ThemedText>
    </View>
  );

  const LeaveRequestItem = ({ request }: { request: any }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestHeader}>
        <ThemedText style={styles.requestType}>{request.type}</ThemedText>
        <View style={[
          styles.statusBadge,
          { backgroundColor: request.status === 'approved' ? '#34C759' : 
                            request.status === 'pending' ? '#FF9500' : '#FF3B30' }
        ]}>
          <ThemedText style={styles.statusText}>{request.status}</ThemedText>
        </View>
      </View>
      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <ThemedText style={styles.detailText}>
            {request.startDate} - {request.endDate} ({request.days} days)
          </ThemedText>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={16} color="#666" />
          <ThemedText style={styles.detailText}>{request.reason}</ThemedText>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <ThemedText style={styles.detailText}>Applied on {request.appliedOn}</ThemedText>
        </View>
      </View>
    </View>
  );

  const handleNewRequest = () => {
    router.push('/employee/leave/apply' as any);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // simulate refetch leave balances and requests
      setLeaveBalance(lb => ({ ...lb }));
      setRefreshing(false);
    }, 1200);
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Leave Balance Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Leave Balance</ThemedText>
          <View style={styles.totalBalanceCard}>
            <ThemedText style={styles.totalBalanceLabel}>Total Leave Balance</ThemedText>
            <ThemedText style={styles.totalBalanceDays}>{leaveBalance.total} days</ThemedText>
          </View>
          <View style={styles.balanceGrid}>
            <LeaveBalanceCard type="Sick Leave" days={leaveBalance.sick} color="#FF3B30" />
            <LeaveBalanceCard type="Vacation Leave" days={leaveBalance.vacation} color="#007AFF" />
            <LeaveBalanceCard type="Personal Leave" days={leaveBalance.personal} color="#34C759" />
          </View>
        </View>

        {/* New Request Button */}
        <TouchableOpacity style={styles.newRequestButton} onPress={handleNewRequest}>
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <ThemedText style={styles.newRequestText}>Request Leave</ThemedText>
        </TouchableOpacity>

        {/* Leave Requests History */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Leave Requests</ThemedText>
          {leaveRequests.map((request) => (
            <LeaveRequestItem key={request.id} request={request} />
          ))}
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
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000000',
  },
  totalBalanceCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  totalBalanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  totalBalanceDays: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  balanceType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  balanceDays: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  newRequestButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRequestText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  requestItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  requestType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  requestDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});
