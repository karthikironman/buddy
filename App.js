import { useNetInfo } from "@react-native-community/netinfo";

import { NavigationContainer } from "@react-navigation/native";

import ContextWrapper from "./context/ContextWrapper.js";
import NoInternetConnection from "./screens/noInternet.js";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./screens/signIn.js";
import TempHome from "./screens/homeDrawerContainer.js";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "./context/GlobalContext.js";
import DueDiligenceScreen from "./screens/dueDiligence.js";
import Profile from "./screens/profile.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderTheItemPage from "./screens/orderTheItemPage.js";

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
  //read the localStorage to check if user already submitted the profile information.
  const { currUser, setIsProfileSubmitted, isProfileSubmitted } = useContext(GlobalContext);

  useEffect(()=>{
    const checkProfileSubmission = async () => {
      if (currUser?.phoneNumber) {
        const localStorageKey = `${currUser.phoneNumber}-profileSubmitted`;
        try {
          const isProfileSubmittedInLocalStorage = await AsyncStorage.getItem(localStorageKey);
          console.log('READING THE STORED VALUE',isProfileSubmittedInLocalStorage)
          if (isProfileSubmittedInLocalStorage === "true") {
            console.log('SETTING TRUE')
            setIsProfileSubmitted(true);
          } else {
            console.log('SETTING FALSE')
            setIsProfileSubmitted(false);
          }
        } catch (error) {
          console.error('Error reading profile submission status from AsyncStorage:', error);
          // Handle error accordingly
        }
      }
    };
  
    checkProfileSubmission();
  },[currUser])
useEffect(()=>{
  console.log('is Profile submitted ',isProfileSubmitted, typeof isProfileSubmitted)
},[isProfileSubmitted])
  return (
    //I want to pass a prop to the screen profile
    <Stack.Navigator>
       {!isProfileSubmitted  && (
        <Stack.Screen
          name="profile_onboarding"
          component={Profile}
          options={{ headerShown: false }}
        />
      )} 
      {isProfileSubmitted && (
        <>
          <Stack.Screen
            name="home"
            component={TempHome}
            options={{ headerShown: false }}
          />
       <Stack.Screen
            name="orderTheItemsPage"
            component={OrderTheItemPage}
            options={{ headerShown: false }}
          />
        </>
      )}
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
