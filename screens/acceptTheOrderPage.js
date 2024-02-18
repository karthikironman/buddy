import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SliderButton from 'rn-slide-button';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AcceptTheOrderPage = ({ route }) => {
  const navigation = useNavigation();
  
  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { orderId } = route.params;
    setOrderId(orderId);

    const fetchOrder = async () => {
      try {
        const orderDoc = await firestore().collection('orders').doc(orderId).get();
        if (orderDoc.exists) {
          setOrder(orderDoc.data());
        } else {
          console.log('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [route.params.orderId]);



  const handleAcceptOrder = () => {
    console.log('HANDLE ACCEPT THE ORDER');
    firestore()
      .collection('orders')
      .doc(orderId)
      .get()
      .then(orderDoc => {
        if (!orderDoc.exists) {
          console.log('Order not found');
          return;
        }
  
        const orderData = orderDoc.data();
        if (orderData.status !== 'open' || orderData.delivered_by) {
          console.log('Order cannot be accepted');
          return;
        }
  
        // Update order status to 'progress' and set 'delivered_by' field to current user's UID
        firestore()
          .collection('orders')
          .doc(orderId)
          .update({
            status: 'progress',
            delivered_by: auth().currentUser.uid,
            participants: firestore.FieldValue.arrayUnion(auth().currentUser.uid)
          })
          .then(() => {
            console.log('Order accepted successfully');
            // Navigate to a success page or perform any other action
          })
          .catch(error => {
            console.error('Error accepting order:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching order:', error);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={styles.orderContainer}>
            <Image source={{ uri: order?.item_data?.shopImage }} style={styles.shopImage} />
            <Text style={styles.shopName}>{order?.item_data?.shopName}</Text>
            <Text style={styles.itemName}>{order?.item_data?.name}</Text>
            <Text style={styles.displayName}>{order?.ordered_by_data?.displayName}</Text>
            <Text style={styles.address}>{order?.address}</Text>
            <Text style={styles.totalPrice}>Total Price: {parseFloat(order?.item_data?.price) * parseFloat(order?.quantity)}</Text>
            <Text style={styles.quantity}>Quantity: {order?.quantity}</Text>
            <SliderButton
             width={300}
             height={50}
              backgroundColor="#007bff"
              buttonColor="#ffffff"
              text="Slide to Accept"
              onReachedToEnd={handleAcceptOrder}
              containerStyle={styles.sliderButtonContainer}
              autoReset = {true}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  orderContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  shopImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  itemName: {
    fontSize: 16,
    marginTop: 10,
  },
  displayName: {
    fontSize: 16,
    marginTop: 10,
  },
  address: {
    fontSize: 16,
    marginTop: 10,
  },
  totalPrice: {
    fontSize: 16,
    marginTop: 10,
  },
  quantity: {
    fontSize: 16,
    marginTop: 10,
  },
  sliderButtonContainer: {
    marginTop: 20,
  },
});

export default AcceptTheOrderPage;
