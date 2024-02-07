import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Linking,
  RefreshControl,
} from "react-native";

import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const [items, setItems] = useState([]);
  const [bannerAd, setBannerAd] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const openWhatsApp = () => {
    const message = `Hi Buddy Delivery, I would like to order *${selectedItem.name}* from *${selectedItem.shopName}*.`;
    Linking.openURL(`whatsapp://send?text=${message}&phone=+918891750225`);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
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
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchItems} />
        }
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemContainer}
            onPress={() => {
              setSelectedItem(item);
              setModalVisible(true);
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
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedItem(null);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setSelectedItem(null);
              }}
            >
              <View style={styles.closeButtonBackground}>
                <Ionicons name="close" size={40} color="black" />
              </View>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Image
                source={{ uri: selectedItem?.image }}
                style={styles.modalImage}
              />
              <Text style={styles.itemName}>{selectedItem?.name}</Text>
              <Text style={styles.shopName}>{selectedItem?.shopName}</Text>
              <Text style={styles.itemLabel}>
                Price:{" "}
                <Text style={styles.itemValue}>₹ {selectedItem?.price}</Text>
              </Text>
              <Text style={styles.itemLabel}>
                Delivery Speed:{" "}
                <Text style={styles.itemValue}>
                  {selectedItem?.deliverySpeed}
                </Text>
              </Text>
              <Text style={styles.itemLabel}>Description:</Text>
              <Text style={styles.itemValue}>{selectedItem?.description}</Text>
              <TouchableOpacity
                style={styles.orderButton}
                onPress={() => {
                  openWhatsApp();
                  setModalVisible(false);
                  setSelectedItem(null);
                }}
              >
                <Text style={styles.orderButtonText}>Order</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    resizeMode: "cover",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  shopName: {
    fontSize: 16,
    color: "#555",
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  itemValue: {
    fontSize: 16,
    marginTop: 3,
    color:'blue'
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: '89%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: "100%",
    height: 200,
    marginTop:20,
    marginBottom: 10,
    resizeMode: "cover",
  },
  modalContent: {
    flexGrow: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 9,
  },
  closeButtonBackground: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
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
    padding:5,
    fontSize:20
  },
});

export default HomeScreen;
