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

import firestore from "@react-native-firebase/firestore";
import CustomerTracking from "./screens/customerTracking.js";

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
  const { currUser, setIsProfileSubmitted, isProfileSubmitted } =
    useContext(GlobalContext);
  const [hasOpenOrder, setHasOpenOrder] = useState(false); // State to track if there is an open order

  useEffect(() => {
    const checkProfileSubmission = async () => {
      if (currUser?.phoneNumber) {
        const localStorageKey = `${currUser.phoneNumber}-profileSubmitted`;
        try {
          const isProfileSubmittedInLocalStorage = await AsyncStorage.getItem(
            localStorageKey
          );
          console.log(
            "READING THE STORED VALUE",
            isProfileSubmittedInLocalStorage
          );
          if (isProfileSubmittedInLocalStorage === "true") {
            console.log("SETTING TRUE");
            setIsProfileSubmitted(true);
          } else {
            console.log("SETTING FALSE");
            setIsProfileSubmitted(false);
          }
        } catch (error) {
          console.error(
            "Error reading profile submission status from AsyncStorage:",
            error
          );
          // Handle error accordingly
        }
      }
    };

    checkProfileSubmission();
  }, [currUser]);
  useEffect(() => {
    console.log({ isProfileSubmitted, hasOpenOrder });
  });
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("orders")
       .where("ordered_by", "==", currUser.uid) // Filter orders by user's UID
       .where("status", "in", ["open", "progress"]) // Filter orders by status
    //  .orderBy("created_at", "desc") // Order documents by created_at in descending order
    //  .limit(1)
      .onSnapshot((querySnapshot) => {
        console.log("CHANGE DETECTED");
        if (querySnapshot && !querySnapshot.empty) {
          // If any open or progress order found, set hasOpenOrder to true
          const latestOrder = querySnapshot.docs[0].data();
          console.log(latestOrder);
          if (["open", "progress"].includes(latestOrder.status) === true) {
            setHasOpenOrder(true);
          }else if(["closed", "cancelled"].includes(latestOrder.status) === true) {
            setHasOpenOrder(false);
          }
        }else{
          setHasOpenOrder(false)
        }
      });
    // Clean up function to unsubscribe from orders collection when unmounted
    return () => unsubscribe();
  }, []);

  const getScreen = () => {
    if (isProfileSubmitted === false) {
      return (
        <Stack.Screen
          name="profile_onboarding"
          component={Profile}
          options={{ headerShown: false }}
        />
      );
    } else if (isProfileSubmitted && hasOpenOrder === false) {
      return (
        <>
          <Stack.Screen
            name="home"
            component={TempHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="orderTheItemsPage"
            component={OrderTheItemPage} // You can create a new component to inform the user that orders are blocked
            options={{ headerShown: false }}
          />
        </>
      );
    } else if (isProfileSubmitted && hasOpenOrder === true) {
      return (
        <Stack.Screen
          name="orderTheItemsBlockedPage"
          component={CustomerTracking} // You can create a new component to inform the user that orders are blocked
          options={{ headerShown: false }}
        />
      );
    } else {
      return (
        <Stack.Screen
          name="dueDiligenceLoading"
          component={DueDiligenceScreen}
          options={{ headerShown: false }}
        />
      );
    }
  };
  return (
    //I want to pass a prop to the screen profile
    <Stack.Navigator>{getScreen()}</Stack.Navigator>
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
