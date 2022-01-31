import React, { useEffect } from "react";
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
import { Root } from "native-base";
const App = (props) => {
  const sourceId = props.sourceId;
  let isConnected;
  let unsubscribenetinfo;

  const checkUpdateNeeded = async () => {
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

  const _handleConnectionChange = () => {
    if (isConnected === true) {
      if (props.baseAPI == null) {
        database()
          .ref("/apiBaseUrl/")
          .on("value", (snapshot) => {
            props.APIBaseURL(snapshot.val());
          });
      }
      if (props.allBooks.length == 0 || props.books.length == 0) {
        props.fetchAllBooks();
        props.fetchVersionBooks({
          language: props.language,
          versionCode: props.versionCode,
          downloaded: props.downloaded,
          sourceId: sourceId,
        });
      }
      if (
        props.allLanguages.length == 0 ||
        props.contentLanguages.length == 0
      ) {
        props.fetchVersionLanguage();
        props.fetchAllContent();
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 400);
    database()
      .ref("/apiBaseUrl/")
      .on("value", (snapshot) => {
        props.APIBaseURL(snapshot.val());
        props.fetchVersionLanguage();
        props.fetchAllContent();
        props.fetchAllBooks();
        props.fetchVersionBooks({
          language: props.language,
          versionCode: props.versionCode,
          downloaded: props.downloaded,
          sourceId: sourceId,
        });
      });
    checkUpdateNeeded();
    unsubscribenetinfo = NetInfo.addEventListener(_handleConnectionChange);
    return () => {
      unsubscribenetinfo && unsubscribenetinfo();
    };
  }, []);

  return (
    <Root>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Root>
  );
};

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
