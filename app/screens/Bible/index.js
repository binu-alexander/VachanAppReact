import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Alert,
  Dimensions,
  Share,
  AppState,
  Animated,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/MaterialIcons";
import { createResponder } from "react-native-gesture-responder";
import DbQueries from "../../utils/dbQueries";
import VerseView from "./VerseView";
// var RNFS = require("react-native-fs");
import {
  extraSmallFont,
  smallFont,
  mediumFont,
  largeFont,
  extraLargeFont,
} from "../../utils/dimens.js";
import {
  APIAudioURL,
  ToggleAudio,
  fetchVersionBooks,
  selectContent,
  parallelVisibleView,
  updateNetConnection,
  userInfo,
  updateVersionBook,
  updateVerseNumber,
  updateFontSize,
  updateVersion,
  updateMetadata,
  // allBooksSuccess,
} from "../../store/action/";
import { getBookChaptersFromMapping } from "../../utils/UtilFunctions";
import CustomHeader from "../../components/Bible/CustomHeader";
import SelectBottomTabBar from "../../components/Bible/SelectBottomTabBar";
import ChapterNdAudio from "../../components/Bible/ChapterNdAudio";
import ReloadButton from "../../components/ReloadButton";
import Spinner from "react-native-loading-spinner-overlay";
import { styles } from "./styles.js";
import { connect } from "react-redux";
import Commentary from "../StudyHelp/Commentary/";
import Color from "../../utils/colorConstants";
import { Header, Button, Title, Toast } from "native-base";
import BibleChapter from "../../components/Bible/BibleChapter";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import vApi from "../../utils/APIFetch";
import HighlightColorGrid from "../../components/Bible/HighlightColorGrid";
import { getHeading, AndroidPermission } from "../../utils/UtilFunctions";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Permission from "../../utils/constants";
const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const width = Dimensions.get("window").width;
const NAVBAR_HEIGHT = 64;
// eslint-disable-next-line no-undef
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });

