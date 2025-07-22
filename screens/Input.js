import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { saveWeight } from '../services/sheepData';

export default function Input() {
  const [date, setDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sheep, setSheep] = useState('Domba A');
  const [weight, setWeight] = useState('');
  const [feed, setFeed] = useState('Pakan Asli');

  const handleSave = async () => {
    const numWeight = parseFloat(weight);
    if (!date || isNaN(numWeight) || numWeight <= 0) {
      Alert.alert('❗ Berat harus berupa angka lebih dari 0');
      return;
    }

    try {
      await saveWeight(date, sheep, numWeight, feed);
      Alert.alert('✅ Data berhasil disimpan!');
      setDate('');
      setWeight('');
      setFeed('Pakan Asli');
    } catch (err) {
      console.error('❌ Gagal simpan:', err);
      Alert.alert('Gagal simpan data');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setDate(formatted);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📝 Input Data Ternak</Text>

        {/* === Tanggal === */}
        <Text style={styles.label}>Tanggal</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          <Text style={{ color: date ? '#000' : '#aaa' }}>
            {date || 'Pilih Tanggal'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        {/* === Domba === */}
        <Text style={styles.label}>Pilih Domba</Text>
        <View style={styles.dropdown}>
          <Picker selectedValue={sheep} onValueChange={setSheep}>
            <Picker.Item label="Domba A" value="Domba A" />
            <Picker.Item label="Domba B" value="Domba B" />
            <Picker.Item label="Domba C" value="Domba C" />
            <Picker.Item label="Domba D" value="Domba D" />
          </Picker>
        </View>

        {/* === Berat === */}
        <Text style={styles.label}>Berat (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="Contoh: 35.5"
          placeholderTextColor="#aaa"
        />

        {/* === Pakan === */}
        <Text style={styles.label}>Jenis Pakan</Text>
        <View style={styles.dropdown}>
          <Picker selectedValue={feed} onValueChange={setFeed}>
            <Picker.Item label="Pakan Asli" value="Pakan Asli" />
            <Picker.Item label="Pakan Fermentasi" value="Pakan Fermentasi" />
          </Picker>
        </View>

        {/* === Tombol Simpan === */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>💾 Simpan Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3EDC8',
  },
  container: {
    padding: 20,
    backgroundColor: '#F3EDC8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E293B',
  },
  label: {
    marginTop: 16,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
