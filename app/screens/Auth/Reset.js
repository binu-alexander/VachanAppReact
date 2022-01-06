import React, { useState } from "react";
import {
  ActivityIndicator,
  View,
  Alert,
  TextInput,
  Text,
  Button,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { styles } from "./styles.js";
import { connect } from "react-redux";
import Color from "../../utils/colorConstants";

const Reset = (props) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const password = "";
  const style = styles(props.colorFile, props.sizeFile);
  const reset = () => {
    if (email === "" && password === "") {
      Alert.alert("Enter details to signin!");
    } else {
      setIsLoading(true);
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          alert(
            "We will attempt to send a reset password email to " +
              email +
              "\n" +
              "Click the email to Continue"
          );
          setIsLoading(false);
        })
        .catch(() => {
          // eslint-disable-next-line no-undef
          if (code === "auth/user-not-found") {
            Alert.alert(" user not found ");
          }
          setIsLoading(false);
        });
    }
  };
  if (isLoading) {
    return (
      <View style={style.preloader}>
        <ActivityIndicator size="large" color={Color.Blue_Color} />
      </View>
    );
  }

  return (
    <View style={style.container}>
      <View style={style.resetContainer}>
        <Text style={style.textStyle}>
          Enter your email address and we&apos;ll send a link to reset your
          password.
        </Text>
        <TextInput
          style={style.inputStyle}
          placeholderTextColor={style.placeholderColor.color}
          placeholder="Enter email"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <Button
          color={Color.Blue_Color}
          title="Reset Password"
          onPress={() => reset()}
        />
        <Text style={style.loginText} onPress={() => props.navigation.goBack()}>
          Back to login
        </Text>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    email: state.userInfo.email,
    uid: state.userInfo.uid,
    photo: state.userInfo.photo,
    userName: state.userInfo.userName,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(Reset);
