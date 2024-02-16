import GlobalContext from "./GlobalContext";
import { theme } from "../utils";
import { useEffect, useState } from "react";

import auth from "@react-native-firebase/auth";

const ContextWrapper = (props) => {
  const [currUser, setCurrUser] = useState(null);
  const [isProfileSubmitted, setIsProfileSubmitted] = useState(false)

  useEffect(() => {
    let authUnsubscribe = auth().onAuthStateChanged(async (user) => {
      setCurrUser(user);
    });
    return () => {
      authUnsubscribe();
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ theme, currUser, isProfileSubmitted, setIsProfileSubmitted }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper;
