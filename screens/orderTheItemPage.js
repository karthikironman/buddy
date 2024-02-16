import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const OrderTheItemPage = ({ route }) => {
  const [itemId, setItemId] = useState(null);
  const [item, setItem] = useState(null);

  useEffect(() => {
    // Read the item ID from the navigation params
    const { itemId } = route.params;
    setItemId(itemId);

    // Fetch item details from Firestore based on the item ID
    const fetchItem = async () => {
      try {
        console.log('one')
        const itemDoc = await firestore()
          .collection('items')
          .doc(itemId)
          .get();
         console.log('two')
        if (itemDoc.exists) {
          setItem(itemDoc.data());
        } else {
          console.log('Item not found');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [route.params.itemId]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {item ? (
      <View>
        {/* Row 1: Item Details */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Item Image */}
          <Image
            source={{ uri: item.image }} // Assuming item.image is the URL of the image
            style={{ width: 100, height: 100, marginRight: 10 }}
          />
          {/* Item Name */}
          <Text>{item.name}</Text>
          {/* Item Price */}
          <Text>{item.price}</Text>
        </View>

        {/* Row 2: Seller Details */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          {/* Seller Image */}
          <Image
            source={{ uri: item.shopImage }} // Assuming item.seller.image is the URL of the seller's image
            style={{ width: 50, height: 50, marginRight: 10 }}
          />
          {/* Seller Name */}
          <Text>{item.shopName}</Text>
        </View>

        {/* Quantity Selector */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
            <Text>-</Text>
          </TouchableOpacity>
          <Text>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>

        {/* Price According to Quantity */}
        <Text style={{ marginTop: 10 }}>Total Price: {item.price * quantity}</Text>

        {/* Address Input */}
        <TextInput
          placeholder="Enter Your Address"
          style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginTop: 10 }}
          onChangeText={setAddress}
          value={address}
        />

        {/* Slider Button to Start the Order */}
        <TouchableOpacity
          style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 10 }}
          onPress={handleOrder}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Order Now</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Text>Loading...</Text>
    )}
  </View>
  );
};

export default OrderTheItemPage;
