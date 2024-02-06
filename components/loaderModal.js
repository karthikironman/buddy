import { View } from "react-native";
import { Modal } from "react-native";
import { ActivityIndicator } from "react-native"

const LoaderModal = ({showModal}) => {
    return (
        <Modal animationType={"slide"} transparent={true} visible={showModal}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <ActivityIndicator size={30}/>
        </View>
      </Modal>
        
    )
}

export default LoaderModal