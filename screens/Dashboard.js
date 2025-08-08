// screens/Dashboard.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weightDist, setWeightDist] = useState({
    "30-40": 0,
    "41-50": 0,
    "51-60": 0,
    ">60": 0,
  });
  const [avgAmmonia, setAvgAmmonia] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "data_domba"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let tempData = [];
      let dist = { "30-40": 0, "41-50": 0, "51-60": 0, ">60": 0 };
      let ammoniaSum = 0;

      snapshot.forEach((doc) => {
        const item = doc.data();
        tempData.push(item);

        if (item.weight >= 30 && item.weight <= 40) dist["30-40"]++;
        else if (item.weight >= 41 && item.weight <= 50) dist["41-50"]++;
        else if (item.weight >= 51 && item.weight <= 60) dist["51-60"]++;
        else if (item.weight > 60) dist[">60"]++;

        if (item.ammonia) {
          ammoniaSum += item.ammonia;
        }
      });

      setData(tempData);
      setWeightDist(dist);
      setAvgAmmonia(tempData.length > 0 ? ammoniaSum / tempData.length : 0);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  const insightText = `💡 Rata-rata amonia: ${avgAmmonia.toFixed(
    2
  )} ppm — Pastikan ventilasi kandang optimal.`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3EDC8" }}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.sectionTitle}>📊 Dashboard Monitoring</Text>

        {/* Rata-rata amonia */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rata-rata Amonia</Text>
          <Text style={styles.cardValue}>{avgAmmonia.toFixed(2)} ppm</Text>
        </View>

        {/* Grafik Distribusi Berat */}
        <Text style={styles.sectionTitle}>Distribusi Berat Domba</Text>
        <View style={styles.card}>
          <BarChart
            data={{
              labels: Object.keys(weightDist),
              datasets: [{ data: Object.values(weightDist) }],
            }}
            width={screenWidth - 40}
            height={220}
            fromZero
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (o = 1) => `rgba(0,0,0,${o})`,
              labelColor: (o = 1) => `rgba(0,0,0,${o})`,
            }}
            style={styles.chart}
          />
        </View>

        {/* Banner Insight */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{insightText}</Text>
        </View>

        {/* Data Terbaru */}
        <Text style={styles.sectionTitle}>Data Terbaru</Text>
        {data.slice(0, 5).map((item, index) => (
          <View key={index} style={styles.dataCard}>
            <Text style={styles.dataText}>ID Domba: {item.id_domba}</Text>
            <Text style={styles.dataText}>Berat: {item.weight} kg</Text>
            <Text style={styles.dataText}>Amonia: {item.ammonia} ppm</Text>
            <Text style={styles.dataText}>
              Waktu:{" "}
              {item.timestamp
                ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                : "-"}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 8,
    color: "#1E293B",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#374151" },
  cardValue: { fontSize: 22, fontWeight: "700", color: "#4CAF50", marginTop: 4 },
  chart: { borderRadius: 12 },
  banner: {
    backgroundColor: "#E6F4D9",
    borderLeftWidth: 6,
    borderLeftColor: "#44651E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  bannerText: { color: "#374151", fontSize: 14 },
  dataCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dataText: { fontSize: 14, color: "#374151" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
