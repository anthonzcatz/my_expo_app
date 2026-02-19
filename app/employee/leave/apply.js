import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

export default function ApplyLeaveScreen({ onBack }) {
  const [reason, setReason] = React.useState('');

  const onSubmit = () => {
    if (!reason.trim()) {
      Alert.alert('Missing details', 'Please enter a leave reason.');
      return;
    }
    Alert.alert('Submitted', 'Your leave application (demo) was submitted.');
    setReason('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apply Leave</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Reason</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reason"
          value={reason}
          onChangeText={setReason}
          placeholderTextColor="#999"
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.secondaryButton} onPress={onBack}>
        <Text style={styles.secondaryText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 100,
    fontSize: 16,
    color: '#111827',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});
