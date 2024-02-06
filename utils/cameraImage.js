import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import { nanoid } from "nanoid";

export async function pickImage() {
  // the first statement is for camera
  // let result = ImagePicker.launchCameraAsync();
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  return result;
}

export async function askForPermission() {
  // the first statement is for camera
  // await ImagePicker.requestCameraPermissionsAsync();
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status;
}

export async function uploadImage(uri, path, fName) {

  const fileName = fName || nanoid();
  const imageRef = storage().ref(`${path}/${fileName}.jpeg`);

  try {
    await imageRef.putFile(uri);

    let downloadURL = await imageRef.getDownloadURL();

    return { url: downloadURL };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}
