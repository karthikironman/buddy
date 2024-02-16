import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";
import Profile from "./profile.js";
import ItemNOrderList from "./itemNOrderList.js";
import Wallet from "./wallet.js";

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



export default HomeDrawerContainer;
