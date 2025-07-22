// screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const buttons = [
  {
    title: 'Dashboard',
    img: 'https://img.icons8.com/3d-fluency/94/control-panel.png',
    tabScreen: 'Dashboard',
  },
  {
    title: 'Input',
    img: 'https://img.icons8.com/3d-fluency/94/copybook.png',
    tabScreen: 'Input',
  },
  {
    title: 'History',
    img: 'https://img.icons8.com/3d-fluency/94/history-folder.png',
    tabScreen: 'History',
  },
];

export default function HomeScreen({ navigation }) {
  const handlePress = (tabScreen) => {
    navigation.navigate('MainTabs', { screen: tabScreen });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📋 Pilih Menu</Text>

      <View style={styles.buttonContainer}>
        {buttons.map((btn, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handlePress(btn.tabScreen)}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: btn.img }}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.label}>{btn.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const screenW = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    width: screenW / 3 - 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    width: 70,
    height: 70,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
