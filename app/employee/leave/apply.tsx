import { useState } from 'react';
import { Alert, StyleSheet, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

export default function ApplyLeaveScreen() {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState<string>('Vacation');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    // Deterministic: always return to Leave tab
    router.replace('/employee/leave' as any);
  };

  const onSubmit = async () => {
    if (!type || !startDate || !endDate || !reason) {
      Alert.alert('Incomplete', 'Please fill out all fields.');
      return;
    }
    setSubmitting(true);
    try {
      // TODO: call API to submit leave
      await new Promise((r) => setTimeout(r, 1200));
      Alert.alert('Submitted', 'Your leave request has been submitted.', [
        { text: 'OK', onPress: () => router.replace('/employee/leave' as any) },
      ]);
    } catch (e) {
      Alert.alert('Failed', 'Could not submit leave. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }] }>
      {/* Simple header row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Apply for Leave</ThemedText>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <ThemedText style={styles.label}>Leave Type</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="e.g. Vacation / Sick / Personal"
          placeholderTextColor="#999"
          value={type}
          onChangeText={setType}
        />

        <ThemedText style={styles.label}>Start Date</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={startDate}
          onChangeText={setStartDate}
        />

        <ThemedText style={styles.label}>End Date</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={endDate}
          onChangeText={setEndDate}
        />

        <ThemedText style={styles.label}>Reason</ThemedText>
        <TextInput
          style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
          multiline
          placeholder="Provide brief reason"
          placeholderTextColor="#999"
          value={reason}
          onChangeText={setReason}
        />

        <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.7 }]} disabled={submitting} onPress={onSubmit}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="paper-plane-outline" size={18} color="#fff" />
              <ThemedText style={styles.submitText}>Submit Request</ThemedText>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF0',
  },
  headerBtn: { width: 40, height: 24, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
  scroll: { flex: 1 },
  content: { padding: 16 },
  label: { fontSize: 13, color: '#666', marginTop: 10, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000',
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
