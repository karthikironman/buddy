import { useContext, useEffect } from "react";
const { Alert } = require("react-native");
import firestore from "@react-native-firebase/firestore";
import GlobalContext from "../context/GlobalContext";

const UserDataListener = ({ children }) => {
  const { setCurrUserData, currUser } = useContext(GlobalContext);

  useEffect(() => {
    console.log('[USE EFFECT] UserDataListener.js')
    let unsubscribe = null;
    if (currUser) {
      if (unsubscribe !== null) {
        console.log(`[LISTENER] - _UserDataListener/currUser_ - destroyBeforeMount`)
        unsubscribe();
      }
      console.log(`[LISTENER] - _UserDataListener/currUser_ - mount`)
      unsubscribe = listenUserData(currUser);
    }
    return () => {
      // Ensure the listener is unsubscribed when the component unmounts or when the user changes
      if (unsubscribe !== null) {
          console.log(`[LISTENER] - _UserDataListener/currUser_ - destroy`)
          unsubscribe();
      }
    };
  }, [currUser]);

  const listenUserData = (data) => {
    const userData = data;
   
    try {
      console.log(`[LISTENER] - _UserDataListener/currUserData_ - mount`)
      const userRef = firestore().collection("users").doc(userData.uid);
      let retuner = null;
      retuner = userRef.onSnapshot((snapshot) => {
        console.log(`[LISTENER] - _UserDataListener/currUserData_ - update`);
        if (snapshot.exists) {
          const {contacts, ...userData} = snapshot.data();
          //exclude the contacts
          setCurrUserData(userData);
        } else {
          //this is the place new users are created:----------
          userRef
            .set({
              phone: currUser.phoneNumber,
              createdAt: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              console.log("New user created");
            })
            .catch((error) => {
              console.error("E2, Error creating a new user document: ", error);
            });
        }
      });

      // Return the unsubscribe function to clean up the listener when needed
      return () => {
        if(retuner !== null){
          console.log(`[LISTENER] - _UserDataListener/currUserData_ - destroy`);
          retuner()
        }
      }
    } catch (err) {
      Alert.alert("E1, Error in userData live listening");
    }
  };

  return <>{children}</>;
};

export default UserDataListener;
