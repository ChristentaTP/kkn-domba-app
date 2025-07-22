// screens/Dashboard.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getWeightsSorted } from '../services/sheepData';

const screenW = Dimensions.get('window').width;
const SHEEP  = ['Domba A', 'Domba B', 'Domba C', 'Domba D'];
const COLORS = ['#e91e63', '#2196f3', '#4caf50', '#ff9800'];

export default function Dashboard() {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([[], [], [], []]);
  const [avg,    setAvg]    = useState([0, 0, 0, 0]);
  const [insight,setInsight]= useState('');

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const raw = await getWeightsSorted();

        const data = raw.filter(
          d => !isNaN(Number(d.weight)) && isFinite(d.weight) && d.weight > 0
        );

        const dates = [...new Set(data.map(d => d.date))];

        const allSeries = SHEEP.map(name =>
          dates.map(d => {
            const hit = data.find(x => x.date === d && x.sheep === name);
            return hit ? Number(hit.weight) : null;
          })
        );

        const avgs = SHEEP.map(name => {
          const arr = data.filter(x => x.sheep === name).map(x => Number(x.weight));
          return arr.length ? arr.reduce((s,n)=>s+n,0) / arr.length : 0;
        });

        const maxIdx = avgs.indexOf(Math.max(...avgs));
        let text = `📈 ${SHEEP[maxIdx]} rata‑rata paling berat (${avgs[maxIdx].toFixed(1)} kg)`;
        if (data.some(d => d.feed === 'pakan fermentasi')) {
          text += ' — pakan fermentasi sudah digunakan, pantau efeknya!';
        }

        setLabels(dates);
        setSeries(allSeries);
        setAvg(avgs);
        setInsight(text);
      };

      load();
    }, [])
  );

  const hasData = series.some(s => s.some(v => v !== null));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3EDC8' }}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* --- Line Chart Card --- */}
        <Text style={styles.sectionTitle}>📈 Tren Pertumbuhan Berat</Text>
        <View style={styles.card}>
          {hasData ? (
            <LineChart
              data={{
                labels,
                datasets: series.map((arr,i)=>({ data: arr, color:()=>COLORS[i], strokeWidth:2 })),
                legend: SHEEP,
              }}
              width={screenW - 40}
              height={240}
              bezier
              chartConfig={chartCfg}
              style={styles.chart}
            />
          ) : (
            <Text style={styles.empty}>Belum ada data valid untuk ditampilkan.</Text>
          )}
        </View>

        {/* --- Bar Chart Card --- */}
        <Text style={styles.sectionTitle}>📊 Rata‑rata Berat</Text>
        <View style={styles.card}>
          <BarChart
            data={{ labels: SHEEP, datasets: [{ data: avg }] }}
            width={screenW - 40}
            height={240}
            fromZero
            chartConfig={chartCfg}
            style={styles.chart}
          />
        </View>

        {/* --- Insight Banner --- */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>💡 {insight}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- Chart theme --- */
const chartCfg = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo:   '#fff',
  decimalPlaces: 1,
  color:      (o=1)=>`rgba(0,0,0,${o})`,
  labelColor: (o=1)=>`rgba(0,0,0,${o})`,
  propsForDots: { r: '3' },
};

/* --- Styles --- */
const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical:   16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    color: '#1E293B',          // deep gray‑blue
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor:   '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 20,
  },
  chart: { borderRadius: 12 },
  empty:  { textAlign:'center', fontStyle:'italic', color:'#6B7280', paddingVertical: 20 },
  banner: {
    backgroundColor: '#E6F4D9',
    borderLeftWidth: 6,
    borderLeftColor: '#44651E',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  bannerText: { color:'#374151', fontSize: 14 },
});
