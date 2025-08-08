import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase'; // pastikan ini file firebase.js yang sudah initializeApp

export default function Monitor() {
  const [tegangan, setTegangan] = useState(0);
  const [status, setStatus] = useState("Memuat...");

  useEffect(() => {
    const db = getDatabase(app);
    const sensorRef = ref(db, 'sensor');

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTegangan(data.tegangan || 0);
        setStatus(data.level || "Tidak diketahui");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoring Gas Amonia</Text>
      <AnimatedCircularProgress
        size={200}
        width={15}
        fill={Math.min(tegangan * 100, 100)} // buat gauge, max 100
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
        rotation={0}
      >
        {() => (
          <Text style={styles.gasValue}>{tegangan.toFixed(3)} V</Text>
        )}
      </AnimatedCircularProgress>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20,
  },
  gasValue: {
    fontSize: 28, fontWeight: 'bold', color: '#333',
  },
  status: {
    marginTop: 20, fontSize: 20, fontWeight: '600',
  },
});