import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, Linking, StyleSheet, Image } from "react-native";
import GlobalContext from "../context/GlobalContext";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import auth from Firebase
import SliderButton from 'rn-slide-button';

const CustomerTracking = () => {
  const { customerTrackingId } = useContext(GlobalContext);
  const [orderData, setOrderData] = useState(null);
  const [currentUserType, setCurrentUserType] = useState(null); // State to track the current user's type (customer or agent)
  const [statusChanged, setStatusChanged] = useState(false); // State to track if the status has been changed by the agent
  const currentUserUid = auth().currentUser.uid; // Get the current user's UID using auth()

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("orders")
      .doc(customerTrackingId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const order = doc.data();
          setOrderData(order);
          // Determine the current user's type (customer or agent)
          if (order.ordered_by === currentUserUid) {
            setCurrentUserType("customer");
          } else if (order.delivered_by === currentUserUid) {
            setCurrentUserType("agent");
          } else {
            setCurrentUserType(null);
          }
        } else {
          console.log("Order not found");
          setOrderData(null); // Clear orderData if order is not found
        }
      });

    return () => unsubscribe();
  }, [currentUserUid,customerTrackingId ]);

  const handleCallCustomer = () => {
    let phoneNumber = null;
    
    // Check the current user's type and set the phoneNumber accordingly
    if (currentUserType === "customer" && orderData.delivered_by_data && orderData.delivered_by_data.phone) {
      phoneNumber = orderData.delivered_by_data.phone; // Call the agent's phone
    } else if (currentUserType === "agent" && orderData.ordered_by_data && orderData.ordered_by_data.phone) {
      phoneNumber = orderData.ordered_by_data.phone; // Call the customer's phone
    }
    
    // Make the call if phoneNumber is available
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      console.log("No phone number available to call");
    }
  };

  const handleStatusChange = () => {
    // Handle status change from "progress" to "closed"
    // Update Firestore document with new status
    firestore()
      .collection("orders")
      .doc(customerTrackingId)
      .update({
        status: "closed",
      })
      .then(() => {
        console.log("Status updated successfully");
        setStatusChanged(true);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ORDER TRACKING</Text>
      {orderData ? (
        <>
          <Text style={styles.statusText}>Order Status: {orderData.status}</Text>
          {orderData.item_data && (
            <View style={styles.itemContainer}>
              <Image source={{ uri: orderData.item_data.image }} style={styles.image} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>Item Name: {orderData.item_data.name}</Text>
                <Text style={styles.itemPrice}>Item Price: {orderData.item_data.price}</Text>
                <Text style={styles.quantity}>Quantity: {orderData.quantity}</Text>
                <Text style={styles.shopName}>Shop Name: {orderData.item_data.shopName}</Text>
                <Text style={styles.deliveryAddress}>Location: {orderData.address}</Text>
              </View>
            </View>
          )}
          {currentUserType === "customer" ? (
            // For customers, display agent information and call button
            <>
              {orderData.delivered_by_data ? (
                <View style={styles.userData}>
                  <Text style={styles.userName}>Delivered By: {orderData.delivered_by_data.displayName}</Text>
                  <Text style={styles.userPhone}>Buddy Phone: {orderData.delivered_by_data.phone}</Text>
                  <Button title="Call Buddy" onPress={handleCallCustomer} />
                </View>
              ) : (
                <Text>We are waiting for the agent to accept the order.</Text>
              )}
            </>
          ) : currentUserType === "agent" ? (
            // For agents, display customer information and status update button
            <>
              {orderData.ordered_by_data ? (
                <View style={styles.userData}>
                  <Text style={styles.userName}>Ordered By: {orderData.ordered_by_data.displayName}</Text>
                  <Text style={styles.userPhone}>Buddy Phone: {orderData.ordered_by_data.phone}</Text>
                  <Button title="Call Buddy" onPress={handleCallCustomer} />
                </View>
              ) : (
                <Text>Buddy information available.</Text>
              )}
              {orderData.status === "progress" && (
            
                <SliderButton
                  width={300}
                  height={50}
                  innerBackgroundColor="#3498db"
                  outerBackgroundColor="#2980b9"
                  onReachedToEnd={handleStatusChange}
                  title="COMPLETE"
                  autoReset = {true}
                />
              )}
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
  },
  deliveryAddressContainer: {
    marginBottom: 10,
    borderWidth: 1, // Add a border around the delivery address
    borderColor: "#ffd700", // Set border color to yellow
    paddingHorizontal: 10, // Add horizontal padding for better readability
    borderRadius: 5, // Add border radius for rounded corners
  },
  deliveryAddress: {
    fontSize: 16,
  },
  quantity: {
    fontSize: 16
  },
  shopName: {
    fontSize: 16,
  },
  userData: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
  },
});




export default CustomerTracking;
