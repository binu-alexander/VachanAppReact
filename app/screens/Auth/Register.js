import React, { useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Image,
  Button,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./styles.js";
import Color from "../../utils/colorConstants";
import { userInfo, userLogedIn } from "../../store/action";

const Register = (props) => {
  const [displayName, SetDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [passwordVisible1, setPasswordVisible1] = useState(true);
  const [passwordVisible2, setPasswordVisible2] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const [filePath, setFilePath] = useState({});
  const style = styles(props.colorFile, props.sizeFile);
  const registerUser = () => {
    if (email === "" && password === "") {
      Alert.alert("Enter details to signup!");
    } else {
      setIsLoading(true);
      if (cpassword === password) {
        auth()
          .createUserWithEmailAndPassword(email.trim(), password.trim())
          .then(async () => {
            props.userLogedIn({ pasLogedIn: true, googleLogIn: false });
            setIsLoading(false);
            props.navigation.navigate("Bible");
          })
          .catch((error) => {
            if (error.code === "auth/weak-password") {
              Alert.alert("Weak password");
            }
            if (error.code === "auth/email-already-in-use") {
              Alert.alert("Email already in use");
            }
            if (error.code === "auth/invalid-email") {
              Alert.alert("Invalid Email");
              cpassword;
            }
            setIsLoading(false);
          });
      } else {
        Alert.alert("Password and confirm password donot match");
        setIsLoading(false);
      }
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
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={style.container}
    >
      <View>
        <Icon
          name="close"
          size={28}
          style={style.headerCloseIcon}
          onPress={() => {
            props.navigation.pop();
          }}
        />
      </View>
      <View style={style.iconContainer}>
        <View style={style.centerContainer}>
          <Image
            style={{ width: 50, height: 50, marginVertical: 16 }}
            source={require("../../assets/bcs_old_favicon.png")}
          />
          <Text style={style.signinText}>Sign Up</Text>
        </View>
        <View style={style.signinInput}>
          <TextInput
            style={style.inputStyle}
            placeholder="Name"
            placeholderTextColor={style.placeholderColor.color}
            value={displayName}
            onChangeText={(val) => SetDisplayName(val)}
          />
          <TextInput
            style={style.inputStyle}
            placeholder="Email"
            placeholderTextColor={style.placeholderColor.color}
            value={email}
            onChangeText={(val) => setEmail(val)}
          />
          <View>
            <TextInput
              style={style.inputStyle}
              placeholder="Password"
              placeholderTextColor={style.placeholderColor.color}
              value={password}
              onChangeText={(val) => setPassword(val)}
              maxLength={15}
              secureTextEntry={passwordVisible1}
            />
            <Icon
              name={passwordVisible1 ? "eye" : "eye-off"}
              size={24}
              style={style.eyeIcon}
              onPress={() => setPasswordVisible1(!passwordVisible1)}
            />
          </View>
          <View>
            <TextInput
              style={style.inputStyle}
              placeholder="Confirm Password"
              placeholderTextColor={style.placeholderColor.color}
              value={cpassword}
              onChangeText={(val) => setCPassword(val)}
              maxLength={15}
              secureTextEntry={passwordVisible2}
            />
            <Icon
              name={passwordVisible2 ? "eye" : "eye-off"}
              size={24}
              style={style.eyeIcon}
              onPress={() => setPasswordVisible2(!passwordVisible2)}
            />
          </View>
          <Button
            color={Color.Blue_Color}
            title="Sign Up"
            onPress={() => registerUser()}
          />
          <Text
            style={style.loginText}
            onPress={() => props.navigation.goBack()}
          >
            Already Registered? Click here to Sign In
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,

    email: state.userInfo.email,
    uid: state.userInfo.uid,
    userName: state.userInfo.userName,
    phoneNumber: state.userInfo.phoneNumber,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    userInfo: (payload) => dispatch(userInfo(payload)),
    userLogedIn: (payload) => dispatch(userLogedIn(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
