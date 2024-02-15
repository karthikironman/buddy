import React from "react";
import { View, Button, StatusBar, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const TempHome = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="default" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "ITEMS") {
              // Use the appropriate image source for the ITEMS tab
              iconName = focused
                ? require("../assets/items.png")
                : require("../assets/items.png");
            } else if (route.name === "ORDERS") {
              // Use the appropriate image source for the ORDERS tab
              iconName = focused
                ? require("../assets/heart.png")
                : require("../assets/heart.png");
            }

            // You can also return a custom component instead of an image
            return (
              <Image source={iconName} style={{ width: 24, height: 24 }} />
            );
          },
          tabBarShowLabel:false
        })
      }
        
      >
        <Tab.Screen name="ITEMS" component={LogoutScreen} />
        <Tab.Screen name="ORDERS" component={ClearStorageScreen} />
      </Tab.Navigator>
    </View>
  );
};

const LogoutScreen = () => {
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
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const ClearStorageScreen = () => {
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Clear AsyncStorage" onPress={handleClearAsyncStorage} />
    </View>
  );
};

export default TempHome;
