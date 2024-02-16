import React, { useState, useEffect } from "react";
import { View, Text, Button, Linking, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const Wallet = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;

      if (currentUser) {
        // Fetch user's phone number from auth
        const userPhoneNumber = currentUser.phoneNumber;
        setPhoneNumber(userPhoneNumber);

        // Fetch user's wallet balance from Firestore
        const uid = currentUser.uid;
        const userRef = firestore().collection("users").doc(uid);

        try {
          const snapshot = await userRef.get();
          if (snapshot.exists && snapshot.data().wallet) {
            setWalletBalance(snapshot.data().wallet);
          } else {
            setWalletBalance(0);
          }
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const openWhatsAppRecharge = () => {
    const message = `Hi, I would like to recharge my wallet. My phone number is ${phoneNumber}`;
    Linking.openURL(
      `whatsapp://send?text=${message}&phone=YOUR_PHONE_NUMBER_HERE`
    );
  };

  const openWhatsAppTransfer = () => {
    const message = `Hi, I would like to transfer the money to my bank account. My account is ${phoneNumber}`;
    Linking.openURL(
      `whatsapp://send?text=${message}&phone=YOUR_PHONE_NUMBER_HERE`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Wallet Balance: {walletBalance}</Text>
      <Button title="Recharge" onPress={openWhatsAppRecharge} />
      <View style={{ marginVertical: 10 }} /> 
      <Button title="Transfer to Bank Account" onPress={openWhatsAppTransfer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  balanceText: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Wallet;
