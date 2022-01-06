import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
  TextInput,
  Button,
  Image,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { userInfo, userLogedIn } from "../../store/action";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-community/google-signin";
// import { AccessToken, LoginManager, LoginButton } from 'react-native-fbsdk';
import { styles } from "./styles.js";
import Color from "../../utils/colorConstants";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [user,setUser]=useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const style = styles(props.colorFile, props.sizeFile);
  const login = async () => {
    if (email === "" && password === "") {
      Alert.alert("Please enter email and password !");
    } else {
      setIsLoading(true);
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          //removed res from this then
          props.userLogedIn({ pasLogedIn: true, googleLogIn: false });
          props.navigation.navigate("Bible");
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            Alert.alert("User not found");
          }
          if (error.code === "auth/wrong-password") {
            Alert.alert("Wrong password");
          }
          if (error.code === "auth/invalid-email") {
            Alert.alert("Invalid Email");
          }
          if (error.code === "auth/unknown") {
            Alert.alert(
              "Something went wrong. Please check your internet connection"
            );
          }
          setIsLoading(false);
        });
    }
  };
  const _signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const data = await GoogleSignin.signIn();
      if (data) {
        setIsLoading(true);
        async () => {
          const credential = auth.GoogleAuthProvider.credential(
            data.idToken,
            data.accessToken
          );
          // Login with the credential
          await auth().signInWithCredential(credential);
          props.userLogedIn({ pasLogedIn: false, googleLogIn: true });
          setIsLoading(false);
          props.navigation.navigate("Bible");
        };
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert("Signin Cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Signin in progress");
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Google play services not available");
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  // const _signInFacebook = () => {
  //   // eslint-disable-next-line no-undef
  //   LoginManager.logInWithPermissions(["public_profile", "email"])
  //     .then((result) => {
  //       if (result.isCancelled) {
  //         return Promise.reject(new Error("The user cancelled the request"));
  //       }
  //       // Retrieve the access token
  //       // eslint-disable-next-line no-undef
  //       return AccessToken.getCurrentAccessToken();
  //     })
  //     .then((data) => {
  //       const credential = auth.FacebookAuthProvider.credential(
  //         data.accessToken
  //       );
  //       // Login with the credential
  //       return auth().signInWithCredential(credential);
  //     })
  //     .then(() => {
  //       setState({ isLoading: true }, () => {
  //         setState({ isLoading: false });
  //         props.navigation.navigate("Bible");
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //     });
  // };
  useEffect(() => {
    try {
      GoogleSignin.configure({
        webClientId:
          "486797934259-gkdusccl094153bdj8cbugfcf5tqqb4j.apps.googleusercontent.com", // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        // hostedDomain: 'localhost', // specifies a hosted domain restriction
        // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        forceConsentPrompt: false, // [Android] if you want to show the authorization prompt at each login.
        // accountName: '', // [Android] specifies an account name on the device that should be used
        // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);
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
          <Text style={style.signinText}>Sign In</Text>
        </View>
        <View style={style.signinInput}>
          <TextInput
            style={style.inputStyle}
            placeholderTextColor={style.placeholderColor.color}
            placeholder="Email"
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
              secureTextEntry={passwordVisible}
            />
            <Icon
              name={passwordVisible ? "eye" : "eye-off"}
              size={24}
              style={style.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          </View>
          <Button
            color={Color.Blue_Color}
            title="Sign In"
            onPress={() => login()}
          />
          <Text
            style={style.loginText}
            onPress={() => props.navigation.navigate("Reset")}
          >
            Reset password
          </Text>
          <View style={style.dividerView}>
            <View style={style.dividerLine} />
            <Text style={style.divider}>Or</Text>
            <View style={style.dividerLine} />
          </View>
          <View style={style.signinButton}>
            <GoogleSigninButton
              // style={{ width: 68, height: 68 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={_signInGoogle}
            />
          </View>
          <Text
            style={style.loginText}
            onPress={() => props.navigation.navigate("Register")}
          >
            Don&apos;t have account? Click here to Sign Up
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
