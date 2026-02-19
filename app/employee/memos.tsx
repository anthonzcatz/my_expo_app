import { useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';

export default function EmployeeMemos() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [memos] = useState([
    { id: 1, title: 'Policy Update', message: 'WFH policy updated for 2024', date: 'Feb 12, 2024' },
    { id: 2, title: 'Holiday Notice', message: 'Special non-working holiday', date: 'Feb 25, 2024' },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}> 
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}> 
        <ThemedText style={styles.pageTitle}>Memos</ThemedText>
        {memos.map((m) => (
          <View key={m.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={18} color="#007AFF" />
              <ThemedText style={styles.cardTitle}>{m.title}</ThemedText>
            </View>
            <ThemedText style={styles.cardBody}>{m.message}</ThemedText>
            <ThemedText style={styles.cardDate}>{m.date}</ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollView: { flex: 1 },
  pageTitle: { fontSize: 22, fontWeight: '700', margin: 16, color: '#000' },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  cardBody: { fontSize: 14, color: '#333', marginBottom: 6 },
  cardDate: { fontSize: 12, color: '#666' },
});
