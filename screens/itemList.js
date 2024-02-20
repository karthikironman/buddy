import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from "react-native";

import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import NewUpdateCheck from "../components/newUpdateCheck"
import NotificationComponent from "../components/Notifications";

const HomeScreen = () => {
  const [items, setItems] = useState([]);
  const [bannerAd, setBannerAd] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation()

  useEffect(() => {
    fetchItems();
    fetchBannerAd();
  }, []);

  const fetchItems = async () => {
    setRefreshing(true);
    const itemsSnapshot = await firestore().collection("items").get();
    const fetchedItems = itemsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(fetchedItems);
    setRefreshing(false);
  };

  const fetchBannerAd = async () => {
    const adSnapshot = await firestore()
      .collection("advertisement")
      .doc("banner")
      .get();
    setBannerAd(adSnapshot.data());
  };


  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <NewUpdateCheck/>
      <NotificationComponent/>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchItems} />
        }
      >
        <View style={styles.bannerAd}>
          {bannerAd?.url && (
            <TouchableOpacity
              style={styles.bannerImage}
              onPress={() => {
                if (bannerAd?.url) {
                  Linking.openURL(bannerAd.url);
                }
              }}
            >
              <Image
                source={{ uri: bannerAd.imageUrl }}
                style={styles.bannerImage}
              />
            </TouchableOpacity>
          )}
        </View>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            onPress={() => {
              navigation.navigate("orderTheItemsPage",{itemId:item.id})
            }}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.shopName}>{item.shopName}</Text>
              <Text style={styles.itemLabel}>
                Price: <Text style={styles.itemValue}>₹ {item.price}</Text>
              </Text>
              <Text style={styles.itemLabel}>
                Delivery Speed:{" "}
                <Text style={styles.itemValue}>{item.deliverySpeed}</Text>
              </Text>
              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => {
                  navigation.navigate("orderTheItemsPage",{itemId:item.id})
                }}
              >
                <Text style={styles.orderButtonText}>Order Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerAd: {
    alignItems: "center",
    marginBottom: 10,
  },
  bannerImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  shopName: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  itemValue: {
    fontSize: 16,
    marginTop: 3,
    color: "blue",
  },
  orderButton: {
    backgroundColor: "blue",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  orderButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default HomeScreen;
