import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles.js";
import { connect } from "react-redux";
import { fetchVersionBooks } from "../../store/action/";
import VersionCheck from "react-native-version-check";

const DrawerScreen = (props) => {
  const [state, setState] = useState({
    currentVersion: "1.0.0",
  });
  // let unsubscriber = null;
  const style = styles(props.colorFile, props.sizeFile);
  useEffect(async () => {
    let currentVersion = await VersionCheck.getCurrentVersion();
    if (props.books.length == 0) {
      props.fetchVersionBooks({
        language: props.language,
        versionCode: props.versionCode,
        downloaded: props.downloaded,
        sourceId: props.sourceId,
      });
    }
    setState({ currentVersion });
  }, []);
  const iconName = [
    {
      icon: "account-circle",
      pressIcon: "Auth",
      text: props.email ? "Profile" : "Log In/Sign Up",
    },
    { icon: "bookmark", pressIcon: "Bookmarks", text: "Bookmarks" },
    { icon: "border-color", pressIcon: "Highlights", text: "Highlights" },
    { icon: "note", pressIcon: "Notes", text: "Notes" },
    { icon: "videocam", pressIcon: "Video", text: "Video" },
    { icon: "volume-up", pressIcon: "Audio", text: "Audio" },
    { icon: "book", pressIcon: "Dictionary", text: "Dictionary" },
    { icon: "image", pressIcon: "Infographics", text: "Infographics" },
    { icon: "receipt", pressIcon: "OBS", text: "Bible Stories" },
    { icon: "event", pressIcon: "BRP", text: "Reading Plans" },
    { icon: "comment", pressIcon: "DrawerCommentary", text: "Commentary" },
    { icon: "history", pressIcon: "History", text: "History" },
    { icon: "search", pressIcon: "Search", text: "Search" },
    { icon: "settings", pressIcon: "Settings", text: "Settings" },
    { icon: "info", pressIcon: "About", text: "About Us" },
    { icon: "help", pressIcon: "Help", text: "Help" },
  ];
  return (
    <View style={style.container}>
      <ScrollView style={style.container}>
        <View style={style.headerContainer}>
          <ImageBackground
            source={require("../../assets/headerbook.jpg")}
            style={{ flex: 1, width: 280 }}
          >
            <View style={style.drwrImgContainer}>
              <Image
                style={style.imageStyle}
                source={require("../../assets/bcs_old_favicon.png")}
              />
              <View style={style.goToLogin}>
                <Image
                  source={require("../../assets/logo.png")}
                  style={style.drawerImage}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
        {iconName.map((iconName, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              props.navigation.navigate(iconName.pressIcon);
            }}
            style={style.drawerItem}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Icon
                name={iconName.icon}
                size={20}
                style={style.iconStyleDrawer}
              />
              <Text style={style.textStyle}>{iconName.text}</Text>
              {/* <DrawerItem
                      label={iconName.text}
                      labelStyle={style.textStyle}
                      onPress={() => {
                        this.props.navigation.navigate(iconName.pressIcon)
                      }}
                    /> */}
            </View>
            <Icon
              name="chevron-right"
              size={20}
              style={style.iconStyleDrawer}
            />
          </TouchableOpacity>
        ))}
        {/*for appstore app*/}
        <Text style={style.versionText}>
          APP VERSION {state.currentVersion}
        </Text>
        {/*//for tesing */}
        {/* <Text style={this.styles.versionText}>APP VERSION 1.3.2-alpha.5</Text> */}
      </ScrollView>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    email: state.userInfo.email,
    books: state.versionFetch.versionBooks,
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVersionBooks: (value) => dispatch(fetchVersionBooks(value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreen);
