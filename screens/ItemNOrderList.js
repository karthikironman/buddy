import React from "react";
import {
  View,
  Button,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ItemList from "./ItemList";
import OrderList from "./OrderList";

const Tab = createBottomTabNavigator();
const ItemNOrderList = () => {
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
              <Image source={iconName} style={{ width: 45, height: 45 }} />
            );
          },
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="Items" component={ItemList} />
        <Tab.Screen name="Orders" component={OrderList} />
      </Tab.Navigator>
    </View>
  );
};

export default ItemNOrderList;
