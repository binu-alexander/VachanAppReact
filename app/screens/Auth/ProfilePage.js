import React from "react";
import { Text, View, Image } from "react-native";
import { connect } from "react-redux";
import { Card, CardItem, Header, Left, Button, Body, Title } from "native-base";
import Icon from "react-native-vector-icons/MaterialIcons";
import { userInfo, userLogedIn } from "../../store/action";
import auth from "@react-native-firebase/auth";
import { styles } from "./styles.js";
import Color from "../../utils/colorConstants";
import { GoogleSignin } from "@react-native-community/google-signin";
// class ProfilePage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       imageUrl: this.props.photo,
//       userData: "",
//       isLoading: false,
//     };
//     this.styles = styles(this.props.colorFile, this.props.sizeFile);
//   }

//   logOut = async () => {
//     try {
//       if (this.props.pasLogedIn) {
//         auth().signOut();
//       } else if (this.props.googleLogIn) {
//         auth().signOut();
//         await GoogleSignin.revokeAccess();
//         await GoogleSignin.signOut();
//       }
//       this.props.userLogedIn({ pasLogedIn: false, googleLogIn: false });
//       this.props.userInfo({
//         email: null,
//         uid: null,
//         userName: "",
//         phoneNumber: null,
//         photo: null,
//       });
//       this.setState({ user: null });
//       this.props.navigation.navigate("Bible");
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
//   render() {
//     this.styles = styles(this.props.colorFile, this.props.sizeFile);
//     return (
//       <View style={this.styles.container}>
//         <Header style={{ backgroundColor: Color.Blue_Color }}>
//           <Left>
//             <Button
//               transparent
//               onPress={() => this.props.navigation.navigate("Bible")}
//             >
//               <Icon size={24} color={Color.White} name="arrow-back" />
//             </Button>
//           </Left>
//           <Body>
//             <Title>Profile</Title>
//           </Body>
//         </Header>
//         <View style={this.styles.cardBgColor}>
//           <Card style={this.styles.cardStyling}>
//             <CardItem style={this.styles.cardItemStyling}>
//               <View
//                 style={this.styles.centerProfileImg}
//               >
//                 <Image
//                   style={this.styles.avatar}
//                   source={
//                     this.props.photo != null
//                       ? { uri: this.props.photo }
//                       : require("../../assets/account.png")
//                   }
//                 />
//                 <View>
//                   <Text style={[this.styles.textStyle, { paddingRight: 8 }]}>
//                     {this.props.email}
//                   </Text>
//                   <Text style={[this.styles.textStyle, { paddingRight: 8 }]}>
//                     {this.props.userName}
//                   </Text>
//                 </View>
//               </View>
//             </CardItem>
//           </Card>
//           <View></View>
//           <Card style={this.styles.cardStyling}>
//             <CardItem
//               header
//               button
//               style={[this.styles.cardItemStyling, { flexDirection: "row" }]}
//               onPress={() => this.props.navigation.navigate("Settings")}
//             >
//               <Icon name="settings" style={this.styles.cardItemIconCustom} />
//               <Text style={this.styles.textStyle}>Settings</Text>
//             </CardItem>
//             <CardItem
//               header
//               button
//               style={[this.styles.cardItemStyling, { flexDirection: "row" }]}
//               onPress={() => this.props.navigation.navigate("About")}
//             >
//               <Icon name="info" style={this.styles.cardItemIconCustom} />
//               <Text style={this.styles.textStyle}>About</Text>
//             </CardItem>
//           </Card>
//           <Card style={this.styles.cardStyling}>
//             <CardItem
//               header
//               button
//               onPress={this.logOut}
//               style={[
//                 this.styles.cardItemStyling,
//                 { alignItems: "center", justifyContent: "center" },
//               ]}
//             >
//               <Text style={this.styles.textStyle}>LOG OUT</Text>
//             </CardItem>
//           </Card>
//         </View>
//       </View>
//     );
//   }
// }

const ProfilePage = (props) => {
  const style = styles(props.colorFile, props.sizeFile);
  const logOut = async () => {
    try {
      if (props.pasLogedIn) {
        auth().signOut();
      } else if (props.googleLogIn) {
        auth().signOut();
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      props.userLogedIn({ pasLogedIn: false, googleLogIn: false });
      props.userInfo({
        email: null,
        uid: null,
        userName: "",
        phoneNumber: null,
        photo: null,
      });
      // this.setState({ user: null });
      props.navigation.navigate("Bible");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <View style={style.container}>
      <Header style={{ backgroundColor: Color.Blue_Color }}>
        <Left>
          <Button
            transparent
            onPress={() => props.navigation.navigate("Bible")}
          >
            <Icon size={24} color={Color.White} name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Profile</Title>
        </Body>
      </Header>
      <View style={style.cardBgColor}>
        <Card style={style.cardStyling}>
          <CardItem style={style.cardItemStyling}>
            <View style={style.centerProfileImg}>
              <Image
                style={style.avatar}
                source={
                  props.photo != null
                    ? { uri: props.photo }
                    : require("../../assets/account.png")
                }
              />
              <View>
                <Text style={[style.textStyle, { paddingRight: 8 }]}>
                  {props.email}
                </Text>
                <Text style={[style.textStyle, { paddingRight: 8 }]}>
                  {props.userName}
                </Text>
              </View>
            </View>
          </CardItem>
        </Card>
        <View></View>
        <Card style={style.cardStyling}>
          <CardItem
            header
            button
            style={[style.cardItemStyling, { flexDirection: "row" }]}
            onPress={() => props.navigation.navigate("Settings")}
          >
            <Icon name="settings" style={style.cardItemIconCustom} />
            <Text style={style.textStyle}>Settings</Text>
          </CardItem>
          <CardItem
            header
            button
            style={[style.cardItemStyling, { flexDirection: "row" }]}
            onPress={() => props.navigation.navigate("About")}
          >
            <Icon name="info" style={style.cardItemIconCustom} />
            <Text style={style.textStyle}>About</Text>
          </CardItem>
        </Card>
        <Card style={style.cardStyling}>
          <CardItem
            header
            button
            onPress={logOut}
            style={[
              style.cardItemStyling,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <Text style={style.textStyle}>LOG OUT</Text>
          </CardItem>
        </Card>
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
    pasLogedIn: state.userInfo.pasLogedIn,
    googleLogIn: state.userInfo.googleLogIn,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
