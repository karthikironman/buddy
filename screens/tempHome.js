import React from "react";
import { View, Button, StatusBar, Image, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "../screens/profile.js"
import { useEffect } from "react";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TempHome = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="default" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Items") {
              iconName = focused
                ? require("../assets/items.png")
                : require("../assets/items_inactive.png");
            } else if (route.name === "Orders") {
              iconName = focused
                ? require("../assets/heart.png")
                : require("../assets/heart_inactive.png");
            }

            return (
              <Image source={iconName} style={{ width: 50, height: 50 }} />
            );
          },
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Items" component={LogoutScreen} />
        <Tab.Screen name="Orders" component={ClearStorageScreen} />
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

const HomeScreen = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={TempHome}
      />
       <Drawer.Screen
        name="Profile"
        component={Profile}
      />
       <Drawer.Screen
        name="Wallet"
        component={Wallet}
      />
    </Drawer.Navigator>
  );
};

const Wallet = () => {
  useEffect(()=>{
    console.log('WALLET USE EFFECT===>')
  },[])
  return <View><Text>WALLET</Text></View>
}

export default HomeScreen;
