import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";

const OrderList = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Logic to update badge count
      // For example, you can fetch the number of new orders from your backend
      const newOrderCount = 7; // Example value, replace it with your logic
      navigation.setParams({ newOrderCount });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Order List Screen</Text>
      <Button
        title="Go to Item List"
        onPress={() => navigation.navigate('Items')}
      />
    </View>
  );
};

export default OrderList;
