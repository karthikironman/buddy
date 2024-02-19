import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import firestore from "@react-native-firebase/firestore";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("orders")
      .where("status", "==", "open")
      .onSnapshot((querySnapshot) => {
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      });

    return () => unsubscribe();
  }, []);

  const handleOrderPress = (order) => {
    // Navigate to the acceptTheOrderPage with the order data
    navigation.navigate("acceptTheOrdersPage", { orderId: order.id });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {orders.length === 0 && (
          <Text
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "30%",
              width: "70%",
              textAlign: "center",
            }}
          >
            No orders available right now, please check after some time
          </Text>
        )}
        {orders.map((order, index) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderContainer}
            onPress={() => handleOrderPress(order)}
          >
            <View style={styles.imageContainer}>
              {order.item_data?.shopImage && (
                <Image
                  source={{ uri: order.item_data.shopImage }}
                  style={styles.shopImage}
                />
              )}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.shopName}>
                {order.item_data?.shopName || "loading..."}
              </Text>
              <Text style={styles.address}>{order.address}</Text>
              <Text style={styles.itemName}>
                {order.item_data?.name || "loading..."}
              </Text>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleOrderPress(order)}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  imageContainer: {
    marginRight: 20,
  },
  shopImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  itemName: {
    marginBottom: 5,
  },
  acceptButton: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default OrderList;
