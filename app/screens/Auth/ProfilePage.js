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
      props.navigation.navigate("Bible");
    } catch (error) {
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
