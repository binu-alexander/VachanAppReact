import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  Alert,
  Dimensions,
  StyleSheet,
  Platform,
  Share,
  AppState,
  Animated,
  NetInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DbQueries from '../../utils/dbQueries';
import VerseView from './VerseView';
import { APIAudioURL, fetchVersionBooks, selectContent, updateNetConnection, userInfo, updateVersionBook, updateVersion, updateMetadata } from '../../store/action/'
import CustomHeader from '../../components/Bible/CustomHeader'
import SelectBottomTabBar from '../../components/Bible/SelectBottomTabBar';
import ChapterNdAudio from '../../components/Bible/ChapterNdAudio';
import ReloadButton from '../../components/ReloadButton';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from './styles.js';
import { connect } from 'react-redux';
import Commentary from '../StudyHelp/Commentary/';
import Color from '../../utils/colorConstants';
import { Header, Button, Title, Toast } from 'native-base';
import BibleChapter from '../../components/Bible/BibleChapter';
import firebase from 'react-native-firebase';
import vApi from '../../utils/APIFetch';


const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const width = Dimensions.get('window').width;
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });

class Bible extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    }
  }


  constructor(props) {
    super(props);
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);
    this.state = {
      colorFile: this.props.colorFile,
      sizeFile: this.props.sizeFile,
      downloadedBook: [],
      audio: false,
      chapterContent: [],
      chapterHeader: null,
      error: null,
      isLoading: false,
      showBottomBar: false,
      bookmarksList: [],
      isBookmark: false,
      currentVisibleChapter: JSON.parse(this.props.chapterNumber),
      bookNumber: this.props.bookNumber,
      selectedReferenceSet: [],
      verseInLine: this.props.verseInLine,
      bottomHighlightText: false,
      HightlightedVerseArray: [],
      connection_Status: true,
      message: '',
      status: false,
      notesList: [],
      initializing: true,
      user: this.props.email,
      imageUrl: this.props.photo,
      // visibleParallelView: false,
      userData: '',
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      ),
    }

    this.getSelectedReferences = this.getSelectedReferences.bind(this)
    this.alertPresent
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
  }
  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;
  componentWillReceiveProps(nextProps, prevState) {
    this.setState({
      colorFile: nextProps.colorFile,
      sizeFile: nextProps.sizeFile,
    })
    this.styles = styles(nextProps.colorFile, nextProps.sizeFile);
  }

  async componentDidMount() {
    if (this.state.initializing) {
      this.setState({ initializing: false })
    }
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        return
      }
      else {
        this.setState({ user: user._user.email, userData: user, isLoading: false, imageUrl: user._user.photoURL })
        this.props.userInfo({
          email: user._user.email, uid: user._user.uid,
          userName: user._user.displayName, phoneNumber: null, photo: user._user.photoURL
        })
      }
    })
    this.state.scrollAnim.addListener(({ value }) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
      );
    });
    this.state.offsetAnim.addListener(({ value }) => {
      this._offsetValue = value;
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this._handleConnectivityChange
    );
    AppState.addEventListener('change', this._handleAppStateChange);

    this.subs = this.props.navigation.addListener("didFocus", () => {
      this.setState({ isLoading: true, selectedReferenceSet: [], showBottomBar: false, bookId: this.props.bookId, currentVisibleChapter: this.props.chapterNumber }, () => {
        this.getChapter()
        this.audioComponentUpdate()
        this.getHighlights()
        this.getBookMarks()
        this.getNotes()
        
        if (this.props.books.length == 0) {
          this.props.fetchVersionBooks({
            language: this.props.language,
            versionCode: this.props.versionCode,
            downloaded: this.props.downloaded,
            sourceId: this.props.sourceId
          })
        }
        this.setState({ isLoading: false })
      })
    })
  }
  // check internet connection to fetch api's accordingly
  _handleConnectivityChange = (isConnected) => {
    this.setState({ connection_Status: isConnected == true ? true : false }, () => {
      this.props.updateNetConnection(isConnected)
      if (this.state.connection_Status) {
        Toast.show({
          text: "Online. Now content available.",
          buttonText: "Okay",
          type: "success",
          duration: 3000
        })
        this.queryBookFromAPI(null)
        if (this.props.books.length == 0) {
          this.props.fetchVersionBooks({
            language: this.props.language,
            versionCode: this.props.versionCode,
            downloaded: this.props.downloaded,
            sourceId: this.props.sourceId
          })
        }


      } else {
        Toast.show({
          text: "Offline. Check your internet Connection.",
          buttonText: "Okay",
          type: "warning",
          duration: 3000
        })
      }
    })
  };

  // handle audio status on background, inactive and active state 
  _handleAppStateChange = (currentAppState) => {
    if (currentAppState == "background") {
      this.setState({ status: false })
    }
    if (currentAppState == "inactive") {
      this.setState({ status: false })
    }
    if (currentAppState == "active") {
      this.setState({ status: true })
    }
  }

  // update book name and chapter number onback from referenceSelection page (callback function) also this function is usefull to update only few required values of redux 
  getReference = async (item) => {
    this.setState({ selectedReferenceSet: [], showBottomBar: false })
    if (item) {
      var time = new Date()
      DbQueries.addHistory(this.props.sourceId, this.props.language, this.props.languageCode,
        this.props.versionCode, item.bookId, item.bookName, JSON.parse(item.chapterNumber), this.props.downloaded, time)

      this.props.updateVersionBook({
        bookId: item.bookId,
        bookName: item.bookName,
        chapterNumber: JSON.parse(item.chapterNumber),
        totalChapters: item.totalChapters,
      })
    }
    else {
      return
    }
  }
  // update language and version  onback from language list page (callback function) also this function is usefull to update only few required values of redux 
  updateLangVer = async (item) => {
    this.setState({ selectedReferenceSet: [], showBottomBar: false })

    if (item) {
      var bookName = null
      for (var i = 0; i <= item.books.length - 1; i++) {
        if (item.books[i].bookId == this.props.bookId) {
          bookName = item.books[i].bookName
        }
      }
      this.props.updateMetadata({
        copyrightHolder: item.metadata[0].copyrightHolder,
        description: item.metadata[0].description,
        license: item.metadata[0].license,
        source: item.metadata[0].source,
        technologyPartner: item.metadata[0].technologyPartner,
        revision: item.metadata[0].revision,
        versionNameGL: item.metadata[0].versionNameGL
      })

      this.props.updateVersion({
        language: item.languageName, languageCode: item.languageCode,
        versionCode: item.versionCode, sourceId: item.sourceId, downloaded: item.downloaded
      })

      this.props.updateVersionBook({
        bookId: this.props.bookId,
        bookName: bookName,
        chapterNumber: JSON.parse(this.state.currentVisibleChapter),
        totalChapters: this.props.totalChapters,
      })
      var time = new Date()
      DbQueries.addHistory(item.sourceId, item.languageName, item.languageCode,
        item.versionCode, this.props.bookId, bookName,
        JSON.parse(this.state.currentVisibleChapter), item.downloaded, time)

      this.props.fetchVersionBooks({
        language: item.languageName, versionCode: item.versionCode,
        downloaded: item.downloaded, sourceId: item.sourceId
      })

    } else {
      return
    }

  }
  // if book downloaded or user want to read downloaded book fetch chapter from local db
  async getDownloadedContent() {
    this.setState({ isLoading: true })
    var content = await DbQueries.queryVersions(this.props.language, this.props.versionCode, this.props.bookId, this.props.currentVisibleChapter)
    if (content != null) {
      this.setState({
        chapterHeader: content[0].chapters[this.state.currentVisibleChapter - 1].chapterHeading,
        downloadedBook: content[0].chapters,
        chapterContent: content[0].chapters[this.state.currentVisibleChapter - 1].verses,
        isLoading: false,
        error: null,
      })
    }
    else {
      this.setState({ chapterContent: [], isLoading: false })
    }

  }
  // fetch chapter on didmount call
  async getChapter() {
    try {
      if (this.props.downloaded) {
        this.getDownloadedContent()
      } else {
        var content = await vApi.get("bibles" + "/" + this.props.sourceId + "/" + "books" + "/" + this.props.bookId + "/" + "chapter" + "/" + this.state.currentVisibleChapter)
        if (content) {
          var header = content.chapterContent.metadata &&
            (content.chapterContent.metadata[0].section && content.chapterContent.metadata[0].section.text)
          this.setState({ chapterHeader: header, chapterContent: content.chapterContent.verses, error: null, isLoading: false, currentVisibleChapter: this.state.currentVisibleChapter })
        }
      }
    }
    catch (error) {
      this.setState({ error: error, isLoading: false, chapterContent: [] })
    }
    this.setState({ selectedReferenceSet: [], showBottomBar: false })
  }
  // fetching chapter content on next or prev icon press
  queryBookFromAPI = async (val) => {
    this.setState({ isLoading: true, selectedReferenceSet: [], showBottomBar: false, currentVisibleChapter: val != null ? JSON.parse(this.state.currentVisibleChapter) + val : this.state.currentVisibleChapter, error: null }, async () => {
      try {
        if (this.props.downloaded) {
          if (this.state.downloadedBook.length > 0) {
            this.setState({
              chapterHeader: this.state.downloadedBook[this.state.currentVisibleChapter - 1].chapterHeading,
              chapterContent: this.state.downloadedBook[this.state.currentVisibleChapter - 1].verses,
              isLoading: false
            })
          }
          else {
            this.getDownloadedContent()
          }
        } else {
          try {
            var content = await vApi.get("bibles" + "/" + this.props.sourceId + "/" + "books" + "/" + this.props.bookId + "/" + "chapter" + "/" + this.state.currentVisibleChapter)
            if (content) {
              var header = content.chapterContent.metadata &&
                (content.chapterContent.metadata[0].section && content.chapterContent.metadata[0].section.text)
              this.setState({ chapterHeader: header, chapterContent: content.chapterContent.verses, isLoading: false, currentVisibleChapter: this.state.currentVisibleChapter })
            }
          }
          catch (error) {
            this.setState({ isLoading: false, error: error, chapterContent: [] })
          }
        }

        this.props.updateVersionBook({
          bookId: this.props.bookId,
          bookName: this.props.bookName,
          chapterNumber: JSON.parse(this.state.currentVisibleChapter),
          totalChapters: this.props.totalChapters,
        })
        if(this.props.updatedVersionData.length > 0 ){
          this.props.updateVersion({
            language: this.props.updatedVersionData[0].language.name, languageCode: this.props.updatedVersionData[0].language.code,
            version:this.props.updatedVersionData[0].version.name,versionCode: this.props.updatedVersionData[0].version.code, sourceId: this.props.updatedVersionData[0].sourceId
          })
        }
        this.getHighlights()
        this.getNotes()
        this.isBookmark()
      }
      catch (error) {
        this.setState({ isLoading: false, error: error, chapterContent: [] })
      }
    })
  }

  // hide or show the audio component 
  toggleAudio = () => {
    if (this.state.audio) {
      this.setState({ status: !this.state.status })
    }
    else {
      Toast.show({
        text: 'No audio for ' + this.props.language + " " + this.props.bookName,
        buttonText: "Okay",
        duration: 3000
      })
    }
  }
  // check available book having audio or not
  async audioComponentUpdate() {
    var found = false
    let res = await vApi.get('audiobibles')
    try {
      if (res.length !== 0) {
        for (var key in res[0].audioBibles[0].books) {
          if (key == this.props.bookId) {
            found = true
            this.props.APIAudioURL({ audioURL: res[0].audioBibles[0].url, audioFormat: res[0].audioBibles[0].format })
            this.setState({ audio: true })
            break;
          }
        }
        if (found == false) {
          this.setState({ audio: false })
        }
      }
    }
    catch (error) {
      this.setState({ audio: false })
    }
  }
  // get highlights from firebase
  async getHighlights() {
    if (this.state.connection_Status) {
      if (this.props.email) {
        firebase.database().ref("users/" + this.props.userId + "/highlights/" + this.props.sourceId + "/" + this.props.bookId + "/" + this.state.currentVisibleChapter).on('value', (snapshot) => {
          if (snapshot.val() != null) {
            this.setState({
              HightlightedVerseArray: snapshot.val()
            })
          }
          else {
            this.setState({
              HightlightedVerseArray: []
            })
          }
        })
      }
      else {
        this.setState({
          HightlightedVerseArray: []
        })
      }
    } else {
      this.setState({
        HightlightedVerseArray: []
      })
    }
  }
  // get bookmarks from firebase
  async getBookMarks() {
    if (this.state.connection_Status) {
      if (this.props.email) {
        firebase.database().ref("users/" + this.props.userId + "/bookmarks/" + this.props.sourceId + "/" + this.props.bookId).once('value', (snapshot) => {
          if (snapshot.val() === null) {
            this.setState({ bookmarksList: [], isBookmark: false })
          }
          else {
            this.setState({ bookmarksList: snapshot.val() }, () => this.isBookmark())
          }
        })
      }
      else {
        this.setState({ bookmarksList: [], isBookmark: false })
      }
    } else {
      this.setState({ bookmarksList: [], isBookmark: false })
    }

  }
  //get notes from firebase
  getNotes() {
    if (this.state.connection_Status) {
      if (this.props.email) {
        firebase.database().ref("users/" + this.props.userId + "/notes/" + this.props.sourceId + "/" + this.props.bookId + "/" + this.state.currentVisibleChapter).once('value', (snapshot) => {
          this.state.notesList = []
          if (snapshot.val() === null) {
            this.setState({ notesList: [] })
          }
          else {
            if (Array.isArray(snapshot.val())) {
              this.setState({ notesList: snapshot.val() })
            }
            else {
              this.setState({
                notesList: [snapshot.val()]
              })
            }
          }
        })
      }
      else {
        this.setState({
          notesList: []
        })
      }
    } else {
      this.setState({
        notesList: []
      })
    }
  }
  //check chapter is bookmarked
  isBookmark = () => {
    if (this.state.bookmarksList.length > 0) {
      for (var i = 0; i < this.state.bookmarksList.length; i++) {
        if (this.state.bookmarksList[i] == this.state.currentVisibleChapter) {
          this.setState({ isBookmark: true })
          return
        }
      }
      this.setState({ isBookmark: false })
    }
    this.setState({ isBookmark: false })
  }

  //add book mark from header icon 
  onBookmarkPress = (isbookmark) => {
    if (this.state.connection_Status) {
      if (this.props.email) {
        var newBookmarks = isbookmark
          ? this.state.bookmarksList.filter((a) => a !== this.state.currentVisibleChapter)
          : this.state.bookmarksList.concat(this.state.currentVisibleChapter)
        firebase.database().ref("users/" + this.props.userId + "/bookmarks/" + this.props.sourceId + "/" + this.props.bookId).set(newBookmarks)
        this.setState({ bookmarksList: newBookmarks })
        this.setState({ isBookmark: !isbookmark })
        Toast.show({
          text: isbookmark ? 'Bookmarked chapter removed' : 'Chapter bookmarked',
          buttonText: "Okay",
          type: isbookmark ? "default" : "success",
          duration: 3000
        })
      }
      else {
        this.setState({ bookmarksList: [] })
        this.props.navigation.navigate("Login")
      }
    }
    else {
      this.setState({ bookmarksList: [] })
      Alert.alert("Please check your internet connecion")
    }
  }
  //selected reference for highlighting verse
  getSelectedReferences = (vIndex, chapterNum, vNum) => {
    if (vIndex != -1 && chapterNum != -1 && vNum != -1) {
      let obj = chapterNum + '_' + vIndex + '_' + vNum
      let selectedReferenceSet = [...this.state.selectedReferenceSet]
      var found = false;
      for (var i = 0; i < selectedReferenceSet.length; i++) {
        if (selectedReferenceSet[i] == obj) {
          found = true;
          selectedReferenceSet.splice(i, 1);
          break;
        }
      }
      if (!found) {
        selectedReferenceSet.push(obj)
      }
      this.setState({ selectedReferenceSet }, () => {
        let selectedCount = this.state.selectedReferenceSet.length, highlightCount = 0;
        for (let item of this.state.selectedReferenceSet) {
          let tempVal = item.split('_')
          for (var i = 0; i <= this.state.HightlightedVerseArray.length - 1; i++) {
            if (this.state.HightlightedVerseArray[i] == JSON.parse(tempVal[2])) {
              highlightCount++
            }
          }
        }
        this.setState({ showBottomBar: this.state.selectedReferenceSet.length > 0 ? true : false, bottomHighlightText: selectedCount == highlightCount ? false : true })
      })
    }
  }

  addToNotes = () => {
    if (this.state.connection_Status) {
      if (this.props.email) {
        let refList = []
        let id = this.props.bookId
        let name = this.props.bookName
        var verses = []
        for (let item of this.state.selectedReferenceSet) {

          let tempVal = item.split('_')
          const verseNumber = JSON.parse(tempVal[2])
          let refModel = {
            bookId: id,
            bookName: name,
            chapterNumber: parseInt(tempVal[0]),
            verseNumber: verseNumber,
            verseText: tempVal[3],
            versionCode: this.props.versionCode,
            languageName: this.props.language,
          };
          refList.push(refModel)
          verses.push(verseNumber)
        }
        this.props.navigation.navigate('EditNote', {
          referenceList: refList,
          notesList: this.state.notesList,
          bcvRef: {
            bookId: id,
            bookName: this.props.bookName,
            chapterNumber: this.state.currentVisibleChapter,
            verses: verses
          },
          contentBody: '',
          onbackNote: this.onbackNote,
          noteIndex: -1,
        })
      }
      else {
        this.props.navigation.navigate("Login")

      }
    } else {
      Alert.alert("Please check internet connection")
    }


    this.setState({ selectedReferenceSet: [], showBottomBar: false })
  }
  onbackNote = () => {
  }

  doHighlight = async () => {
    if (this.state.connection_Status) {
      if (this.props.email) {
        var array = [...this.state.HightlightedVerseArray]
        for (let item of this.state.selectedReferenceSet) {
          let tempVal = item.split('_')
          var index = array.indexOf(JSON.parse(tempVal[2]))
          if (this.state.bottomHighlightText) {
            if (index == -1) {
              array.push(JSON.parse(tempVal[2]))
            }
            this.setState({ HightlightedVerseArray: array })
          }
          else {
            array.splice(index, 1)
            this.setState({ HightlightedVerseArray: array })
          }
        }
        firebase.database().ref("users/" + this.props.userId + "/highlights/" + this.props.sourceId + "/" + this.props.bookId + "/" + this.state.currentVisibleChapter).set(array)
      }
      else {
        this.props.navigation.navigate("Login")
      }
    } else {
      Alert.alert("Please check internet connection")
    }

    this.setState({ selectedReferenceSet: [], showBottomBar: false })
  }

  //share verse
  addToShare = () => {
    let shareText = ''
    for (let item of this.state.selectedReferenceSet) {
      let tempVal = item.split('_')
      let chapterNumber = parseInt(tempVal[0])
      let vIndex = parseInt(tempVal[1])
      let verseNumber = tempVal[2]
      shareText = shareText.concat(this.props.bookName + " " + chapterNumber + ":" + verseNumber + " ");
      shareText = shareText.concat(tempVal[3])
      shareText = shareText.concat("\n");
    }
    Share.share({ message: shareText })
    this.setState({ selectedReferenceSet: [], showBottomBar: false })
  }

  componentWillUnmount() {
    var time = new Date()
    DbQueries.addHistory(item.sourceId, item.languageName, item.languageCode,
      item.versionCode, this.props.bookId, this.props.bookName, this.state.currentVisibleChapter, item.downloaded, time)
    this.subs.remove();
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this._handleConnectivityChange
    )
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
    AppState.removeEventListener('change', this._handleAppStateChange);
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  _keyExtractor = (item, index) => item.number;

  onSearch = () => {
    this.props.navigation.navigate('Search')
  }
  navigateToLanguage = () => {
    this.setState({ status: false })
    this.props.navigation.navigate("LanguageList", { updateLangVer: this.updateLangVer })
  }
  navigateToSelectionTab = () => {
    this.setState({ status: false })
    this.props.navigation.navigate("SelectionTab", {
      getReference: this.getReference,
      language: this.props.language,
      version: this.props.versionCode,
      sourceId: this.props.sourceId,
      downloaded: this.props.downloaded,
      parallelContent: this.props.visibleParallelView ? false : true, bookId: this.props.bookId, bookName: this.props.bookName,
      chapterNumber: this.state.currentVisibleChapter, totalChapters: this.props.totalChapters
    })
  }
  navigateToVideo = () => {
    this.props.navigation.navigate("Video", { bookId: this.props.bookId, bookName: this.props.bookName })
  }
  navigateToImage = () => {
    this.props.navigation.navigate("Infographics", { bookId: this.props.bookId, bookName: this.props.bookName })
  }
  navigateToSettings = () => {
    this.props.navigation.navigate("Settings")
  }

  toggleParallelView(value) {
    this.props.selectContent({ visibleParallelView: value })
    // this.setState({ visibleParallelView: value })
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const toValue = this._scrollValue > NAVBAR_HEIGHT &&
      this._clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
      ? this._offsetValue + NAVBAR_HEIGHT
      : this._offsetValue - NAVBAR_HEIGHT;

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };
  renderFooter = () => {
    if (this.state.chapterContent.length === 0) {
      return null
    } else {
      return (
        <View style={this.styles.addToSharefooterComponent}>
          {
            <View style={this.styles.footerView}>
              {(this.props.revision !== null && this.props.revision !== '') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Copyright:</Text>{' '}{this.props.revision}</Text>}
              {(this.props.license !== null && this.props.license !== '') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>License:</Text>{' '}{this.props.license}</Text>}
              {(this.props.technologyPartner !== null && this.props.technologyPartner !== '') && <Text style={this.styles.textListFooter}><Text style={this.styles.footerText}>Technology partner:</Text>{' '}{this.props.technologyPartner}</Text>}
            </View>
          }
        </View>
      )
    }
  }
  render() {
    return (
      <View style={this.styles.container}>
        {
          this.props.visibleParallelView ?
            <View style={{ position: 'absolute', top: 0, zIndex: 2, width: '50%' }}>
              <Header style={{ backgroundColor: Color.Blue_Color, height: 40 }}>
                <Button transparent onPress={() => this.navigateToSelectionTab(true)}>
                  <Title style={{ fontSize: 16 }}>{this.props.bookName.length > 10 ? this.props.bookName.slice(0, 9) + "..." : this.props.bookName} {this.state.currentVisibleChapter}</Title>
                  <Icon name="arrow-drop-down" color={Color.White} size={20} />
                </Button>
              </Header>
            </View>
            :
            <CustomHeader
              audio={this.state.audio}
              clampedScroll={this.state.clampedScroll}
              navigation={this.props.navigation}
              toggleAudio={this.toggleAudio}
              navigateToVideo={this.navigateToVideo}
              navigateToImage={this.navigateToImage}
              navigateToSettings={this.navigateToSettings}
              onSearch={this.onSearch}
              bookName={this.props.bookName}
              language={this.props.language}
              versionCode={this.props.versionCode}
              chapterNumber={this.state.currentVisibleChapter}
              onBookmark={this.onBookmarkPress}
              isBookmark={this.state.isBookmark}
              navigateToSelectionTab={this.navigateToSelectionTab}
              navigateToLanguage={this.navigateToLanguage}
            />
        }
        {
          this.state.isLoading &&
          <Spinner
            visible={true}
            textContent={'Loading...'}
          />
        }
        {/** Main View for the single or parrallel View */}
        <View style={this.styles.singleView}>
          {/** Single view with only bible text */}
          <View style={{ flexDirection: 'column', width: this.props.visibleParallelView ? '50%' : width }}>
            <AnimatedFlatlist
              data={this.state.chapterContent}
              contentContainerStyle={this.state.chapterContent.length === 0 ? this.styles.centerEmptySet : { margin: 16, marginTop: this.props.visibleParallelView ? 46 : 90 }}
              extraData={this.state}
              scrollEventThrottle={1}
              onMomentumScrollBegin={this._onMomentumScrollBegin}
              onMomentumScrollEnd={this._onMomentumScrollEnd}
              onScrollEndDrag={this._onScrollEndDrag}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
                { useNativeDriver: true },
              )}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) =>
                <VerseView
                  ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
                  verseData={item}
                  chapterHeader={this.state.chapterHeader}
                  index={index}
                  styles={this.styles}
                  selectedReferences={this.state.selectedReferenceSet}
                  getSelection={(verseIndex, chapterNumber, verseNumber, text) => {
                    this.props.visibleParallelView == false && this.getSelectedReferences(verseIndex, chapterNumber, verseNumber, text)
                  }}
                  HightlightedVerse={this.state.HightlightedVerseArray}
                  notesList={this.state.notesList}
                  chapterNumber={this.state.currentVisibleChapter}
                  navigation={this.props.navigation}
                />
              }
              keyExtractor={this._keyExtractor}
              ListFooterComponent={this.renderFooter}
              ListEmptyComponent={<ReloadButton styles={this.styles} reloadFunction={this.queryBookFromAPI} />}
            />
            {
              this.state.chapterContent.length > 0 &&
              <View style={{ flex: 1 }}>
                <ChapterNdAudio
                  styles={this.styles}
                  audio={this.state.audio}
                  currentVisibleChapter={this.state.currentVisibleChapter}
                  status={this.props.visibleParallelView ? false : this.state.status}
                  visibleParallelView={this.props.visibleParallelView}
                  languageCode={this.props.languageCode}
                  versionCode={this.props.versionCode}
                  bookId={this.props.bookId}
                  totalChapters={this.props.totalChapters}
                  showBottomBar={this.state.showBottomBar}
                  navigation={this.props.navigation}
                  queryBookFromAPI={this.queryBookFromAPI}
                />
                {this.props.visibleParallelView == false &&
                  this.state.showBottomBar &&
                  <SelectBottomTabBar
                    styles={this.styles}
                    bottomHighlightText={this.state.bottomHighlightText}
                    doHighlight={this.doHighlight}
                    addToNotes={this.addToNotes}
                    addToShare={this.addToShare}
                  />}
              </View>
            }

          </View>
          {/** 2nd view as  parallelView**/}
          {
            this.props.visibleParallelView == true && (
              <View style={this.styles.parallelView}>
                {
                  this.props.contentType == 'bible' &&
                  <BibleChapter
                    currentChapter={this.state.currentVisibleChapter}
                    id={this.props.bookId}
                    bookName={this.props.bookName}
                    toggleParallelView={(value) => this.toggleParallelView(value)}
                    totalChapters={this.props.totalChapters}
                    navigation={this.props.navigation}
                  />
                }
                {
                  this.props.contentType == 'commentary' &&
                  <Commentary
                    id={this.props.bookId}
                    bookName={this.props.bookName}
                    toggleParallelView={(value) => this.toggleParallelView(value)}
                    currentVisibleChapter={this.state.currentVisibleChapter}
                  />
                }
              </View>
            )}
        </View>
      </View>
    )
  }
}
const navStyles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
    paddingTop: STATUS_BAR_HEIGHT,
  },
  title: {
    color: '#333333',
  },
  headerLeftStyle: {
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flex: 1,
  },
  border: {
    paddingHorizontal: 4,
    paddingVertical: 4,

    borderWidth: 0.2,
    borderColor: Color.White
  },
  headerRightStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    flex: 1,
  },
  touchableStyleRight: {

  },

  touchableStyleLeft: {
    flexDirection: "row",
    marginHorizontal: 8
  },
  headerTextStyle: {
    fontSize: 18,
    color: Color.White,
    textAlign: 'center'
  },
})

const mapStateToProps = state => {
  return {
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    contentType: state.updateVersion.parallelContentType,

    baseAPI: state.updateVersion.baseAPI,

    chapterNumber: state.updateVersion.chapterNumber,
    totalChapters: state.updateVersion.totalChapters,
    bookName: state.updateVersion.bookName,
    bookId: state.updateVersion.bookId,

    revision: state.updateVersion.revision,
    license: state.updateVersion.license,
    technologyPartner: state.updateVersion.technologyPartner,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    netConnection: state.updateStyling.netConnection,

    email: state.userInfo.email,
    userId: state.userInfo.uid,

    books: state.versionFetch.data,
    parallelContentType: state.updateVersion.parallelContentType,
    updatedVersionData:state.versionFetch.language,
    visibleParallelView: state.selectContent.visibleParallelView,

  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateVersion: (payload) => dispatch(updateVersion(payload)),
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
    userInfo: (payload) => dispatch(userInfo(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    updateMetadata: (payload) => dispatch(updateMetadata(payload)),
    updateNetConnection: (payload) => dispatch(updateNetConnection(payload)),
    APIAudioURL: (payload) => dispatch(APIAudioURL(payload)),
    selectContent: (payload) => dispatch(selectContent(payload)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Bible) 