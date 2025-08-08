import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function Monitor() {
  const [gasValue, setGasValue] = useState(0);
  const [status, setStatus] = useState("Memuat...");
  const [color, setColor] = useState("#00e0ff");

  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedGas = Math.floor(Math.random() * 100);
      setGasValue(simulatedGas);
      updateStatus(simulatedGas);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = (value) => {
    if (value < 30) {
      setStatus("Aman 👍");
      setColor("#00b894"); // hijau
    } else if (value < 70) {
      setStatus("Waspada ⚠️");
      setColor("#fdcb6e"); // kuning
    } else {
      setStatus("Bahaya 🚨");
      setColor("#d63031"); // merah
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📡 Monitoring Gas Amonia</Text>

        <AnimatedCircularProgress
          size={220}
          width={16}
          fill={gasValue}
          tintColor={color}
          backgroundColor="#dfe6e9"
          rotation={0}
          lineCap="round"
        >
          {fill => (
            <Text style={styles.gasValue}>{gasValue} ppm</Text>
          )}
        </AnimatedCircularProgress>

        <Text style={[styles.status, { color }]}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EDC8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 30,
  },
  gasValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#2d3436',
  },
  status: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 25,
  },
});
