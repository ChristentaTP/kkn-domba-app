import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { BarChart } from "react-native-chart-kit";

export default function DashboardScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState({});
  const [avgAmmonia, setAvgAmmonia] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "domba"), orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = [];
      let dist = {
        "30-40": 0,
        "41-50": 0,
        "51-60": 0,
        ">60": 0,
      };
      let ammoniaSum = 0;

      snapshot.forEach((doc) => {
        const item = doc.data();

        if (item.berat >= 30 && item.berat <= 40) dist["30-40"]++;
        else if (item.berat >= 41 && item.berat <= 50) dist["41-50"]++;
        else if (item.berat >= 51 && item.berat <= 60) dist["51-60"]++;
        else if (item.berat > 60) dist[">60"]++;

        if (item.amonia) {
          ammoniaSum += item.amonia;
        }

        list.push({ id: doc.id, ...item });
      });

      setData(list);
      setDistribution(dist);
      setAvgAmmonia(list.length > 0 ? (ammoniaSum / list.length).toFixed(2) : 0);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const renderItem = ({ item }) => {
    let ammoniaColor = "#27ae60"; // hijau default
    if (item.amonia >= 30) ammoniaColor = "#e74c3c"; // merah
    else if (item.amonia >= 20) ammoniaColor = "#f39c12"; // kuning

    return (
      <View style={styles.item}>
        <Text style={styles.dataText}>ID Domba: {item.idDomba}</Text>
        <Text style={styles.dataText}>Berat: {item.berat} kg</Text>
        <Text style={[styles.dataText, { color: ammoniaColor }]}>
          Amonia: {item.amonia !== undefined ? `${item.amonia} ppm` : "-"}
        </Text>
        <Text style={styles.dataText}>
          Waktu:{" "}
          {item.timestamp
            ? new Date(item.timestamp.seconds * 1000).toLocaleString()
            : "-"}
        </Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#2980B9" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Dashboard Monitoring Domba</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Distribusi Berat</Text>
        <BarChart
          data={{
            labels: Object.keys(distribution),
            datasets: [{ data: Object.values(distribution) }],
          }}
          width={Dimensions.get("window").width - 50}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#FFFF", // kuning terang
            backgroundGradientTo: "#FFFF",   // oranye kuning
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`, // bar & text gelap
            labelColor: () => "#2C3E50", // label warna gelap
          }}
          style={{ borderRadius: 12, marginVertical: 8 }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Rata-rata Amonia</Text>
        <Text
          style={[
            styles.cardText,
            {
              color:
                avgAmmonia >= 30
                  ? "#e74c3c"
                  : avgAmmonia >= 20
                  ? "#f39c12"
                  : "#27ae60",
            },
          ]}
        >
          {avgAmmonia} ppm
        </Text>
      </View>

      <Text style={styles.subtitle}>📋 Data Terbaru</Text>
      <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F3EDC8", // kuning pastel background
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#2C3E50",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#34495E",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2980B9",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  item: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dataText: {
    fontSize: 14,
    color: "#333",
  },
});
