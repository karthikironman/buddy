import { useNetInfo } from "@react-native-community/netinfo";

import { NavigationContainer } from "@react-navigation/native";

import ContextWrapper from "./context/ContextWrapper.js";
import NoInternetConnection from "./screens/noInternet.js";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./screens/signIn.js";
import TempHome from "./screens/tempHome.js";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "./context/GlobalContext.js";

const Stack = createStackNavigator();

const App = () => {
  const { currUser } = useContext(GlobalContext);

  useEffect(() => {
    console.log("[USE EFFECT] App.js");
  }, []);
  return (
    <NavigationContainer>
      {!currUser ? <Setup /> : <Loop />}
    </NavigationContainer>
  );
};

const Loop = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={TempHome}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const Setup = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="signIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const InternetCheckerScreen = ({ children }) => {
  const netInfo = useNetInfo();
  if (netInfo.isConnected) return children;
  else return <NoInternetConnection />;
};

function Main() {
  //attach the wrapper and internet connection checker
  useEffect(() => {
    console.log("[USE EFFECT] Main");
  }, []);
  return (
    <ContextWrapper>
      <InternetCheckerScreen>
        <App />
      </InternetCheckerScreen>
    </ContextWrapper>
  );
}
export default Main;
