import React from 'react';
import { View, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;
