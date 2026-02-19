import { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

export default function EmployeePayslip() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [payslips] = useState([
    {
      id: 1,
      month: 'January 2024',
      basicSalary: 50000,
      allowances: 5000,
      overtime: 2000,
      deductions: 8000,
      netSalary: 49000,
      status: 'available',
      downloadDate: '2024-02-05',
    },
    {
      id: 2,
      month: 'December 2023',
      basicSalary: 50000,
      allowances: 5000,
      overtime: 1500,
      deductions: 7500,
      netSalary: 49000,
      status: 'available',
      downloadDate: '2024-01-05',
    },
    {
      id: 3,
      month: 'November 2023',
      basicSalary: 48000,
      allowances: 5000,
      overtime: 3000,
      deductions: 7200,
      netSalary: 48800,
      status: 'available',
      downloadDate: '2023-12-05',
    },
  ]);

  const PayslipCard = ({ payslip }: { payslip: any }) => (
    <View style={styles.payslipCard}>
      <View style={styles.payslipHeader}>
        <View>
          <ThemedText style={styles.payslipMonth}>{payslip.month}</ThemedText>
          <ThemedText style={styles.payslipDate}>Available: {payslip.downloadDate}</ThemedText>
        </View>
        <View style={styles.amountContainer}>
          <ThemedText style={styles.amountLabel}>Net Salary</ThemedText>
          <ThemedText style={styles.amountValue}>₱{payslip.netSalary.toLocaleString()}</ThemedText>
        </View>
      </View>
      
      <View style={styles.salaryBreakdown}>
        <View style={styles.breakdownRow}>
          <ThemedText style={styles.breakdownLabel}>Basic Salary</ThemedText>
          <ThemedText style={styles.breakdownValue}>₱{payslip.basicSalary.toLocaleString()}</ThemedText>
        </View>
        <View style={styles.breakdownRow}>
          <ThemedText style={styles.breakdownLabel}>Allowances</ThemedText>
          <ThemedText style={styles.breakdownValue}>₱{payslip.allowances.toLocaleString()}</ThemedText>
        </View>
        <View style={styles.breakdownRow}>
          <ThemedText style={styles.breakdownLabel}>Overtime</ThemedText>
          <ThemedText style={styles.breakdownValue}>₱{payslip.overtime.toLocaleString()}</ThemedText>
        </View>
        <View style={styles.breakdownRow}>
          <ThemedText style={styles.breakdownLabel}>Deductions</ThemedText>
          <ThemedText style={[styles.breakdownValue, { color: '#FF3B30' }]}>
            -₱{payslip.deductions.toLocaleString()}
          </ThemedText>
        </View>
      </View>
      
      <TouchableOpacity style={styles.downloadButton}>
        <Ionicons name="download-outline" size={20} color="#007AFF" />
        <ThemedText style={styles.downloadButtonText}>Download PDF</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const handleDownload = (month: string) => {
    Alert.alert('Download Payslip', `Downloading payslip for ${month}...`);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // simulate refetch payslips
      setRefreshing(false);
    }, 1200);
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <ThemedText style={styles.summaryTitle}>Salary Summary</ThemedText>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Current Month</ThemedText>
              <ThemedText style={styles.summaryValue}>₱49,000</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>YTD Total</ThemedText>
              <ThemedText style={styles.summaryValue}>₱294,000</ThemedText>
            </View>
          </View>
        </View>

        {/* Payslips List */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Payslip History</ThemedText>
          {payslips.map((payslip) => (
            <PayslipCard key={payslip.id} payslip={payslip} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="mail-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>Email Payslip</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calculator-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>Tax Calculator</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>Salary Info</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="document-text-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>13th Month</ThemedText>
            </TouchableOpacity>
          </View>
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
  summaryCard: {
    backgroundColor: '#007AFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
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
  payslipCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  payslipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  payslipMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  payslipDate: {
    fontSize: 12,
    color: '#666',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  salaryBreakdown: {
    marginBottom: 15,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  downloadButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
    textAlign: 'center',
  },
});