class Bible extends Component {
  constructor(props) {
    super(props);
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);
    this.itemHeights = [];
    this.arrLayout = [];
    this.state = {
      colorFile: this.props.colorFile,
      sizeFile: this.props.sizeFile,
      downloadedBook: [],
      audio: false,
      uid: this.props.userId,
      chapterContent: [],
      chapterHeader: null,
      error: null,
      isLoading: false,
      showBottomBar: false,
      bookmarksList: [],
      isBookmark: false,
      showColorGrid: false,
      currentVisibleChapter: parseInt(this.props.chapterNumber),
      bookNumber: this.props.bookNumber,
      nextContent: null,
      previousContent: null,
      selectedReferenceSet: [],
      verseInLine: this.props.verseInLine,
      bottomHighlightText: false,
      HightlightedVerseArray: [],
      connection_Status: true,
      message: "",
      status: false,
      notesList: [],
      initializing: true,
      email: this.props.email,
      imageUrl: this.props.photo,
      unAvailableContent: null,
      userData: "",
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: "clamp",
          }),
          offsetAnim
        ),
        0,
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT
      ),
    };

    this.getSelectedReferences = this.getSelectedReferences.bind(this);
    this.alertPresent;
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
  }
  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;

  async componentDidMount() {
    if (this.state.initializing) {
      this.setState({ initializing: false });
    }
    this.unsubscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user._user.email,
          userData: user,
          isLoading: false,
          imageUrl: user._user.photoURL,
        });
        this.props.userInfo({
          email: user._user.email,
          uid: user._user.uid,
          userName: user._user.displayName,
          phoneNumber: null,
          photo: user._user.photoURL,
        });
        this.setState({ uid: user._user.uid, email: user._user.email });
      } else {
        this.props.userInfo({
          email: null,
          uid: null,
          userName: null,
          phoneNumber: null,
          photo: null,
        });
        this.setState({ uid: null, email: null });
      }
    });
    this.ZoomTextSize();
    this.state.scrollAnim.addListener(({ value }) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT
      );
    });
    this.state.offsetAnim.addListener(({ value }) => {
      this._offsetValue = value;
    });

    this.unsubscribenetinfo = NetInfo.addEventListener(
      this._handleConnectivityChange
    );

    AppState.addEventListener("change", this._handleAppStateChange);
    this.subs = this.props.navigation.addListener("focus", () => {
      this.setState(
        {
          isLoading: true,
          selectedReferenceSet: [],
          showBottomBar: false,
          showColorGrid: false,
          currentVisibleChapter: this.props.chapterNumber,
          audio: this.props.audio,
          status: this.props.status,
        },
        () => {
          this.getChapter();
          this.audioComponentUpdate();
          this.getHighlights();
          this.getBookMarks();
          this.getNotes();
          if (this.props.books.length == 0) {
            this.props.fetchVersionBooks({
              language: this.props.language,
              versionCode: this.props.versionCode,
              downloaded: this.props.downloaded,
              sourceId: this.props.sourceId,
            });
          }
          this.setState({ isLoading: false });
        }
      );
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.language != this.props.language ||
      prevProps.sourceId != this.props.sourceId ||
      prevProps.baseAPI != this.props.baseAPI ||
      prevProps.bookId != this.props.bookId ||
      prevProps.chapterNumber != this.props.chapterNumber ||
      prevProps.books.length != this.props.books.length
    ) {
      this.queryBookFromAPI(null);
      this.audioComponentUpdate();
      if (this.props.books.length == 0) {
        this.props.fetchVersionBooks({
          language: this.props.language,
          versionCode: this.props.versionCode,
          downloaded: this.props.downloaded,
          sourceId: this.props.sourceId,
        });
      }
    }
    if (prevProps.selectedVerse != this.props.selectedVerse) {
      this.scrollToVerse(this.props.selectedVerse);
    }
  }
  // check internet connection to fetch api's accordingly
  _handleConnectivityChange = (state) => {
    this.setState({
      connection_Status: state.isConnected == true ? true : false,
    });
    if (state.isConnected === true) {
      this.queryBookFromAPI(null);
      Toast.show({
        text: "Online. Now content available.",
        type: "success",
        duration: 5000,
      });
      if (this.props.books.length == 0) {
        this.props.fetchVersionBooks({
          language: this.props.language,
          versionCode: this.props.versionCode,
          downloaded: this.props.downloaded,
          sourceId: this.props.sourceId,
        });
      }
    } else {
      Toast.show({
        text: "Offline. Check your internet Connection.",
        type: "warning",
        duration: 5000,
      });
    }
  };

  // handle audio status on background, inactive and active state
  _handleAppStateChange = (currentAppState) => {
    if (currentAppState == "background") {
      this.setState({ status: false });
    }
    if (currentAppState == "inactive") {
      this.setState({ status: false });
    }
    if (currentAppState == "active") {
      this.setState({ status: true });
    }
  };
  // update book name and chapter number onback from referenceSelection page (callback function) also this function is usefull to update only few required values of redux
  getReference = async (item) => {
    console.log("REF ", item);
    this.setState({
      selectedReferenceSet: [],
      showBottomBar: false,
      showColorGrid: false,
    });
    if (item) {
      var time = new Date();
      DbQueries.addHistory(
        this.props.sourceId,
        this.props.language,
        this.props.languageCode,
        this.props.versionCode,
        item.bookId,
        item.bookName,
        parseInt(item.chapterNumber),
        this.props.downloaded,
        time
      );
      this.setState({
        currentVisibleChapter: item.chapterNumber,
        bookId: item.bookId,
        bookName: item.bookName,
      });
      this.props.updateVerseNumber({ selectedVerse: item.selectedVerse });
      this.props.updateVersionBook({
        bookId: item.bookId,
        bookName: item.bookName,
        chapterNumber: parseInt(item.chapterNumber),
        totalChapters: item.totalChapters,
      });
      // this.scrollToVerse(item.selectedVerse)
    } else {
      return;
    }
  };
  // update language and version  onback from language list page (callback function) also this function is usefull to update only few required values of redux
  updateLangVer = async (item) => {
    this.setState({
      selectedReferenceSet: [],
      showBottomBar: false,
      showColorGrid: false,
    });
    if (item) {
      let bookName = null;
      let bookId = null;
      let bookItem = item.books.filter((i) => i.bookId == this.props.bookId);
      if (bookItem.length > 0) {
        bookName = bookItem[0].bookName;
        bookId = bookItem[0].bookId;
      } else {
        for (var i = 0; i <= item.books.length - 1; i++) {
          if (item.books[i].bookId >= 39) {
            if (item.books[i].bookId == "gen") {
              bookName = item.books[i].bookName;
              bookId = item.books[i].bookId;
            }
          } else {
            if (item.books[i].bookId == "mat") {
              bookName = item.books[i].bookName;
              bookId = item.books[i].bookId;
            }
          }
        }
      }
      let chapterNum =
        parseInt(this.state.currentVisibleChapter) >
        getBookChaptersFromMapping(bookId)
          ? 1
          : parseInt(this.state.currentVisibleChapter);
      this.props.updateMetadata({
        copyrightHolder: item.metadata[0].copyrightHolder,
        description: item.metadata[0].description,
        license: item.metadata[0].license,
        source: item.metadata[0].source,
        technologyPartner: item.metadata[0].technologyPartner,
        revision: item.metadata[0].revision,
        versionNameGL: item.metadata[0].versionNameGL,
      });
      this.props.updateVersion({
        language: item.languageName,
        languageCode: item.languageCode,
        versionCode: item.versionCode,
        sourceId: item.sourceId,
        downloaded: item.downloaded,
      });
      this.props.updateVersionBook({
        bookId: bookId,
        bookName: bookName,
        chapterNumber: chapterNum,
        totalChapters: getBookChaptersFromMapping(bookId),
      });
      this.props.fetchVersionBooks({
        language: item.languageName,
        versionCode: item.versionCode,
        downloaded: item.downloaded,
        sourceId: item.sourceId,
      });
      this.setState({ previousContent: null, nextContent: null });
      var time = new Date();
      DbQueries.addHistory(
        item.sourceId,
        item.languageName,
        item.languageCode,
        item.versionCode,
        bookId,
        bookName,
        chapterNum,
        item.downloaded,
        time
      );
    } else {
      return;
    }
  };
  // if book downloaded or user want to read downloaded book fetch chapter from local db
  async getDownloadedContent() {
    this.setState({ isLoading: true });
    var content = await DbQueries.queryVersions(
      this.props.language,
      this.props.versionCode,
      this.props.bookId,
      this.props.currentVisibleChapter
    );
    if (content != null) {
      this.setState({
        chapterHeader:
          content[0].chapters[this.state.currentVisibleChapter - 1]
            .chapterHeading,
        downloadedBook: content[0].chapters,
        chapterContent:
          content[0].chapters[this.state.currentVisibleChapter - 1].verses,
        isLoading: false,
        error: null,
        previousContent: null,
        nextContent: null,
      });
    } else {
      this.setState({
        chapterContent: [],
        unAvailableContent: true,
        isLoading: false,
      });
    }
  }

  // fetch chapter on didmount call
  async getChapter() {
    try {
      if (this.props.downloaded) {
        this.getDownloadedContent();
      } else {
        if (this.props.baseAPI != null) {
          var content = await vApi.get(
            "bibles" +
              "/" +
              this.props.sourceId +
              "/" +
              "books" +
              "/" +
              this.props.bookId +
              "/" +
              "chapter" +
              "/" +
              this.state.currentVisibleChapter
          );
          if (content) {
            let header = getHeading(content.chapterContent.contents);
            this.setState({
              chapterHeader: header,
              chapterContent: content.chapterContent.contents,
              error: null,
              isLoading: false,
              currentVisibleChapter: this.state.currentVisibleChapter,
              nextContent: content.next,
              previousContent: content.previous,
            });
          }
        }
      }
    } catch (error) {
      this.setState({
        error: error,
        isLoading: false,
        chapterContent: [],
        unAvailableContent: true,
      });
    }
    this.setState({
      selectedReferenceSet: [],
      showBottomBar: false,
      showColorGrid: false,
    });
  }

  // fetching chapter content on next or prev icon press
  queryBookFromAPI = (chapterInfo) => {
    try {
      let bookName = null;
      let bookItem = this.props.books.filter(
        (val) => val.bookId == this.props.bookId
      );
      if (bookItem.length > 0) {
        bookName = bookItem[0].bookName;
      }

      let chapterType = typeof chapterInfo;
      let allData = chapterType == "object" && chapterInfo;

      let chapterNum =
        chapterType == "boolean" &&
        (chapterInfo === true
          ? this.state.currentVisibleChapter + 1
          : this.state.currentVisibleChapter - 1);
      let cNum =
        chapterType == "boolean"
          ? parseInt(chapterNum)
          : allData
          ? parseInt(allData.chapterId)
          : this.props.chapterNumber;

      let bookId = allData ? allData.bibleBookCode : this.props.bookId;
      let bName = bookName != null ? bookName : this.props.bookName;

      this.setState(
        {
          isLoading: true,
          selectedReferenceSet: [],
          showColorGrid: false,
          showBottomBar: false,
          currentVisibleChapter: cNum,
          error: null,
        },
        async () => {
          if (this.props.downloaded) {
            if (this.state.downloadedBook.length > 0) {
              this.setState({
                chapterHeader:
                  this.state.downloadedBook[
                    this.state.currentVisibleChapter - 1
                  ].chapterHeading,
                chapterContent:
                  this.state.downloadedBook[
                    this.state.currentVisibleChapter - 1
                  ].verses,
                isLoading: false,
                previousContent: null,
                nextContent: null,
              });
            } else {
              this.getDownloadedContent();
            }
          } else {
            try {
              var content = await vApi.get(
                "bibles" +
                  "/" +
                  this.props.sourceId +
                  "/" +
                  "books" +
                  "/" +
                  bookId +
                  "/" +
                  "chapter" +
                  "/" +
                  this.state.currentVisibleChapter
              );
              if (content) {
                let header = getHeading(content.chapterContent.contents);
                this.setState({
                  chapterHeader: header,
                  chapterContent: content.chapterContent.contents,
                  isLoading: false,
                  currentVisibleChapter: this.state.currentVisibleChapter,
                  nextContent: content.next,
                  previousContent: content.previous,
                });
              }
            } catch (error) {
              this.setState({
                isLoading: false,
                error: error,
                chapterContent: [],
                unAvailableContent: true,
              });
            }
          }
        }
      );
      this.props.updateVersionBook({
        bookId: bookId,
        bookName: bName,
        chapterNumber:
          parseInt(cNum) > getBookChaptersFromMapping(bookId)
            ? 1
            : parseInt(cNum),
        totalChapters: getBookChaptersFromMapping(bookId),
      });
      this.getHighlights();
      this.getNotes();
      this.isBookmark();
    } catch (error) {
      this.setState({
        isLoading: false,
        error: error,
        chapterContent: [],
        unAvailableContent: true,
      });
    }
  };

  // hide or show the audio component
  toggleAudio = () => {
    if (this.state.audio) {
      this.setState({ status: !this.state.status });
    } else {
      Toast.show({
        text: "No audio for " + this.props.language + " " + this.props.bookName,
        duration: 5000,
      });
    }
  };
  // check available book having audio or not
  async audioComponentUpdate() {
    let res = await vApi.get("audiobibles");
    try {
      if (res.length !== 0) {
        let data = res.filter((item) => {
          if (item.language.name == this.props.language.toLowerCase()) {
            return item;
          }
        });
        if (data.length != 0) {
          this.props.APIAudioURL({
            audioURL: data[0].audioBibles[0].url,
            audioFormat: data[0].audioBibles[0].format,
            audioList: data[0].audioBibles,
          });
          this.setState({ audio: true });
        } else {
          this.props.APIAudioURL({ audioURL: null, audioFormat: null });
          this.setState({ audio: false });
        }
      }
    } catch (error) {
      this.setState({ audio: false });
    }
  }
  // get highlights from firebase
  async getHighlights() {
    if (this.state.connection_Status) {
      if (this.state.email) {
        database()
          .ref(
            "users/" +
              this.state.uid +
              "/highlights/" +
              this.props.sourceId +
              "/" +
              this.props.bookId +
              "/" +
              this.state.currentVisibleChapter
          )
          .on("value", (snapshot) => {
            if (snapshot.val() != null) {
              let value = snapshot.val();
              let HightlightedVerseArray = [];
              for (var i = 0; i < value.length; i++) {
                if (isNaN(value[i])) {
                  HightlightedVerseArray.push(value[i]);
                } else {
                  let addColor = value[i] + ":" + Color.highlightColorA.const;
                  HightlightedVerseArray.push(addColor);
                }
                this.setState({
                  HightlightedVerseArray,
                });
              }
            } else {
              this.setState({
                HightlightedVerseArray: [],
              });
            }
          });
      } else {
        this.setState({
          HightlightedVerseArray: [],
        });
      }
    } else {
      this.setState({
        HightlightedVerseArray: [],
      });
    }
  }
  // get bookmarks from firebase
  async getBookMarks() {
    if (this.state.connection_Status) {
      if (this.state.email) {
        database()
          .ref(
            "users/" +
              this.state.uid +
              "/bookmarks/" +
              this.props.sourceId +
              "/" +
              this.props.bookId
          )
          .on("value", (snapshot) => {
            if (snapshot.val() === null) {
              this.setState({ bookmarksList: [], isBookmark: false });
            } else {
              this.setState({ bookmarksList: snapshot.val() }, () =>
                this.isBookmark()
              );
            }
          });
      } else {
        this.setState({ bookmarksList: [], isBookmark: false });
      }
    } else {
      this.setState({ bookmarksList: [], isBookmark: false });
    }
  }
  //get notes from firebase
  getNotes() {
    if (this.state.connection_Status) {
      if (this.state.email) {
        database()
          .ref(
            "users/" +
              this.state.uid +
              "/notes/" +
              this.props.sourceId +
              "/" +
              this.props.bookId +
              "/" +
              this.state.currentVisibleChapter
          )
          .on("value", (snapshot) => {
            // this.state.notesList = [];
            if (snapshot.val() === null) {
              this.setState({ notesList: [] });
            } else {
              if (Array.isArray(snapshot.val())) {
                this.setState({ notesList: snapshot.val() });
              } else {
                this.setState({
                  notesList: [snapshot.val()],
                });
              }
            }
          });
      } else {
        this.setState({
          notesList: [],
        });
      }
    } else {
      this.setState({
        notesList: [],
      });
    }
  }
  //check chapter is bookmarked
  isBookmark = () => {
    if (this.state.bookmarksList.length > 0) {
      for (var i = 0; i < this.state.bookmarksList.length; i++) {
        if (this.state.bookmarksList[i] == this.state.currentVisibleChapter) {
          this.setState({ isBookmark: true });
          return;
        }
      }
      this.setState({ isBookmark: false });
    }
    this.setState({ isBookmark: false });
  };

  //add book mark from header icon
  onBookmarkPress = (isbookmark) => {
    if (this.state.connection_Status) {
      if (this.state.email) {
        var newBookmarks = isbookmark
          ? this.state.bookmarksList.filter(
              (a) => a !== this.state.currentVisibleChapter
            )
          : this.state.bookmarksList.concat(this.state.currentVisibleChapter);
        database()
          .ref(
            "users/" +
              this.state.uid +
              "/bookmarks/" +
              this.props.sourceId +
              "/" +
              this.props.bookId
          )
          .set(newBookmarks);
        this.setState({ bookmarksList: newBookmarks });
        this.setState({ isBookmark: !isbookmark });
        Toast.show({
          text: isbookmark
            ? "Bookmarked chapter removed"
            : "Chapter bookmarked",
          type: isbookmark ? "default" : "success",
          duration: 5000,
        });
      } else {
        this.setState({ bookmarksList: [] });
        this.props.navigation.navigate("Login");
      }
    } else {
      this.setState({ bookmarksList: [] });
      Alert.alert("Please check your internet connecion");
    }
  };
  //selected reference for highlighting verse
  getSelectedReferences = (vIndex, chapterNum, vNum, text) => {
    if (vIndex != -1 && chapterNum != -1 && vNum != -1) {
      let obj = chapterNum + "_" + vIndex + "_" + vNum + "_" + text;
      let selectedReferenceSet = [...this.state.selectedReferenceSet];
      var found = false;
      for (var i = 0; i < selectedReferenceSet.length; i++) {
        if (selectedReferenceSet[i] == obj) {
          found = true;
          selectedReferenceSet.splice(i, 1);
          break;
        }
      }
      if (!found) {
        selectedReferenceSet.push(obj);
      }
      this.setState({ selectedReferenceSet }, () => {
        let selectedCount = this.state.selectedReferenceSet.length,
          highlightCount = 0;
        for (let item of this.state.selectedReferenceSet) {
          let tempVal = item.split("_");
          for (
            var i = 0;
            i <= this.state.HightlightedVerseArray.length - 1;
            i++
          ) {
            let regexMatch = /(\d+):([a-zA-Z]+)/;
            if (this.state.HightlightedVerseArray[i]) {
              let match =
                this.state.HightlightedVerseArray[i].match(regexMatch);
              if (match) {
                if (parseInt(match[1]) == parseInt(tempVal[2])) {
                  highlightCount++;
                }
              }
            }
          }
        }
        this.setState({
          showBottomBar:
            this.state.selectedReferenceSet.length > 0 ? true : false,
          bottomHighlightText: selectedCount == highlightCount ? false : true,
          showColorGrid: selectedCount == highlightCount ? false : true,
        });
      });
    }
  };

  addToNotes = () => {
    if (this.state.connection_Status) {
      if (this.state.email) {
        let refList = [];
        let id = this.props.bookId;
        let name = this.props.bookName;
        var verses = [];
        for (let item of this.state.selectedReferenceSet) {
          let tempVal = item.split("_");
          const verseNumber = parseInt(tempVal[2]);
          let refModel = {
            bookId: id,
            bookName: name,
            chapterNumber: parseInt(tempVal[0]),
            verseNumber: verseNumber,
            verseText: tempVal[3],
            versionCode: this.props.versionCode,
            languageName: this.props.language,
          };
          refList.push(refModel);
          verses.push(verseNumber);
        }
        this.props.navigation.navigate("EditNote", {
          referenceList: refList,
          notesList: this.state.notesList,
          bcvRef: {
            bookId: id,
            bookName: this.props.bookName,
            chapterNumber: this.state.currentVisibleChapter,
            verses: verses,
          },
          contentBody: "",
          onbackNote: this.onbackNote,
          noteIndex: -1,
        });
      } else {
        this.props.navigation.navigate("Login");
      }
    } else {
      Alert.alert("Please check internet connection");
    }
    this.setState({
      selectedReferenceSet: [],
      showBottomBar: false,
      showColorGrid: false,
    });
  };
  onbackNote = () => {};

  setHighlightColor = (color) => {
    let value = Color.highlightColorA.const;
    switch (color) {
      case Color.highlightColorA.code:
        value = Color.highlightColorA.const;
        break;
      case Color.highlightColorB.code:
        value = Color.highlightColorB.const;
        break;
      case Color.highlightColorC.code:
        value = Color.highlightColorC.const;
        break;
      case Color.highlightColorD.code:
        value = Color.highlightColorD.const;
        break;
      case Color.highlightColorE.code:
        value = Color.highlightColorE.const;
        break;
      default:
        value = Color.highlightColorA.const;
    }
    return value;
  };

  doHighlight = async (color) => {
    if (this.state.connection_Status) {
      if (this.state.email) {
        var array = [...this.state.HightlightedVerseArray];
        for (let item of this.state.selectedReferenceSet) {
          let tempVal = item.split("_");
          let selectedColor = this.setHighlightColor(color);
          let val = tempVal[2].trim() + ":" + selectedColor;

          for (var i = 0; i < array.length; i++) {
            let regexMatch = /(\d+):([a-zA-Z]+)/;
            if (array[i]) {
              let match = array[i].match(regexMatch);
              if (match) {
                if (parseInt(match[1]) == parseInt(tempVal[2])) {
                  array.splice(i, 1);
                  this.setState({ HightlightedVerseArray: array });
                }
              }
            }
          }
          var index = array.indexOf(val);
          //solve the issue of 2 color on single verse
          if (this.state.bottomHighlightText) {
            if (index == -1) {
              array.push(val);
            }
            this.setState({ HightlightedVerseArray: array });
          }
        }
        database()
          .ref(
            "users/" +
              this.state.uid +
              "/highlights/" +
              this.props.sourceId +
              "/" +
              this.props.bookId +
              "/" +
              this.state.currentVisibleChapter
          )
          .set(array);
      } else {
        this.props.navigation.navigate("Login");
      }
    } else {
      Alert.alert("Please check internet connection");
    }
    this.setState({
      selectedReferenceSet: [],
      showBottomBar: false,
      showColorGrid: false,
    });
  };

  //share verse
  addToShare = () => {
    let shareText = "";
    for (let item of this.state.selectedReferenceSet) {
      let tempVal = item.split("_");
      let chapterNumber = parseInt(tempVal[0]);
      // let vIndex = parseInt(tempVal[1]);
      let verseNumber = tempVal[2];
      shareText = shareText.concat(
        this.props.bookName + " " + chapterNumber + ":" + verseNumber + " "
      );
      shareText = shareText.concat(tempVal[3]);
      shareText = shareText.concat("\n");
    }
    Share.share({ message: shareText });
    this.setState({
      selectedReferenceSet: [],
      showBottomBar: false,
      showColorGrid: false,
    });
  };

  componentWillUnmount() {
    var time = new Date();
    DbQueries.addHistory(
      this.props.sourceId,
      this.props.language,
      this.props.languageCode,
      this.props.versionCode,
      this.props.bookId,
      this.props.bookName,
      this.state.currentVisibleChapter,
      this.props.downloaded,
      time
    );
    this.subs && this.subs();
    this.unsubscriber && this.unsubscriber();
    this.unsubscribenetinfo && this.unsubscribenetinfo();
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
    this.props.ToggleAudio({ status: false, audio: false });
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  // _keyExtractor = (item, index) => item.number;
  _keyExtractor = (item) => {
    return this.props.downloaded ? item.number : item.verseNumber;
  };

  onSearch = () => {
    this.props.navigation.navigate("Search");
  };
  changeSizeByOne = (value) => {
    switch (this.props.sizeMode) {
      case 0: {
        if (value == -1) {
          return;
        } else {
          this.styles = styles(this.props.colorFile, smallFont);
          this.props.updateFontSize(1);
        }
        break;
      }
      case 1: {
        if (value == -1) {
          this.styles = styles(this.props.colorFile, extraSmallFont);
          this.props.updateFontSize(0);
        } else {
          this.styles = styles(this.props.colorFile, mediumFont);
          this.props.updateFontSize(2);
        }
        break;
      }
      case 2: {
        if (value == -1) {
          this.styles = styles(this.props.colorFile, smallFont);
          this.props.updateFontSize(1);
        } else {
          this.styles = styles(this.props.colorFile, largeFont);
          this.props.updateFontSize(3);
        }
        break;
      }
      case 3: {
        if (value == -1) {
          this.styles = styles(this.props.colorFile, mediumFont);
          this.props.updateFontSize(2);
        } else {
          this.styles = styles(this.props.colorFile, extraLargeFont);
          this.props.updateFontSize(4);
        }
        break;
      }
      case 4: {
        if (value == -1) {
          this.styles = styles(this.props.colorFile, largeFont);
          this.props.updateFontSize(3);
        } else {
          return;
        }
        break;
      }
    }
  };
  ZoomTextSize = () => {
    this.gestureResponder = createResponder({
      // onStartShouldSetResponder: (evt, gestureState) => true,
      onStartShouldSetResponder: () => true,
      //onStartShouldSetResponderCapture: (evt, gestureState) => true,
      onStartShouldSetResponderCapture: () => true,
      //onMoveShouldSetResponder: (evt, gestureState) => true,
      onMoveShouldSetResponder: () => true,
      //onMoveShouldSetResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetResponderCapture: () => true,
      //onResponderGrant: (evt, gestureState) => {},
      onResponderGrant: () => {},
      //onResponderMove: (evt, gestureState) => {
      onResponderMove: (gestureState) => {
        let thumbSize = this.state.thumbSize;
        if (gestureState.pinch && gestureState.previousPinch) {
          thumbSize *= gestureState.pinch / gestureState.previousPinch;
          let currentDate = new Date().getTime();
          let diff = currentDate - this.pinchTime;
          if (diff > this.pinchDiff) {
            if (gestureState.pinch - gestureState.previousPinch > 5) {
              // large
              this.changeSizeByOne(1);
            } else if (gestureState.previousPinch - gestureState.pinch > 5) {
              // small
              this.changeSizeByOne(-1);
            }
          }
          this.pinchDiff = diff;
          this.pinchTime = currentDate;
        }
        let { left, top } = this.state;
        left += gestureState.moveX - gestureState.previousMoveX;
        top += gestureState.moveY - gestureState.previousMoveY;
        this.setState({
          gestureState: {
            ...gestureState,
          },
          left,
          top,
          thumbSize,
        });
      },
      onResponderTerminationRequest: () => true,
      onResponderRelease: (gestureState) => {
        this.setState({
          gestureState: {
            ...gestureState,
          },
        });
      },
      onResponderTerminate: () => {},

      onResponderSingleTapConfirmed: () => {},

      moveThreshold: 2,
      debug: false,
    });
  };
  navigateToLanguage = () => {
    this.setState({ status: false });
    this.props.navigation.navigate("LanguageList", {
      updateLangVer: this.updateLangVer,
    });
  };
  navigateToSelectionTab = () => {
    this.setState({ status: false });
    this.props.navigation.navigate("ReferenceSelection", {
      getReference: this.getReference,
      language: this.props.language,
      version: this.props.versionCode,
      sourceId: this.props.sourceId,
      downloaded: this.props.downloaded,
      parallelContent: this.props.visibleParallelView ? false : true,
      bookId: this.props.bookId,
      bookName: this.props.bookName,
      chapterNumber: this.state.currentVisibleChapter,
      totalChapters: this.props.totalChapters,
      selectedVerse: this.props.selectedVerse,
    });
  };
  navigateToVideo = () => {
    this.setState({ status: false });
    this.props.navigation.navigate("Video", {
      bookId: this.props.bookId,
      bookName: this.props.bookName,
    });
  };
  navigateToImage = () => {
    this.setState({ status: false });
    this.props.navigation.navigate("Infographics", {
      bookId: this.props.bookId,
      bookName: this.props.bookName,
    });
  };
  navigateToSettings = () => {
    this.setState({ status: false });
    this.props.navigation.navigate("Settings");
  };

  getOffset(index) {
    var offset = 0;
    for (let i = 0; i < index; i++) {
      const elementLayout = this.arrLayout[index];
      if (elementLayout && elementLayout.height) {
        if (this.arrLayout[i] != undefined) {
          offset += this.arrLayout[i].height;
        }
      }
    }
    return offset;
  }
  scrollToVerse(verseNumber) {
    if (this.arrLayout != undefined) {
      let item = this.arrLayout.filter((i) => i.verseNumber == verseNumber);
      if (item.length > 0) {
        if (item[0].verseNumber == verseNumber) {
          const offset = this.getOffset(item[0].index);
          this.verseScroll.scrollToOffset({ offset, animated: true });
        }
      }
    }
  }

  closeParallelView(value) {
    this.setState({ status: false });
    this.props.parallelVisibleView({
      modalVisible: false,
      visibleParallelView: value,
    });
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  onLayout = (event, index, verseNumber) => {
    this.arrLayout[index] = {
      height: event.nativeEvent.layout.height,
      verseNumber,
      index,
    };
  };

  _onMomentumScrollEnd = () => {
    const toValue =
      this._scrollValue > NAVBAR_HEIGHT &&
      this._clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
        ? this._offsetValue + NAVBAR_HEIGHT
        : this._offsetValue - NAVBAR_HEIGHT;

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  downloadPDF() {
    this.setState({ isLoading: true }, async () => {
      var texttohtml = "";
      this.state.chapterContent.forEach((val) => {
        if (val.verseNumber != undefined && val.verseText != undefined) {
          texttohtml += `<p>${val.verseNumber} : ${val.verseText}</p>`;
        }
      });
      let header1 = `<h1>${
        this.props.language + " " + this.props.versionCode
      }</h1>`;
      let header3 = `<h3>${
        this.props.bookName + " " + this.state.currentVisibleChapter
      }</h3>`;
      let options = {
        html: `${header1}${header3}<p>${texttohtml}</p>`,
        fileName: `${
          "VachanGo_" +
          this.props.language +
          "_" +
          this.props.bookId +
          "_" +
          this.state.currentVisibleChapter
        }`,
        // eslint-disable-next-line no-constant-condition
        directory: "Download" ? "Download" : "Downloads",
      };
      this.setState({ isLoading: false });
      await RNHTMLtoPDF.convert(options);
    });
    Toast.show({ text: "Pdf downloaded.", type: "success", duration: 5000 });
  }
  createPDF_File = async () => {
    // this.setState({ isLoading: true }, async () => {
    let permissionGranted = await AndroidPermission(
      Permission.PermissionTypes.WRITE_EXTERNAL_STORAGE
    );
    console.log("permission ", permissionGranted);
    if (permissionGranted) {
      Alert.alert("", "Do you want to download the pdf for current chapter", [
        {
          text: "No",
          onPress: () => {
            return;
          },
        },
        { text: "Yes", onPress: () => this.downloadPDF() },
      ]);
    } else {
      return;
    }
    // })
  };

  renderFooter = () => {
    if (this.state.chapterContent.length === 0) {
      return null;
    } else {
      return (
        <View
          style={[
            this.styles.addToSharefooterComponent,
            {
              marginBottom:
                this.state.showColorGrid && this.state.bottomHighlightText
                  ? 32
                  : 16,
            },
          ]}
        >
          {
            <View style={this.styles.footerView}>
              {this.props.revision !== null && this.props.revision !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={this.styles.textListFooter}
                >
                  <Text style={this.styles.footerText}>Copyright:</Text>{" "}
                  {this.props.revision}
                </Text>
              )}
              {this.props.license !== null && this.props.license !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={this.styles.textListFooter}
                >
                  <Text style={this.styles.footerText}>License:</Text>{" "}
                  {this.props.license}
                </Text>
              )}
              {this.props.technologyPartner !== null &&
                this.props.technologyPartner !== "" && (
                  <Text
                    textBreakStrategy={"simple"}
                    style={this.styles.textListFooter}
                  >
                    <Text style={this.styles.footerText}>
                      Technology partner:
                    </Text>{" "}
                    {this.props.technologyPartner}
                  </Text>
                )}
            </View>
          }
        </View>
      );
    }
  };
  render() {
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
    return (
      <View style={this.styles.container}>
        {this.props.visibleParallelView ? (
          <View
            style={{ position: "absolute", top: 0, zIndex: 2, width: "50%" }}
          >
            <Header style={{ backgroundColor: Color.Blue_Color, height: 40 }}>
              <Button
                transparent
                onPress={() => this.navigateToSelectionTab(true)}
              >
                <Title style={{ fontSize: 16 }}>
                  {this.props.bookName.length > 10
                    ? this.props.bookName.slice(0, 9) + "..."
                    : this.props.bookName}{" "}
                  {this.state.currentVisibleChapter}
                </Title>
                <Icon name="arrow-drop-down" color={Color.White} size={20} />
              </Button>
            </Header>
          </View>
        ) : (
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
            createPDF={this.createPDF_File}
          />
        )}
        {this.state.isLoading && (
          <Spinner visible={true} textContent={"Loading..."} />
        )}

        {/** Main View for the single or parrallel View */}
        <View style={this.styles.singleView}>
          {/** Single view with only bible text */}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              width: this.props.visibleParallelView ? "50%" : width,
            }}
          >
            {this.state.unAvailableContent &&
            this.state.chapterContent.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ReloadButton
                  styles={this.styles}
                  reloadFunction={() => this.queryBookFromAPI(null)}
                  message={null}
                />
              </View>
            ) : (
              <AnimatedFlatlist
                {...this.gestureResponder}
                data={this.state.chapterContent}
                // getItemLayout={this.getItemLayout}
                ref={(ref) => (this.verseScroll = ref)}
                contentContainerStyle={
                  this.state.chapterContent.length === 0
                    ? this.styles.centerEmptySet
                    : {
                        paddingHorizontal: 16,
                        paddingTop: this.props.visibleParallelView ? 52 : 90,
                        paddingBottom: 90,
                      }
                }
                extraData={this.state}
                scrollEventThrottle={1}
                onMomentumScrollBegin={this._onMomentumScrollBegin}
                onMomentumScrollEnd={this._onMomentumScrollEnd}
                onScrollEndDrag={this._onScrollEndDrag}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: this.state.scrollAnim,
                          y: this.state.scrollAnim,
                        },
                      },
                    },
                  ],
                  { useNativeDriver: true }
                )}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <VerseView
                    // ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
                    verseData={item}
                    sectionHeading={getHeading(item.contents)}
                    chapterHeader={this.state.chapterHeader}
                    index={index}
                    onLayout={this.onLayout}
                    styles={this.styles}
                    selectedReferences={this.state.selectedReferenceSet}
                    getSelection={(
                      verseIndex,
                      chapterNumber,
                      verseNumber,
                      text
                    ) => {
                      this.props.visibleParallelView == false &&
                        this.getSelectedReferences(
                          verseIndex,
                          chapterNumber,
                          verseNumber,
                          text
                        );
                    }}
                    HightlightedVerse={this.state.HightlightedVerseArray}
                    notesList={this.state.notesList}
                    chapterNumber={this.state.currentVisibleChapter}
                    navigation={this.props.navigation}
                  />
                )}
                keyExtractor={this._keyExtractor}
                ListFooterComponent={this.renderFooter}
              />
            )}
            {this.state.chapterContent.length > 0 && (
              <View style={{ flex: 1 }}>
                <ChapterNdAudio
                  styles={this.styles}
                  audio={this.state.audio}
                  currentVisibleChapter={this.state.currentVisibleChapter}
                  status={
                    this.props.visibleParallelView ? false : this.state.status
                  }
                  visibleParallelView={this.props.visibleParallelView}
                  languageCode={this.props.languageCode}
                  versionCode={this.props.versionCode}
                  bookId={this.props.bookId}
                  totalChapters={this.props.totalChapters}
                  showBottomBar={this.state.showBottomBar}
                  navigation={this.props.navigation}
                  previousContent={this.state.previousContent}
                  downloaded={this.props.downloaded}
                  nextContent={this.state.nextContent}
                  queryBookFromAPI={this.queryBookFromAPI}
                />
                {this.state.showColorGrid &&
                  this.state.bottomHighlightText &&
                  this.props.visibleParallelView == false && (
                    <HighlightColorGrid
                      styles={this.styles}
                      bottomHighlightText={this.state.bottomHighlightText}
                      doHighlight={this.doHighlight}
                    />
                  )}
                {this.props.visibleParallelView == false &&
                  this.state.showBottomBar && (
                    <SelectBottomTabBar
                      showColorGrid={() =>
                        this.setState({
                          showColorGrid: !this.state.showColorGrid,
                        })
                      }
                      styles={this.styles}
                      bottomHighlightText={this.state.bottomHighlightText}
                      doHighlight={this.doHighlight}
                      addToNotes={this.addToNotes}
                      addToShare={this.addToShare}
                    />
                  )}
              </View>
            )}
          </View>
          {/** 2nd view as  parallelView**/}
          {this.props.visibleParallelView == true && (
            <View style={this.styles.parallelView}>
              {this.props.contentType == "bible" && (
                <BibleChapter
                  currentChapter={this.state.currentVisibleChapter}
                  id={this.props.bookId}
                  bookName={this.props.bookName}
                  closeParallelView={(value) => this.closeParallelView(value)}
                  totalChapters={this.props.totalChapters}
                  navigation={this.props.navigation}
                />
              )}
              {this.props.contentType == "commentary" && (
                <Commentary
                  id={this.props.bookId}
                  bookName={this.props.bookName}
                  closeParallelView={(value) => this.closeParallelView(value)}
                  currentVisibleChapter={this.state.currentVisibleChapter}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}
// const navStyles = StyleSheet.create({
//   navbar: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     alignItems: "center",
//     backgroundColor: "white",
//     borderBottomColor: "#dedede",
//     borderBottomWidth: 1,
//     height: NAVBAR_HEIGHT,
//     justifyContent: "center",
//     paddingTop: STATUS_BAR_HEIGHT,
//   },
//   title: {
//     color: "#333333",
//   },
//   headerLeftStyle: {
//     alignItems: "stretch",
//     justifyContent: "space-evenly",
//     flexDirection: "row",
//     flex: 1,
//   },
//   border: {
//     paddingHorizontal: 4,
//     paddingVertical: 4,

//     borderWidth: 0.2,
//     borderColor: Color.White,
//   },
//   headerRightStyle: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 8,
//     flex: 1,
//   },
//   touchableStyleRight: {},

//   touchableStyleLeft: {
//     flexDirection: "row",
//     marginHorizontal: 8,
//   },
//   headerTextStyle: {
//     fontSize: 18,
//     color: Color.White,
//     textAlign: "center",
//   },
// });

const mapStateToProps = (state) => {
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
    sizeMode: state.updateStyling.sizeMode,
    colorMode: state.updateStyling.colorMode,

    email: state.userInfo.email,
    userId: state.userInfo.uid,

    books: state.versionFetch.versionBooks,
    parallelContentType: state.updateVersion.parallelContentType,
    visibleParallelView: state.selectContent.visibleParallelView,
    selectedVerse: state.updateVersion.selectedVerse,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
    audio: state.audio.audio,
    status: state.audio.status,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersion: (payload) => dispatch(updateVersion(payload)),
    updateVerseNumber: (payload) => dispatch(updateVerseNumber(payload)),
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
    userInfo: (payload) => dispatch(userInfo(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    updateMetadata: (payload) => dispatch(updateMetadata(payload)),
    updateNetConnection: (payload) => dispatch(updateNetConnection(payload)),
    APIAudioURL: (payload) => dispatch(APIAudioURL(payload)),
    ToggleAudio: (payload) => dispatch(ToggleAudio(payload)),
    selectContent: (payload) => dispatch(selectContent(payload)),
    parallelVisibleView: (payload) => dispatch(parallelVisibleView(payload)),
    updateFontSize: (payload) => dispatch(updateFontSize(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Bible);
