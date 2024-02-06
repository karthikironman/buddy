import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const NoInternetConnection = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/noInternet.png")} // Replace with the path to your custom image
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>No Internet Connection</Text>
      <Text style={styles.subtext}>
        Please check your internet connection and try again.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 200, // Adjust the width and height based on your image dimensions
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
  },
});

export default NoInternetConnection;
