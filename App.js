import { useNetInfo } from "@react-native-community/netinfo";

import { NavigationContainer } from "@react-navigation/native";

import ContextWrapper from "./context/ContextWrapper.js";
import NoInternetConnection from "./screens/noInternet.js";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./screens/signIn.js";
import TempHome from "./screens/tempHome.js";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "./context/GlobalContext.js";
import UserDataListener from "./components/UserDataListener.js";
import DueDiligenceScreen from "./screens/dueDiligence.js";
import Profile from "./screens/profile.js";

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
  const { currUserData } = useContext(GlobalContext);
  const [ready, setReady] = useState(null);
  useEffect(() => {
    //YOU CAN IGNORE THE ERROR UPDATING THE CURRENT VERSION IN USER DOCUMENT, WHEN YOU ARE TESTING IN THE COMPUTER
    //SIMULATOR, IT IS BECAUSE THE CURR USER DATA IS NOT CLEARING UPON LOGOUT
    if (currUserData) {
      console.log(
        "[READY FLAG in Loop] ",
        !!currUserData?.displayName ? "TRUE" : "FALSE"
      );
      const flagReady =
        !!currUserData?.displayName // && !!currUserData?.pushNotificationToken;
      setReady(flagReady);
    }
  }, [currUserData]);

  return (
    <UserDataListener>
      <Stack.Navigator>
        {ready === false && (
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{ headerShown: false }}
          />
        )}
        {ready === true && (
          <Stack.Screen
            name="home"
            component={TempHome}
            options={{ headerShown: false }}
          />
        )}
         {ready === null && (
          <Stack.Screen
            name="duediligence"
            component={DueDiligenceScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </UserDataListener>
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
