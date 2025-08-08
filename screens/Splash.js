import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

export default function SplashScreen() {
  const navigation = useNavigation(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
<View style={styles.container}>
  <Image
    source={require('../assets/Logo.png')}
    style={styles.logo}
    resizeMode="contain"
  />
  <Text style={styles.title}>Pencatatan Ternak</Text>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },
  title: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});
