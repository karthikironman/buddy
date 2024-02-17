import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SliderButton from 'rn-slide-button';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const OrderTheItemPage = ({ route }) => {
  const navigation = useNavigation();
  
  const [itemId, setItemId] = useState(null);
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [isAddressEntered, setIsAddressEntered] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { itemId } = route.params;
    setItemId(itemId);

    const fetchItem = async () => {
      try {
        const itemDoc = await firestore()
          .collection('items')
          .doc(itemId)
          .get();
        
        if (itemDoc.exists) {
          setItem(itemDoc.data());
        } else {
          console.log('Item not found');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchWalletBalance = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setWalletBalance(userData.wallet);
          } else {
            console.log('User data not found');
          }
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    fetchItem();
    fetchWalletBalance();
  }, [route.params.itemId]);

  const handleOrder = () => {
    if (address) {
      if (item.price * quantity > walletBalance) {
        Alert.alert(
          'Insufficient Balance',
          'Not enough balance in wallet. Please recharge in wallet page.',
          [{ text: 'OK' }],
          { cancelable: false }
        );
      } else {
        console.log('HANDLE ORDER', {itemId, quantity, address });
        // Proceed with order
      }
    } else {
      alert('Please enter your address to proceed with the order.');
    }
  }

  const handleAddressChange = (text) => {
    setAddress(text);
    setIsAddressEntered(!!text);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 18 }}>Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18 }}>Order Item</Text>
            <View style={{ width: 50 }}></View>
          </View>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            {isLoading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 150, height: 150, marginBottom: 10, borderRadius: 10 }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>{item.name}</Text>
                <Text style={{ marginBottom: 5 }}>{item.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold', marginRight: 5 }}>Price:</Text>
                  <Text>{item.price}</Text>
                </View>
                
                {/* Shop Image and Shop Name */}
                <View style={{ backgroundColor: 'lightgray', padding: 10, borderRadius: 10, marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={{ uri: item.shopImage }}
                      style={{ width: 50, height: 50, marginRight: 10, borderRadius: 25 }}
                    />
                    <Text>{item.shopName}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <TouchableOpacity style={{ backgroundColor: 'orange', padding: 10, borderRadius: 5 }} onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
                    <Text style={{ fontSize: 20, color: 'white' }}>-</Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, marginHorizontal: 10 }}>{quantity}</Text>
                  <TouchableOpacity style={{ backgroundColor: 'orange', padding: 10, borderRadius: 5 }} onPress={() => setQuantity(quantity + 1)}>
                    <Text style={{ fontSize: 20, color: 'white' }}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={{ marginTop: 10 }}>Total Price: {item.price * quantity}</Text>
                <Text>Your wallet balance: {walletBalance}</Text>

                <View style={{ width: '100%', marginTop: 10 }}>
                  <TextInput
                    placeholder="Enter Your Address"
                    style={{ borderWidth: 1, borderColor: 'gray', padding: 10, height: 100, textAlignVertical: 'top', minWidth:280 }}
                    onChangeText={handleAddressChange}
                    value={address}
                    multiline={true}
                    maxLength={200} // Set the maximum length of the address
                  />
                </View>

                <SliderButton
                  width={300}
                  height={50}
                  innerBackgroundColor="#3498db"
                  outerBackgroundColor="#2980b9"
                  onReachedToEnd={handleOrder}
                  text="Slide to Order"
                  autoReset = {true}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OrderTheItemPage;
