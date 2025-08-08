import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function InputScreen() {
  const [idDomba, setIdDomba] = useState('');
  const [berat, setBerat] = useState('');

  const handleSubmit = async () => {
    if (!idDomba || !berat) {
      Alert.alert('Error', 'Harap isi semua field.');
      return;
    }

    try {
      await addDoc(collection(db, 'domba'), {
        idDomba: idDomba.trim(),
        berat: parseFloat(berat),
        timestamp: serverTimestamp(),
      });

      Alert.alert('Sukses', 'Data berhasil disimpan!');
      setIdDomba('');
      setBerat('');
    } catch (error) {
      console.error('Error menambahkan dokumen:', error);
      Alert.alert('Error', 'Gagal menyimpan data.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>📋 Input Data Domba</Text>
        <View style={styles.card}>
          <Text style={styles.label}>ID Domba</Text>
          <TextInput
            value={idDomba}
            onChangeText={setIdDomba}
            placeholder="Contoh: DMB001"
            style={styles.input}
          />

          <Text style={styles.label}>Berat (kg)</Text>
          <TextInput
            value={berat}
            onChangeText={setBerat}
            placeholder="Contoh: 32.5"
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Simpan Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F3EDC8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1E293B',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
