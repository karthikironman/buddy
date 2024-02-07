import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import Constants from "expo-constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { askForPermission, pickImage, uploadImage } from "../utils/cameraImage";
import GlobalContext from "../context/GlobalContext";
// import { updateUserDocument } from "../services/onBoardingService";
import LoaderModal from "../components/loaderModal";
import { useNavigation } from "@react-navigation/native";
import NotificationComponent from "../components/Notifications";

export default function Profile() {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const { currUserData, currUser } = useContext(GlobalContext);

  useEffect(() => {
    setDisplayName(currUserData?.displayName ?? "");
    setSelectedImage(currUserData?.photoURL ?? "");
  }, []);

  const isDisplayNameValid = async () => {
    const regex = /^[a-z0-9_-]{3,}$/; // Regex for lowercase alphanumeric, hyphen, and underscore, minimum 3 characters

    setIsSaveButtonEnabled(regex.test(displayName));
  };
  const isUnique = async () => {
    try {
      // Query Firestore to check if the displayName is unique (excluding the current user)
      const querySnapshot = await firestore()
        .collection("users")
        .where("displayName", "==", displayName.toLowerCase())
        .where(firestore.FieldPath.documentId(), "!=", currUser.uid)
        .get();
      if (!querySnapshot.empty) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error checking displayName uniqueness:", error);
      throw error; // Handle the error according to your application's needs
    }
  };

  useEffect(() => {
    //validate the displayName and enable/disable the save button
    isDisplayNameValid();
  }, [displayName]);

  useEffect(() => {
    (async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
    })();
  }, []);

  const firebaseStorageUrlRegex =
    /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[a-zA-Z0-9-]+\.appspot\.com\/o\/[a-zA-Z0-9-\/_.%]+(\?.*)?$/;
  const isFirebaseStorageUrl = (url) => {
    return firebaseStorageUrlRegex.test(url);
  };

  async function handlePress(navigate = null) {
    let unique = await isUnique();

    if (unique) {
      setLoading(true);
      const user = auth().currentUser; //I cant make use of currUser from context, check documentation
      let photoURL;
      if (selectedImage) {
        if (isFirebaseStorageUrl(selectedImage) == false) {
          const { url } = await uploadImage(
            selectedImage,
            `images/${user.uid}`,
            "profilePicture"
          );
          photoURL = url;
        } else {
          //user did not make any change
          photoURL = selectedImage;
        }
      }
      const userData = {
        displayName,
      };
      if (photoURL) {
        userData.photoURL = photoURL;
      }
      await updateUserDocument(user.uid, userData);
      setLoading(false);
      if (navigate) {
        navigation.navigate(navigate);
      }
    } else {
      Alert.alert("user name is not available, please choose some other name");
    }
  }


  const updateUserDocument = async (uid, userData) => {
    try {
      const userRef = firestore().collection('users').doc(uid);
      const userDoc = await userRef.get();
  
      if (userDoc?.exists) {
        // If the user document already exists, update it with the new data
        await userRef.update(userData);
      } else {
        // If the user document does not exist, create a new one
        await userRef.set(userData);
      }
  
      return userRef;
    } catch (error) {
      console.error("Error creating or updating user document:", error);
      throw error;
    }
  };

  async function handleProfilePicture() {
    const result = await pickImage();
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  // if (!permissionStatus) {
  //   return <Text>Loading</Text>;
  // }
  // if (permissionStatus !== "granted") {
  //   return <Text>You need to allow this permission</Text>;
  // }

  const handleDisplayNameChange = (name) => {
    const lowerCaseName = name.toLowerCase();
    setDisplayName(lowerCaseName);
  };

  return (
    <React.Fragment>
      <NotificationComponent/>
      <LoaderModal showModal={loading} />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          paddingTop: Constants.statusBarHeight + 20,
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 22, color: "black" }}>Profile Info</Text>
        <Text style={{ fontSize: 14, color: "black", marginTop: 20 }}>
          Please provide your user name and an optional profile photo
        </Text>
        <TouchableOpacity
          onPress={handleProfilePicture}
          style={{
            marginTop: 30,
            borderRadius: 120,
            width: 120,
            height: 120,
            backgroundColor: "orange",
            alignItems: "center",
            justifyContent: "center",
            borderColor:'grey',
            borderWidth:5
          }}
        >
          {!selectedImage ? (
            <MaterialCommunityIcons
              name="camera-plus"
              color={"grey"}
              size={45}
            />
          ) : (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: "100%", borderRadius: 120 }}
            />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Type your user name"
          value={displayName}
          onChangeText={handleDisplayNameChange}
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            margin: 10,
            paddingLeft: 10,
            width: "100%",
          }}
        />
        <Text style={styles.ruleMessage}>
          Username must be:
          {"\n"}- Unique
          {"\n"}- Minimum 3 characters
          {"\n"}- No spaces, special characters except '-' and '_'
        </Text>
        <View style={{ marginTop: "auto", width: 80 }}>
        {currUserData ? (
            //THIS IS USED WHEN THE PAGE IS DISPLAYED FROM THE THREE DOTS
            <Button
              title="SAVE"
              onPress={() =>handlePress('home')}
              disabled={!isSaveButtonEnabled}
            />
          ) : (
            //THIS IS USED WHEN THE USER IS ONBOARDING
            <Button
              title="SAVE"
              onPress={() =>handlePress(null)}
              disabled={!isSaveButtonEnabled}
            />
          )}
        </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  ruleMessage: {
    color: "grey",
    fontSize: 12,
    marginBottom: 10,
  },
});
