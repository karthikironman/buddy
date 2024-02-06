import GlobalContext from "./GlobalContext";
import { theme } from "../utils";
import { useEffect, useState } from "react";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore"; // Import firestore if you are using Firebase Firestore
import { Alert } from "react-native";

const ContextWrapper = (props) => {
  const [currUser, setCurrUser] = useState(null);
  const [currUserData, setCurrUserData] = useState(null);

  useEffect(() => {
    let authUnsubscribe = auth().onAuthStateChanged(async (user) => {
      setCurrUser(user);
      if (!user) {
        //logout action, restore all the states
        setCurrUserData(null);
      }
    });
    return () => {
      authUnsubscribe();
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{ theme, currUser, currUserData, setCurrUserData }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper;
