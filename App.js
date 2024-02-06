import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ContextWrapper from './context/ContextWrapper';

export default function App() {
  return (
    <ContextWrapper>
    <View style={styles.container}>
      <Text>SIMPLIFYING COLLEGE INDOOR DELIVERIES</Text>
      <StatusBar style="auto" />
    </View>
    </ContextWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
