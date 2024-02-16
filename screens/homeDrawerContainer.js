import React from "react";
import { View, Text } from "react-native";

import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "./profile.js";
import ItemNOrderList from "./ItemNOrderList.js";

const Drawer = createDrawerNavigator();

const HomeDrawerContainer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={ItemNOrderList} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Wallet" component={Wallet} />
    </Drawer.Navigator>
  );
};

const Wallet = () => {
  return (
    <View>
      <Text>WALLET</Text>
    </View>
  );
};

export default HomeDrawerContainer;
