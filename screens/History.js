import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';

export default function HistoryScreen() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const q = query(collection(db, 'domba'), orderBy('timestamp', 'desc'));

  useEffect(() => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const hasil = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(hasil);
      setFilteredData(hasil);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const snapshot = await getDocs(q);
      const hasil = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(hasil);
      filterData(searchQuery, hasil);
    } catch (error) {
      console.error('Gagal refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Yakin ingin menghapus data ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'domba', id));
              // onSnapshot akan otomatis update
            } catch (error) {
              console.error('Gagal menghapus data:', error);
              Alert.alert('Error', 'Gagal menghapus data.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const filterData = (queryText, fullData = data) => {
    const filtered = fullData.filter((item) =>
      item.idDomba?.toLowerCase().includes(queryText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterData(text);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📚 Riwayat Input Berat Domba</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Cari ID Domba..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemText}>🐑 ID Domba: {item.idDomba}</Text>
            <Text style={styles.itemText}>⚖️ Berat: {item.berat} kg</Text>
            <Text style={styles.itemDate}>
              🕒 {item.timestamp?.seconds
                ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                : 'Tidak ada waktu'}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 32 }}>
            Tidak ada data ditemukan.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3EDC8', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 12,
    color: '#1E293B',
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  itemText: { fontSize: 15, color: '#374151', marginBottom: 4 },
  itemDate: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
