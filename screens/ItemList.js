import auth from "@react-native-firebase/auth";
import {
  View,
  Button,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
const Items = () => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log("User signed out successfully.");
      // Navigate to login screen or perform any other necessary action
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle error accordingly
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Items;
