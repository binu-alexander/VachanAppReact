import React, { Component } from 'react';
import { AppNavigator } from './app/routes/';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux'
import { Root } from "native-base";
import VersionCheck from 'react-native-version-check'
import { fetchAllContent, fetchVersionBooks } from './app/store/action/'
import { Alert, BackHandler, Linking } from 'react-native';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isloading: false,
      signedIn: false,
      checkedSignIn: false
    }
  }
  checkUpdateNeeded = async () => {
    let latestVersion = await VersionCheck.getLatestVersion();
    let currentVersion = await VersionCheck.getCurrentVersion();
    VersionCheck.needUpdate({
      currentVersion: currentVersion,
      latestVersion: latestVersion,
    }).then(res => {
      if (res.isNeeded) {
        Alert.alert('Please update your app ',
          'You have to update your app to the latest version to continue using',
          [{
            text: 'Update',
            onPress: () => {
              BackHandler.exitApp();
              Linking.openURL(updateNeeded.storeUrl)
            }
          },
          {
            text: 'Cancel',
            onPress: () => {
              return
            }
          }
          ]
        )
      }
    });
  }


  async componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide()
    }, 400)
    this.props.fetchAllContent()
    this.checkUpdateNeeded()
  }
 
  render() {
    return (
      <Root>
        <AppNavigator />
      </Root>
    )

  }
}
const mapStateToProps = state => {
  return {
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    contentType: state.updateVersion.parallelContentType,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchAllContent: () => dispatch(fetchAllContent()),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)