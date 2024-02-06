import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import auth from "@react-native-firebase/auth";
import LoaderModal from "../components/loaderModal";
import { validatePhone } from "../utils/phoneNumber";
import appInfo from "../config/appInfo";
import GlobalContext from "../context/GlobalContext";

const SignIn = () => {
  const {
    theme: { colors },
  } = useContext(GlobalContext);
  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;

    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [resendDisabled]);

  useEffect(() => {
    if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [countdown]);

  const sendOTP = async () => {
    setOtp(""); //clear the otp to ensure the field in empty initially
    if (validatePhone(phone)) {
      try {
        setLoading(true);
        const confirmation = await auth().signInWithPhoneNumber(phone);
        setLoading(false);
        setConfirmation(confirmation);
        setResendDisabled(true);
        setCountdown(60);
      } catch (error) {
        setLoading(false);
        Alert.alert("Error sending OTP, Please try again later");
        console.error("Error sending OTP", error);
      }
    } else {
      console.log("invalid phone");
      Alert.alert("invalid phone");
    }
  };

  const confirmOTP = async () => {
    try {
      setLoading(true);
      let OTPConfirm = await confirmation.confirm(otp);
      setLoading(false);
      // OTP confirmed successfully, you can navigate to the next screen or perform any other action
    } catch (error) {
      setLoading(false);
      Alert.alert("Error confirming OTP, Please try again later");
      console.error("Error confirming OTP", error);
    }
  };

  const resendOTP = () => {
    // Implement resend OTP logic here
    // For example, you can call sendOTP() again
    sendOTP();
  };

  return (
    <View style={styles.container}>
      <Image
        style={{ width: 150, height: 140, marginBottom: 10 }}
        source={require("../assets/welcome-img.png")}
      />
      <LoaderModal showModal={loading} />
      <Text style={{ ...styles.branding, color: colors.black }}>
        {appInfo?.appName ?? ""}
      </Text>
      <Text style={{ ...styles.slogan, color: colors.secondary }}>
        {appInfo?.appSlogan}
      </Text>
      <Text style={{ ...styles.title, color: colors.black }}>SignIn</Text>
      <View style={styles.inputContainer}>
        <TextInput
          keyboardType="numeric"
          editable={confirmation == null}
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        {confirmation ? (
          <Button
            title="CHANGE NUMBER"
            onPress={() => {
              setConfirmation(null);
              setPhone("+91");
            }}
          />
        ) : (
          <Button
            title="Send OTP"
            onPress={sendOTP}
          />
        )}
      </View>

      {confirmation && (
        <View style={styles.inputContainer}>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={(text) => setOtp(text)}
          />
          <Button
            title="Confirm OTP"
            onPress={confirmOTP}
            disabled={otp.length != 6}
          />
          <View style={styles.resendButtonContainer}>
            <Button
              title={`Resend OTP ${resendDisabled ? `(${countdown}s)` : ""}`}
              onPress={resendOTP}
              disabled={resendDisabled}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  branding: {
    fontSize: 34,
    fontWeight: "500",
    textAlign: "center",
  },
  slogan: {
    marginBottom: 30,
    color: "orange",
    width: "80%",
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  resendButtonContainer: {
    marginTop: 10,
  },
});

export default SignIn;
