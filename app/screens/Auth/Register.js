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

// class Register extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       displayName: "",
//       email: "",
//       password: "",
//       cpassword: "",
//       passwordVisible1: true,
//       passwordVisible2: true,
//       isLoading: false,
//       filePath: {},
//     };
//     this.styles = styles(this.props.colorFile, this.props.sizeFile);
//   }

//   //on change text function for textInput
//   updateInputVal = (val, prop) => {
//     const state = this.state;
//     state[prop] = val;
//     this.setState(state);
//   };
//   registerUser = () => {
//     if (this.state.email === "" && this.state.password === "") {
//       Alert.alert("Enter details to signup!");
//     } else {
//       this.setState({
//         isLoading: true,
//       });
//       if (this.state.cpassword === this.state.password) {
//         auth()
//           .createUserWithEmailAndPassword(
//             this.state.email.trim(),
//             this.state.password.trim()
//           )
//           .then(async () => {
//             this.props.userLogedIn({ pasLogedIn: true, googleLogIn: false });
//             this.setState({ isLoading: false });
//             this.props.navigation.navigate("Bible");
//           })
//           .catch((error) => {
//             if (error.code === "auth/weak-password") {
//               Alert.alert("Weak password");
//             }
//             if (error.code === "auth/email-already-in-use") {
//               Alert.alert("Email already in use");
//             }
//             if (error.code === "auth/invalid-email") {
//               Alert.alert("Invalid Email");
//            cpassword }
//             this.setState({ isLoading: false });
//           });
//       } else {
//         Alert.alert("Password and confirm password donot match");
//         this.setState({ isLoading: false });
//       }
//     }
//   };

//   render() {
//     if (this.state.isLoading) {
//       return (
//         <View style={this.styles.preloader}>
//           <ActivityIndicator size="large" color={Color.Blue_Color} />
//         </View>
//       );
//     }
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS == "ios" ? "padding" : "height"}
//         style={this.styles.container}
//       >
//         <View>
//           <Icon
//             name="close"
//             size={28}
//             style={this.styles.headerCloseIcon}
//             onPress={() => {
//               this.props.navigation.pop();
//             }}
//           />
//         </View>
//         <View style={this.styles.iconContainer}>
//           <View style={this.styles.centerContainer}>
//             <Image
//               style={{ width: 50, height: 50, marginVertical: 16 }}
//               source={require("../../assets/bcs_old_favicon.png")}
//             />
//             <Text
//               style={this.styles.signinText}
//             >
//               Sign Up
//             </Text>
//           </View>
//           <View
//             style={this.styles.signinInput}
//           >
//             <TextInput
//               style={this.styles.inputStyle}
//               placeholder="Name"
//               placeholderTextColor={this.styles.placeholderColor.color}
//               value={this.state.displayName}
//               onChangeText={(val) => this.updateInputVal(val, "displayName")}
//             />
//             <TextInput
//               style={this.styles.inputStyle}
//               placeholder="Email"
//               placeholderTextColor={this.styles.placeholderColor.color}
//               value={this.state.email}
//               onChangeText={(val) => this.updateInputVal(val, "email")}
//             />
//             <View>
//               <TextInput
//                 style={this.styles.inputStyle}
//                 placeholder="Password"
//                 placeholderTextColor={this.styles.placeholderColor.color}
//                 value={this.state.password}
//                 onChangeText={(val) => this.updateInputVal(val, "password")}
//                 maxLength={15}
//                 secureTextEntry={this.state.passwordVisible1}
//               />
//               <Icon
//                 name={this.state.passwordVisible1 ? "eye" : "eye-off"}
//                 size={24}
//                 style={this.styles.eyeIcon}
//                 onPress={() =>
//                   this.setState({
//                     passwordVisible1: !this.state.passwordVisible1,
//                   })
//                 }
//               />
//             </View>
//             <View>
//               <TextInput
//                 style={this.styles.inputStyle}
//                 placeholder="Confirm Password"
//                 placeholderTextColor={this.styles.placeholderColor.color}
//                 value={this.state.cpassword}
//                 onChangeText={(val) => this.updateInputVal(val, "cpassword")}
//                 maxLength={15}
//                 secureTextEntry={this.state.passwordVisible2}
//               />
//               <Icon
//                 name={this.state.passwordVisible2 ? "eye" : "eye-off"}
//                 size={24}
//                 style={this.styles.eyeIcon}
//                 onPress={() =>
//                   this.setState({
//                     passwordVisible2: !this.state.passwordVisible2,
//                   })
//                 }
//               />
//             </View>
//             <Button
//               color={Color.Blue_Color}
//               title="Sign Up"
//               onPress={() => this.registerUser()}
//             />
//             <Text
//               style={this.styles.loginText}
//               onPress={() => this.props.navigation.goBack()}
//             >
//               Already Registered? Click here to Sign In
//             </Text>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     );
//   }
// }
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
