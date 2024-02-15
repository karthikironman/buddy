import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View, Text, Button, StatusBar } from "react-native"; // Import AsyncStorage

import auth from "@react-native-firebase/auth";
const TempHome = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log("User signed out successfully.");
      // Navigate to login screen or perform any other necessary action
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle error accordingly
    }
  };

  const handleClearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully.");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
      // Handle error accordingly
    }
  };

  return (
    <View>
       <StatusBar barStyle="default" />
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Clear AsyncStorage" onPress={handleClearAsyncStorage} />
    </View>
  );
};

export default TempHome;
