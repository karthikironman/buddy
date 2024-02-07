import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DueDiligenceScreen = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="server-sharp" size={64} color="#3498db" />
      <Text style={styles.message}>Please wait,we are setting up things</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
  },
});

export default DueDiligenceScreen;
