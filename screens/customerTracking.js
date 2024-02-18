import { useContext, useState } from "react";
import { View, Text } from "react-native";
import GlobalContext from "../context/GlobalContext";

const CustomerTracking = () => {
  const { customerTrackingId } = useContext(GlobalContext);
  const [ data, setData ]= useState({
    address:"",
    created_at:"",
    delivered_by:"",
    item_id:"",
    ordered_by:"",
    quantity:4,
    status:"",
    customerData:{},
    agentData:{},
    itemData:{}
  })
  return (
    <View>
      <Text>CUSTOMER TRACKING : {customerTrackingId}</Text>
    </View>
  );
};
export default CustomerTracking;
