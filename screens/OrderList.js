import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Button } from "react-native";

const OrderList = () => {
    const handleClearAsyncStorage = async () => {
      try {
        await AsyncStorage.clear();
        console.log("AsyncStorage cleared successfully.");
      } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
        // Handle error accordingly
      }
    };
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Clear AsyncStorage" onPress={handleClearAsyncStorage} />
      </View>
    );
  };

  export default OrderList;