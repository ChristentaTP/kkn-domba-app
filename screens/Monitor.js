import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function Monitor() {
  const [gasValue, setGasValue] = useState(0); // nilai gas
  const [status, setStatus] = useState("Memuat...");

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulasi nilai dari sensor IoT
      const simulatedGas = Math.floor(Math.random() * 100); 
      setGasValue(simulatedGas);
      updateStatus(simulatedGas);
    }, 3000); // update tiap 3 detik

    return () => clearInterval(interval);
  }, []);

  const updateStatus = (value) => {
    if (value < 30) {
      setStatus("Aman 👍");
    } else if (value < 70) {
      setStatus("Waspada ⚠️");
    } else {
      setStatus("Bahaya 🚨");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoring Gas Amonia</Text>
      <AnimatedCircularProgress
        size={200}
        width={15}
        fill={gasValue}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
        rotation={0}
      >
        {fill => (
          <Text style={styles.gasValue}>{gasValue} ppm</Text>
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
