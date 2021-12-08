import React, { Component } from "react";
import AppNavigator from "./app/routes/";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import { connect } from "react-redux";
// import { Root } from "native-base";
import VersionCheck from "react-native-version-check";
import {
  fetchAllContent,
  fetchVersionLanguage,
  APIBaseURL,
  updateVersion,
  fetchAllBooks,
  fetchVersionBooks,
} from "./app/store/action/";
import { Alert, Linking } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import database from "@react-native-firebase/database";
import { NativeBaseProvider, Text, Box, Root } from "native-base";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      signedIn: false,
      checkedSignIn: false,
    };
  }

  checkUpdateNeeded = async () => {
    let latestVersion = await VersionCheck.getLatestVersion();
    let currentVersion = await VersionCheck.getCurrentVersion();
    VersionCheck.needUpdate({
      currentVersion: currentVersion,
      latestVersion: latestVersion,
    }).then((res) => {
      if (res.isNeeded) {
        Alert.alert(
          "Please update your app ",
          "Kindly update your app to the latest version to continue using it",
          [
            {
              text: "Update",
              onPress: () => {
                Linking.openURL(res.storeUrl);
              },
            },
            {
              text: "Cancel",
              onPress: () => {
                return;
              },
            },
          ]
        );
      }
    });
  };

  async componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 400);
    database()
      .ref("/apiBaseUrl/")
      .on("value", (snapshot) => {
        this.props.APIBaseURL(snapshot.val());
        this.props.fetchVersionLanguage();
        this.props.fetchAllContent();
        this.props.fetchAllBooks();
        this.props.fetchVersionBooks({
          language: this.props.language,
          versionCode: this.props.versionCode,
          downloaded: this.props.downloaded,
          sourceId: this.state.sourceId,
        });
      });
    this.checkUpdateNeeded();
    this.unsubscribenetinfo = NetInfo.addEventListener(
      this._handleConnectionChange
    );
  }

  _handleConnectionChange = (state) => {
    if (state.isConnected === true) {
      if (this.props.baseAPI == null) {
        database()
          .ref("/apiBaseUrl/")
          .on("value", (snapshot) => {
            this.props.APIBaseURL(snapshot.val());
          });
      }
      if (this.props.allBooks.length == 0 || this.props.books.length == 0) {
        this.props.fetchAllBooks();
        this.props.fetchVersionBooks({
          language: this.props.language,
          versionCode: this.props.versionCode,
          downloaded: this.props.downloaded,
          sourceId: this.state.sourceId,
        });
      }
      if (
        this.props.allLanguages.length == 0 ||
        this.props.contentLanguages.length == 0
      ) {
        this.props.fetchVersionLanguage();
        this.props.fetchAllContent();
      }
    }
  };
  componentWillUnmount() {
    this.unsubscribenetinfo && this.unsubscribenetinfo();
  }
  render() {
    return (
      <Root>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </Root>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    contentType: state.updateVersion.parallelContentType,
    updatedVersionData: state.versionFetch.bible,
    books: state.versionFetch.versionBooks,
    allBooks: state.contents.allBooks,
    allLanguages: state.contents.allLanguages,
    contentLanguages: state.contents.contentLanguages,
    baseAPI: state.updateVersion.baseAPI,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllContent: () => dispatch(fetchAllContent()),
    fetchVersionLanguage: () => dispatch(fetchVersionLanguage()),
    APIBaseURL: (payload) => dispatch(APIBaseURL(payload)),
    updateVersion: (payload) => dispatch(updateVersion(payload)),
    fetchAllBooks: (payload) => dispatch(fetchAllBooks(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
