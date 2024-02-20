import React, { useEffect, useState, useContext } from "react";
import { View, Text, Button, Linking, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import appJson from "../app.json";
import GlobalContext from "../context/GlobalContext";

const UpdateCheckComponent = () => {
  const [dbVersion, setDbVersion] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [lstUpdated, setLstUpdated] = useState(null);
  const { currUser, currUserData } = useContext(GlobalContext); // Get current user from your AuthContext
  const currVersion = appJson.expo.android.versionCode;

  useEffect(() => {
    const fetchFirestoreData = async () => {
      try {
        const documentSnapshot = await firestore()
          .collection("versions")
          .doc("current")
          .get();

        if (documentSnapshot.exists) {
          const { versionNumber, redirectUrl, lastUpdated } =
            documentSnapshot.data();
          setDbVersion(versionNumber);
          setRedirectUrl(redirectUrl);
          setLstUpdated(lastUpdated);
        }
      } catch (error) {
        console.error("Error in version checking", error);
      }
    };

    const updateCurrentVersion = async () => {
      try {
        if (currUser) {
          const userRef = firestore().collection("users").doc(currUser.uid);
          await userRef.set(
            {
              currentVersion: currVersion,
            },
            { merge: true } // Use merge: true to merge with existing data or create new if not exists
          );
        }
      } catch (error) {
        console.error(
          "Error updating current version in user document",
          error
        );
      }
    };

    fetchFirestoreData();
    updateCurrentVersion();
  }, [currUser, currVersion]); // Added currUser and currVersion as dependencies

  const handleUpdatePress = () => {
    Linking.openURL(redirectUrl);
  };

  if (dbVersion && redirectUrl && currVersion < dbVersion) {
    return (
      <View style={styles.masterContainer}>
        <View style={styles.container}>
          <View style={styles.messageContainer}>
            <Text style={styles.message}>NEW UPDATE AVAILABLE</Text>
            <Text style={styles.message2}> {lstUpdated}</Text>
          </View>

          <Button title="Update" onPress={handleUpdatePress} />
        </View>
        <Text style={styles.bottomMessage}>
        Already updated ?? , just close the App completely and reopen.
        </Text>
      </View>
    );
  } else {
    return <></>; // Empty JSX when no update is required
  }
};

const styles = StyleSheet.create({
  masterContainer: {
    display: "flex",
    justifyContent: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: "#ff6f00",
  },
  messageContainer:{
    display:'flex',
    flexDirection:'column',
    alignItems:'center'
  },
  message: {
    fontSize: 14,
    color:'white'
  },
  message2: {
    fontSize: 11,
    color:'white'
  },
  bottomMessage: {
    fontSize: 13,
    textAlign: "center",
    padding: 5,
    backgroundColor: "yellow",
    color: "black",
  },
});

export default UpdateCheckComponent;
