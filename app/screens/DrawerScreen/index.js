import React, { Component } from "react";
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

class DrawerScreen extends Component {
  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      initializing: true,
      user: "",
      currentVersion: "1.0.0",
    };
  }

  async componentDidMount() {
    let currentVersion = await VersionCheck.getCurrentVersion();
    if (this.props.books.length == 0) {
      this.props.fetchVersionBooks({
        language: this.props.language,
        versionCode: this.props.versionCode,
        downloaded: this.props.downloaded,
        sourceId: this.props.sourceId,
      });
    }
    this.setState({ currentVersion });
  }
  render() {
    const iconName = [
      {
        icon: "account-circle",
        pressIcon: "Auth",
        text: this.props.email ? "Profile" : "Log In/Sign Up",
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
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.headerContainer}>
            <ImageBackground
              source={require("../../assets/headerbook.jpg")}
              style={styles.headerImage}
            >
              <View style={styles.bcsImage}>
                <Image
                  style={styles.imageStyle}
                  source={require("../../assets/bcs_old_favicon.png")}
                />
                <View style={styles.goToLogin}>
                  <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logoIcon}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>
          {iconName.map((iconName, index) => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(iconName.pressIcon);
              }}
              style={styles.drawerItem}
            >
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Icon
                  name={iconName.icon}
                  size={20}
                  style={styles.iconStyleDrawer}
                />
                <Text style={styles.textStyle}>{iconName.text}</Text>
                {/* <DrawerItem
                      label={iconName.text}
                      labelStyle={styles.textStyle}
                      onPress={() => {
                        this.props.navigation.navigate(iconName.pressIcon)
                      }}
                    /> */}
              </View>
              <Icon
                name="chevron-right"
                size={20}
                style={styles.iconStyleDrawer}
              />
            </TouchableOpacity>
          ))}
          {/*for appstore app*/}
          <Text style={styles.versionText}>APP VERSION {this.state.currentVersion}</Text>
          {/*//for tesing */}
          {/* <Text style={styles.versionText}>APP VERSION 1.3.2-alpha.5</Text> */}
        </ScrollView>
      </View>
    );
  }
}
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
