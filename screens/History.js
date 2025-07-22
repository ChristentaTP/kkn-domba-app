import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getAllWeights,
  updateWeight,
  deleteWeight,
} from '../services/sheepData';

const CustomButton = ({ title, onPress, color = '#354259' }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.customBtn, { backgroundColor: color }]}
  >
    <Text style={styles.customBtnText}>{title}</Text>
  </TouchableOpacity>
);

export default function History() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSheep, setSelectedSheep] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingItem, setEditingItem] = useState(null);
  const [editWeight, setEditWeight] = useState('');
  const [editFeed, setEditFeed] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const fetchData = async () => {
        try {
          const weights = await getAllWeights();
          if (active) setData(weights);
        } catch (err) {
          console.error('❌ Gagal ambil data:', err);
        }
      };
      fetchData();
      return () => (active = false);
    }, [])
  );

  useEffect(() => {
    let list = [...data];
    if (selectedSheep !== 'all') list = list.filter(it => it.sheep === selectedSheep);
    list.sort((a, b) => (sortOrder === 'asc'
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)));
    setFilteredData(list);
  }, [data, selectedSheep, sortOrder]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      <Text>Domba: {item.sheep}</Text>
      <Text>Berat: {item.weight} kg</Text>
      <Text>Pakan: {item.feed}</Text>

      <View style={styles.btnRow}>
        <CustomButton
          title="Edit"
          onPress={() => {
            setEditingItem(item);
            setEditWeight(String(item.weight));
            setEditFeed(item.feed);
          }}
        />
        <CustomButton
          title="Hapus"
          color="#FF6363"
          onPress={() =>
            Alert.alert(
              'Konfirmasi Hapus',
              `Yakin hapus data ${item.sheep} (${item.date})?`,
              [
                { text: 'Batal', style: 'cancel' },
                {
                  text: 'Hapus',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteWeight(item.id);
                      setData(await getAllWeights());
                    } catch (err) {
                      console.error('❌ Gagal hapus:', err);
                    }
                  },
                },
              ],
              { cancelable: true }
            )
          }
        />
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.title}>Riwayat Pertumbuhan</Text>

      <Text style={styles.label}>Filter Domba :</Text>
      <View style={styles.dropdown}>
        <Picker selectedValue={selectedSheep} onValueChange={setSelectedSheep}>
          <Picker.Item label="Semua" value="all" />
          <Picker.Item label="Domba A" value="Domba A" />
          <Picker.Item label="Domba B" value="Domba B" />
          <Picker.Item label="Domba C" value="Domba C" />
          <Picker.Item label="Domba D" value="Domba D" />
        </Picker>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.label}>Urutkan Tanggal :</Text>
        <CustomButton
          title={sortOrder === 'asc' ? 'Terlama ➜ Terbaru' : 'Terbaru ➜ Terlama'}
          onPress={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
        />
      </View>

      {editingItem && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Edit Data</Text>

          <Text style={styles.modalLabel}>Berat (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={editWeight}
            onChangeText={setEditWeight}
          />

          <Text style={styles.modalLabel}>Pakan</Text>
          <View style={styles.dropdown}>
            <Picker selectedValue={editFeed} onValueChange={setEditFeed}>
              <Picker.Item label="Pakan Asli" value="pakan asli" />
              <Picker.Item label="Pakan Fermentasi" value="pakan fermentasi" />
            </Picker>
          </View>

          <View style={styles.modalBtnRow}>
            <CustomButton
              title="Simpan"
              color="#607274"
              onPress={async () => {
                try {
                  await updateWeight(editingItem.id, {
                    weight: parseFloat(editWeight),
                    feed: editFeed,
                  });
                  setEditingItem(null);
                  setData(await getAllWeights());
                } catch (err) {
                  console.error('❌ Gagal update:', err);
                }
              }}
            />
            <CustomButton
              title="Batal"
              color="#999"
              onPress={() => setEditingItem(null)}
            />
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3EDC8' },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1E293B',
  },
  card: {
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  date: { fontWeight: 'bold', color: '#374151', marginBottom: 4 },
  label: { marginTop: 12, fontWeight: '600', color: '#374151' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 6,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modal: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  modalTitle: { fontWeight: '700', fontSize: 16, marginBottom: 12, color: '#1E293B' },
  modalLabel: { fontWeight: '600', marginTop: 8, color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  customBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  customBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
