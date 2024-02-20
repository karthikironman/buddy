import { useState, useEffect, useContext } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import GlobalContext from "../context/GlobalContext";
import firestore from "@react-native-firebase/firestore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken, title, body) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { someData: "goes here" },
  };
 try{
  let result = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
 }catch(err){
  console.log('ERROR SENDING NOTIFICATION ** ',err)
 }
 
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    console.log(token);
  } else {
    //alert('Must use physical device for Push Notifications');
  }
  return token?.data ? token.data : '';  //for pc sumulators it return empty string
}

function NotificationComponent() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const { currUser } = useContext(GlobalContext);

  useEffect(() => {
    console.log("[USE EFFECT] Notification.js");
    registerForPushNotificationsAsync().then(async (token) => {
      if(token){
        setExpoPushToken(token);
      }else{
        console.log('PROBABLY YOU ARE USING SIMULATOR, NOTIFICATIONS WONT WORK HERE')
      }
    });
  }, []);

  useEffect(() => {
    const recordToken = async () => {
      if (!currUser || !expoPushToken) return;

      const userRef = firestore().collection("users").doc(currUser.uid);
      try {
        // Set the user document with the push notification token
        console.log("[SAVING TOKEN IN DB]");
        await userRef.set(
          {
            pushNotificationToken: expoPushToken,
          },
          { merge: true } // Use merge: true to merge with existing data or create new if not exists
        );
      } catch (error) {
        console.error("Error updating push notification token:", error);
      }
    };

    recordToken();
  }, [expoPushToken, currUser]);

  return null;
}

export default NotificationComponent;
export { sendPushNotification };
