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
import LoaderModal from "../components/loaderModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalContext from "../context/GlobalContext";

export default function Profile({}) {
  const { setIsProfileSubmitted } = useContext(GlobalContext);
  const [displayName, setDisplayName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  const isDisplayNameValid = async () => {
    const regex = /^[a-zA-Z\s'-]{4,}$/; // Regex for at least 4 characters matching the pattern inside the character set [a-zA-Z\s'-].
    setIsSaveButtonEnabled(regex.test(displayName));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        const userDoc = await firestore().collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setDisplayName(userData.displayName || ''); // Set display name from the document or empty string if not available
          setSelectedImage(userData.photoURL || null); // Set selectedImage to photoURL from the document or null if not available
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    console.log('PROFILE USE EFFECT===>')
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

  async function handlePress() {
    setLoading(true);
    const user = auth().currentUser; //I cant make use of currUser from context, check documentation
    let photoURL;
    if (selectedImage) {
      if (isFirebaseStorageUrl(selectedImage) == false) {
        //some image in the phone storage
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
    
     // Set AsyncStorage field to true
  try {
    await AsyncStorage.setItem(`${user.phoneNumber}-profileSubmitted`, "true");
    setIsProfileSubmitted(true);
    console.log('Profile submitted flag set successfully.');
  } catch (error) {
    console.error('Error setting profile submitted flag in AsyncStorage:', error);
    // Handle error accordingly
  }

    setLoading(false);

  }

  const updateUserDocument = async (uid, userData) => {
    try {
      const userRef = firestore().collection("users").doc(uid);
      const userDoc = await userRef.get();
      userData.phone = auth().currentUser.phoneNumber;

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

  const handleDisplayNameChange = (name) => {
    setDisplayName(name);
  };

  return (
    <React.Fragment>
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
          Please provide your Name and an optional Profile Photo
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
            borderColor: "grey",
            borderWidth: 5,
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
          Your name must be:
          {"\n"}- Minimum 4 characters 
        </Text>
        <View style={{ marginTop: "auto", width: 80 }}>
          <Button
            title="SAVE"
            onPress={() => handlePress(null)}
            disabled={!isSaveButtonEnabled}
          />
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
