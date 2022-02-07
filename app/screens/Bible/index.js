import React, { useEffect, useRef, useState } from "react";
import { Text, View, FlatList, Alert, Dimensions, Share, AppState, Animated, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/MaterialIcons";
import { createResponder } from "react-native-gesture-responder";
import DbQueries from "../../utils/dbQueries";
import VerseView from "./VerseView";
import { APIAudioURL, ToggleAudio, fetchVersionBooks, selectContent, parallelVisibleView, updateNetConnection, userInfo, updateVersionBook, updateVerseNumber, updateFontSize, updateVersion, updateMetadata } from "../../store/action/";
import { getBookChaptersFromMapping } from "../../utils/UtilFunctions";
import CustomHeader from "../../components/Bible/CustomHeader";
import SelectBottomTabBar from "../../components/Bible/SelectBottomTabBar";
import ChapterNdAudio from "../../components/Bible/ChapterNdAudio";
import ReloadButton from "../../components/ReloadButton";
import Spinner from "react-native-loading-spinner-overlay";
import { style } from "./style.js";
import { connect } from "react-redux";
import Commentary from "../StudyHelp/Commentary/";
import Color from "../../utils/colorConstants";
import { Header, Button, Title, Toast } from "native-base";
import BibleChapter from "../../components/Bible/BibleChapter";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import vApi from "../../utils/APIFetch";
import HighlightColorGrid from "../../components/Bible/HighlightColorGrid";
import { getHeading } from "../../utils/UtilFunctions";
import CustomStatusBar from "../../components/CustomStatusBar";
import { updateLangVersion, changeSizeOnPinch, setHighlightColor } from "../../utils/BiblePageUtil";

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const width = Dimensions.get("window").width;
const NAVBAR_HEIGHT = 64;
// eslint-disable-next-line no-undef
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });

const Bible = (props) => {
  const [downloadedBook, setDownloadedBook] = useState([]);
  const [audio, setAudio] = useState(false);
  const [chapterContent, setChapterContent] = useState([]);
  const [chapterHeader, setChapterHeader] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reloadMessage, setReloadMessage] = useState('Loading...');
  const [showBottomBar, setShowBottomBar] = useState("");
  const [bookmarksList, setBookmarksList] = useState([]);
  const [isBookmark, setIsBookmark] = useState("");
  const [showColorGrid, setShowColorGrid] = useState("");
  const [currentVisibleChapter, setCurrentVisibleChapter] = useState(props.chapterNumber);
  const [nextContent, setNextContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const [selectedReferenceSet, setSelectedReferenceSet] = useState([]);
  const [bottomHighlightText, setBottomHighlightText] = useState(false);
  const [highlightedVerseArray, setHighlightedVerseArray] = useState([]);
  const [connection_Status, setConnection_Status] = useState(true);
  const [status, setStatus] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState(props.email);
  const [uid, setUid] = useState(props.userId);
  const [arrLayout, setArrLayout] = useState([]);
  const [unAvailableContent, setUnAvailableContent] = useState("");
  const position = useRef(new Animated.ValueXY()).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;
  let _clampedScrollValue = useRef(new Animated.Value(0)).current;

  let _offsetValue = 0;
  let _scrollValue = 0;
  let gestureResponder, _scrollEndTimer;
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolateLeft: "clamp" }),
      offsetAnim
    ),
    0,
    NAVBAR_HEIGHT - STATUS_BAR_HEIGHT
  );

  const styles = style(props.colorFile, props.sizeFile);

  const _handleAppStateChange = (currentAppState) => {
    let status = currentAppState == "background" ? false : (currentAppState = "inactive" ? false :  true)
    setStatus(status)
  }
  // if book downloaded or user want to read downloaded book fetch chapter from local db
  const getDownloadedContent = async () => {
    setIsLoading(true);
    var content = await DbQueries.queryVersions(props.language, props.versionCode, props.bookId, props.currentVisibleChapter);
    if (content != null) {
      setChapterHeader(
        content[0].chapters[currentVisibleChapter - 1].chapterHeading
      );
      setDownloadedBook(content[0].chapters);
      setChapterContent(content[0].chapters[currentVisibleChapter - 1].verses);
      setIsLoading(false);
      setError(null);
      setPreviousContent(null);
      setNextContent(null);
    } else {
      setIsLoading(false);
      setChapterContent([]);
      setUnAvailableContent(true);
    }
  };
  // fetch chapter on didmount call
  const getChapter = async () => {
    try {
      const { baseAPI, sourceId, bookId, chapterNumber,downloaded } = props;
      if (downloaded) {
        getDownloadedContent
      } else {
        if (baseAPI != null) {
          var content = await vApi.get("bibles" + "/" + sourceId + "/" + "books" + "/" + bookId + "/" + "chapter" + "/" + chapterNumber)
          if (content) {
            setReloadMessage("Loading....")
            setIsLoading(true);
            let header = getHeading(content.chapterContent.contents);
            setChapterHeader(header);
            setChapterContent(content.chapterContent.contents);
            setError(null);
            setIsLoading(false);
            setNextContent(content.next);
            setPreviousContent(content.previous);
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      setError(error)
      setChapterHeader("");
      setChapterContent([])
      setUnAvailableContent(true);
    }
  };
  const queryBookFromAPI = async (chapterInfo) => {
    try {
      const { downloaded, language, versionCode, sourceId, books, fetchVersionBooks } = props;
      if (books.length > 0) {
        const { bookId, bookName, books, chapterNumber, updateVersionBook } = props;
        setChapterHeader([])
        setChapterContent([])
        setIsLoading(true)
        setReloadMessage("Loading ......")
        let cNum = (chapterInfo && chapterInfo.chapterId) ? chapterInfo.chapterId : chapterNumber
        let bId = (chapterInfo && chapterInfo.bibleBookCode) ? chapterInfo.bibleBookCode : bookId;

        let bkName = null;
        let bookItem = books.filter(
          (val) => val.bookId == bId
        )
        if (bookItem.length > 0) {
          bkName = bookItem[0].bookName;
        }
        let bName = bkName != null ? bkName : bookName;
        let sId = (chapterInfo && chapterInfo.sourceId) ? chapterInfo.sourceId : sourceId;
        setSelectedReferenceSet([])
        setShowColorGrid(false)
        setShowBottomBar(false)
        setCurrentVisibleChapter(cNum)
        setError(null)
        if (downloaded) {
          if (downloadedBook.length > 0) {
            setChapterHeader(downloadedBook[cNum - 1].chapterHeading)
            setChapterContent(downloadedBook[cNum - 1].verses)
            setPreviousContent(null)
            setNextContent(null)
          } else {
            getDownloadedContent();
          }

        } else {
          try {
            var content = await vApi.get("bibles" + "/" + sId + "/" + "books" + "/" + bId + "/" + "chapter" + "/" + cNum)
            if (content) {
              let header = getHeading(content.chapterContent.contents)
              setIsLoading(false)
              setChapterHeader(header)
              setChapterContent(content.chapterContent.contents)
              setPreviousContent(content.previous)
              setNextContent(content.next)
            }
          } catch (error) {
            setIsLoading(false)
            setChapterContent([])
            setError(error)
            setUnAvailableContent(true)
          }
        }
        setIsLoading(false)
        updateVersionBook({
          bookId: bId, bookName: bName,
          chapterNumber: parseInt(cNum) > getBookChaptersFromMapping(bId) ? 1 : parseInt(cNum),
          totalChapters: getBookChaptersFromMapping(bId)
        });
        getHighlights();
        getNotes();
        getBookMarks()
      } else {
        fetchVersionBooks({
          language: language, versionCode: versionCode,
          downloaded: downloaded, sourceId: sourceId,
        })
      }
    } catch (error) {
      setIsLoading(false)
      setChapterContent([])
      setError(error)
      setUnAvailableContent(true)
    }
  };
  const getSelectedReferences = (vIndex, chapterNum, vNum, text) => {
    if (vIndex != -1 && chapterNum != -1 && vNum != -1) {
      let obj = chapterNum + "_" + vIndex + "_" + vNum + "_" + text
      let selectedReferences = [...selectedReferenceSet]
      var found = false;
      for (var i = 0; i < selectedReferences.length; i++) {
        if (selectedReferences[i] == obj) {
          found = true;
          selectedReferences.splice(i, 1);
        }
      }
      if (!found) {
        selectedReferences.push(obj);
      }
      let selectedCount = selectedReferences.length,
        highlightCount = 0;
      for (let item of selectedReferences) {
        let tempVal = item.split("_");
        for (
          var i = 0;
          i <= highlightedVerseArray.length - 1;
          i++
        ) {
          let regexMatch = /(\d+)\:([a-zA-Z]+)/;
          if (highlightedVerseArray[i]) {
            let match =
              highlightedVerseArray[i].match(regexMatch);
            if (match) {
              if (parseInt(match[1]) == parseInt(tempVal[2])) {
                highlightCount++;
              }
            }
          }
        }
      }
      setSelectedReferenceSet(selectedReferences)
      setShowBottomBar(selectedReferences.length > 0 ? true : false);
      setBottomHighlightText(selectedCount == highlightCount ? false : true)
      setShowColorGrid(selectedCount == highlightCount ? false : true)
    }
  }
  const toggleAudio = () => {
    if (audio) {
      setStatus(!status);
    } else {
      Toast.show({
        text: "No audio for " + props.language + " " + props.bookName,
        duration: 5000,
      });
    }
  }
  const audioComponentUpdate = async () => {
    let res = await vApi.get("audiobibles");
    try {
      if (res.length !== 0) {
        let data = res.filter((item) => {
          if (item.language.name == props.language.toLowerCase()) {
            return item;
          }
        });
        if (data.length != 0) {
          props.APIAudioURL({ audioURL: data[0].audioBibles[0].url, audioFormat: data[0].audioBibles[0].format, audioList: data[0].audioBibles, });
          setAudio(true);
        } else {
          props.APIAudioURL({ audioURL: null, audioFormat: null });
          setAudio(false);
        }
      }
    } catch (error) {
      setAudio(false);
    }
  };

  // check internet connection to fetch api's accordingly
  const _handleConnectivityChange = (state) => {
    setConnection_Status(state.isConnected == true ? true : false);
    if (state.isConnected === true) {
      queryBookFromAPI(null);
      Toast.show({ text: "Online. Now content available.", type: "success", duration: 5000, });
      if (props.books.length == 0) {
        props.fetchVersionBooks({
          language: props.language, versionCode: props.versionCode,
          downloaded: props.downloaded, sourceId: props.sourceId,
        });
      }
    } else {
      setReloadMessage("Offline. Check your internet Connection.")
      Toast.show({ text: "Offline. Check your internet Connection.", type: "warning", duration: 5000, });
    }
  };
  // const  getOffset = (index) => {
  //     var offset = 0;
  //     for (let i = 0; i < index; i++) {
  //       const elementLayout = arrLayout[index];
  //       if (elementLayout && elementLayout.height) {
  //         if (arrLayout[i] != undefined) {
  //           offset += arrLayout[i].height;
  //         }
  //       }
  //     }
  //     return offset;
  //   }
  // const scrollToVerse = (verseNumber) => {
  //     if (arrLayout != undefined) {
  //       let item = arrLayout.filter((i) => i.verseNumber == verseNumber);
  //       if (item.length > 0) {
  //         if (item[0].verseNumber == verseNumber) {
  //           const offset = getOffset(item[0].index);
  //           verseScroll.scrollToOffset({ offset, animated: true });
  //         }
  //       }
  //     }
  //   }

  const _keyExtractor = (item, index) => {
    return index.toString();
  };
  const onLayout = (event, index, verseNumber) => {
    arrLayout[index] = {
      height: event.nativeEvent.layout.height,
      verseNumber,
      index,
    };
  };
  const _onMomentumScrollEnd = () => {
    const toValue =
      _scrollValue > NAVBAR_HEIGHT &&
        _clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
        ? _offsetValue + NAVBAR_HEIGHT
        : _offsetValue - NAVBAR_HEIGHT;

    Animated.timing(offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };
  _onScrollEndDrag = () => {
    _scrollEndTimer = setTimeout(_onMomentumScrollEnd(), 250);
  };
  const _onMomentumScrollBegin = () => {
    clearTimeout(_scrollEndTimer);
  };
  const navigateToSelectionTab = () => {
    setStatus(false);
    const { language, versionCode, sourceId, downloaded, visibleParallelView, bookId, bookName, totalChapters, selectedVerse } = props;
    props.navigation.navigate("ReferenceSelection", {
      getReference: getReference, language: language, version: versionCode, sourceId: sourceId,
      downloaded: downloaded, parallelContent: visibleParallelView ? false : true, bookId: bookId,
      bookName: bookName, chapterNumber: currentVisibleChapter, totalChapters: totalChapters, selectedVerse: selectedVerse,
    });
  };
  const ZoomTextSize = () => {
    (gestureResponder = React.useRef(
      createResponder({
        onStartShouldSetResponder: () => true,
        onStartShouldSetResponderCapture: () => true,
        onMoveShouldSetResponder: () => true,
        onMoveShouldSetResponderCapture: () => true,
        onResponderGrant: () => { },
        onResponderMove: (evt, gestureState) => {
          let thumbSize = 10;
          if (gestureState.pinch && gestureState.previousPinch) {
            thumbSize *= gestureState.pinch / gestureState.previousPinch;
            let currentDate = new Date().getTime();
            var pinchTime = new Date().getTime();
            let diff = currentDate - pinchTime;
            var pinchDiff = null;
            if (diff > pinchDiff) {
              if (gestureState.pinch - gestureState.previousPinch > 5) {
                // large
                changeSizeByOne(1);
              } else if (gestureState.previousPinch - gestureState.pinch > 5) {
                // small
                changeSizeByOne(-1);
              }
            }
            pinchDiff = diff;
            pinchTime = currentDate;
          }
          left += gestureState.moveX - gestureState.previousMoveX;
          top += gestureState.moveY - gestureState.previousMoveY;

          position.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onResponderTerminationRequest: () => true,
        onResponderRelease: (gestureState) => { },
        onResponderTerminate: (gestureState) => { },
        onResponderSingleTapConfirmed: () => { },
        moveThreshold: 2,
        debug: false,
      })
    ).current),
      [];
  };
  const navigateToLanguage = () => {
    setStatus(false)
    props.navigation.navigate("LanguageList", { updateLangVer: updateLangVer, });
  };
  const renderFooter = () => {
    if (chapterContent.length === 0) {
      return null;
    } else {
      return (
        <View
          style={[styles.addToSharefooterComponent, { marginBottom: showColorGrid && bottomHighlightText ? 32 : 16 },]} >
          {
            <View style={styles.footerView}>
              {props.revision !== null && props.revision !== "" && (
                <Text textBreakStrategy={"simple"} style={styles.textListFooter}>
                  <Text style={styles.footerText}>Copyright:</Text>{" "}
                  {props.revision}
                </Text>
              )}
              {props.license !== null && props.license !== "" && (
                <Text textBreakStrategy={"simple"} style={styles.textListFooter}>
                  <Text style={styles.footerText}>License:</Text> {props.license}
                </Text>
              )}
              {props.technologyPartner !== null &&
                props.technologyPartner !== "" && (
                  <Text
                    textBreakStrategy={"simple"}
                    style={styles.textListFooter}
                  >
                    <Text style={styles.footerText}>Technology partner:</Text>{" "}
                    {props.technologyPartner}
                  </Text>
                )}
            </View>
          }
        </View>
      );
    }
  };
  //   // update book name and chapter number onback from referenceSelection page (callback function) also this function is usefull to update only few required values of redux
  const getReference = async (item) => {
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);
    if (item) {
      setCurrentVisibleChapter(item.chapterNumber);
      const { updateVerseNumber, updateVersionBook, sourceId, language, languageCode, versionCode, downloaded } = props;
      // updateBookChapterRef()
      var time = new Date()
      DbQueries.addHistory(
        sourceId, language, languageCode, versionCode, item.bookId, item.bookName, parseInt(item.chapterNumber), downloaded, time);
      //it is calling on book,chapter,verse selection screens also, so redux action payload is passing from this screen, if we set it in reference selection it will do changes which is not required for parallel bible(reusing in parallel bible )
      updateVerseNumber({ selectedVerse: item.selectedVerse });
      updateVersionBook({
        bookId: item.bookId, bookName: item.bookName,
        chapterNumber: parseInt(item.chapterNumber), totalChapters: item.totalChapters
      });
      // this.scrollToVerse(item.selectedVerse)
    } else {
      return;
    }
  }
  // update language and version  onback from language list page (callback function) also this function is usefull to update only few required values of redux
  const updateLangVer = async (item) => {
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);
    const { updateMetadata, updateVersion, updateVersionBook, fetchVersionBooks } = props;
    updateLangVersion(updateMetadata, updateVersion, updateVersionBook, fetchVersionBooks, item)
    setPreviousContent(null);
    setNextContent(null);
  };
  //   // get highlights from firebase
  const getHighlights = () => {
    console.log("connecttion highlights", connection_Status, email, uid)
    if (connection_Status) {
      if (email && uid) {
        database()
          .ref("users/" + uid + "/highlights/" + props.sourceId + "/" + props.bookId + "/" + currentVisibleChapter)
          .on("value", (snapshot) => {
            if (snapshot.val() != null) {
              let value = snapshot.val();
              let VerseArray = [];
              for (var i = 0; i < value.length; i++) {
                if (isNaN(value[i])) {
                  VerseArray.push(value[i]);
                } else {
                  let addColor = value[i] + ":" + Color.highlightColorA.const;
                  VerseArray.push(addColor);
                }
                setHighlightedVerseArray(VerseArray);
              }
            } else {
              setHighlightedVerseArray([]);
            }
          });
      } else {
        setHighlightedVerseArray([]);
      }
    } else {
      setHighlightedVerseArray([]);
    }
  }
  // get bookmarks from firebase
  const getBookMarks = () => {
    // console.log("connecttion ",connection_Status,email)
    if (connection_Status) {
      if (email && uid) {
        database()
          .ref(
            "users/" + uid + "/bookmarks/" + props.sourceId + "/" + props.bookId
          )
          .on("value", (snapshot) => {
            if (snapshot.val() === null) {
              setBookmarksList([]);
              setIsBookmark(false);
            } else {
              var arr = snapshot.val()
              setBookmarksList(arr)
              let bm = arr.includes(currentVisibleChapter)
              setIsBookmark(bm)
            }
          });
      } else {
        setBookmarksList([]);
        setIsBookmark(false);
      }
    } else {
      setBookmarksList([]);
      setIsBookmark(false);
    }
  };
  // get notes from firebase
  const getNotes = () => {
    // console.log("connecttion ",connection_Status,email)
    if (connection_Status) {
      if (email && uid) {
        database()
          .ref("users/" + uid + "/notes/" + props.sourceId + "/" + props.bookId + "/" + currentVisibleChapter)
          .on("value", (snapshot) => {
            if (snapshot.val() === null) {
              setNotesList([]);
            } else {
              if (Array.isArray(snapshot.val())) {
                setNotesList(snapshot.val());
              } else {
                setNotesList([snapshot.val()]);
              }
            }
          });
      } else {
        setNotesList([]);
      }
    } else {
      setNotesList([]);
    }
  };
  //   //add book mark from header icon
  const onBookmarkPress = (isbookmark) => {
    if (connection_Status) {
      if (email && uid) {
        var newBookmarks = isbookmark ? bookmarksList.filter((a) => a !== currentVisibleChapter) : bookmarksList.concat(currentVisibleChapter);
        database()
          .ref("users/" + uid + "/bookmarks/" + props.sourceId + "/" + props.bookId).set(newBookmarks);
        setBookmarksList(newBookmarks);
        setIsBookmark(!isbookmark);
        Toast.show({ text: isbookmark ? "Bookmarked chapter removed" : "Chapter bookmarked", type: isbookmark ? "default" : "success", duration: 5000 });
      } else {
        setBookmarksList([]);
        props.navigation.navigate("Login");
      }
    } else {
      setBookmarksList([]);
      Alert.alert("Please check your internet connecion");
    }
  };
  //   //selected reference for highlighting verse
  const addToNotes = () => {
    if (connection_Status) {
      if (email) {
        let refList = [];
        var verses = [];
        if (Object.keys(selectedReferenceSet).length != 0) {
          for (let item of selectedReferenceSet) {
            let tempVal = item.split("_");
            const verseNumber = parseInt(tempVal[2]);
            let refModel = {
              bookId: props.bookId, bookName: props.bookName, chapterNumber: parseInt(tempVal[0]),
              verseNumber: verseNumber, verseText: tempVal[3],
              versionCode: props.versionCode, languageName: props.language,
            };
            refList.push(refModel);
            verses.push(verseNumber);
          }
        }
        props.navigation.navigate("EditNote", {
          referenceList: refList, notesList: notesList,
          bcvRef: { bookId: props.bookId, bookName: props.bookName, chapterNumber: currentVisibleChapter, verses: verses },
          contentBody: "", onbackNote: onbackNote, noteIndex: -1,
        });
      } else {
        props.navigation.navigate("Login");
      }
    } else {
      Alert.alert("Please check internet connection");
    }
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);
  };
  onbackNote = () => { };
  doHighlight = (color) => {
    if (connection_Status) {
      if (email && uid) {
        let array = [...highlightedVerseArray]
        if (Object.keys(selectedReferenceSet).length != 0) {
          for (let item of selectedReferenceSet) {
            let tempVal = item.split("_")
            let selectedColor = setHighlightColor(color);
            let val = tempVal[2].trim() + ":" + selectedColor;
            for (var i = 0; i < array.length; i++) {
              let regexMatch = /(\d+):([a-zA-Z]+)/;
              if (array[i]) {
                let match = array[i].match(regexMatch);
                if (match) {
                  if (parseInt(match[1]) == parseInt(tempVal[2])) {
                    array.splice(i, 1)
                    setHighlightedVerseArray(array)
                  }
                }
              }
            }
            var index = array.indexOf(val)
            //solve the issue of 2 color on single verse
            if (bottomHighlightText) {
              if (index == -1) {
                array.push(val)
              }
              setHighlightedVerseArray(array);
            }
          }
        }
        database().ref("users/" + uid + "/highlights/" + props.sourceId + "/" + props.bookId + "/" + currentVisibleChapter).set(array);
      } else {
        props.navigation.navigate("Login");
      }
    } else {
      Alert.alert("Please check internet connection");
    }
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);
  };
  //   //share verse
  addToShare = () => {
    let shareText = "";
    if (Object.keys(selectedReferenceSet).length != 0) {
      for (let item of selectedReferenceSet) {
        let tempVal = item.split("_");
        let chapterNumber = parseInt(tempVal[0]);
        // let vIndex = parseInt(tempVal[1]);
        let verseNumber = tempVal[2];
        shareText = shareText.concat(
          props.bookName + " " + chapterNumber + ":" + verseNumber + " "
        );
        shareText = shareText.concat(tempVal[3]);
        shareText = shareText.concat("\n");
      }
    }
    Share.share({ message: shareText });
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);
  };
  changeSizeByOne = (value) => {
    const { updateFontSize, colorFile } = props
    changeSizeOnPinch(value, updateFontSize, colorFile, styles)
  };
  useEffect(() => {
    setIsLoading(true)
    var time = new Date();
    ZoomTextSize;
    if (initializing) {
      setInitializing(false);
    }
    const appstate = AppState.addEventListener("change", _handleAppStateChange);
    const netInfo = NetInfo.addEventListener(_handleConnectivityChange);
    const scrollListner = scrollAnim.addListener(({ value }) => {
      const diff = value - _scrollValue;
      _scrollValue = value;
      _clampedScrollValue = Math.min(
        Math.max(_clampedScrollValue + diff, 0),
        NAVBAR_HEIGHT - STATUS_BAR_HEIGHT
      );
    });
    const offsetAnimListner = offsetAnim.addListener(({ value }) => {
      _offsetValue = value;
    });

    const unsubscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setEmail(user._user.email)
        setUid(user._user.uid)
        props.userInfo({
          email: user._user.email, uid: user._user.uid,
          userName: user._user.displayName, phoneNumber: null, photo: user._user.photoURL,
        });
      } else {
        props.userInfo({
          email: null, uid: null, userName: null,
          phoneNumber: null, photo: null,
        });
        setEmail(null);
        setUid(null);
      }
    })
    const subs = props.navigation.addListener("focus", () => {
      setSelectedReferenceSet([]);
      setShowBottomBar(false);
      setShowColorGrid(false);
      setCurrentVisibleChapter(props.chapterNumber);
      setAudio(props.audio);
      setStatus(props.status);
      getChapter()
      audioComponentUpdate()
      getHighlights();
      getBookMarks();
      getNotes();
      if (props.books.length == 0) {
        props.fetchVersionBooks({
          language: props.language, versionCode: props.versionCode,
          downloaded: props.downloaded, sourceId: props.sourceId,
        });
      }
    });
    setIsLoading(false)
    return () => {
      DbQueries.addHistory(props.sourceId, props.language, props.languageCode, props.versionCode, props.bookId, props.bookName, currentVisibleChapter, props.downloaded, time);
      appstate;
      netInfo;
      offsetAnimListner;
      subs;
      scrollListner;
      unsubscriber;
    };
  }, []);
  useEffect(() => {
    queryBookFromAPI(null)
    if (props.books.length == 0) {
      props.fetchVersionBooks({
        language: props.language, versionCode: props.versionCode,
        downloaded: props.downloaded, sourceId: props.sourceId,
      });
    }
  }, [props.language, props.sourceId, props.baseAPI, props.visibleParallelView, props.chapterNumber])
  return (
    <CustomStatusBar>
      <View style={styles.container}>
        {props.visibleParallelView ? (
          <View
            style={styles.headerView}
          >
            <Header style={{ backgroundColor: Color.Blue_Color, height: 40 }}>
              <Button
                transparent
                onPress={() => navigateToSelectionTab(true)}
              >
                <Title style={{ fontSize: 16 }}>
                  {props.bookName.length > 10 ? props.bookName.slice(0, 9) + "..." : props.bookName}{" "}
                  {currentVisibleChapter}
                </Title>
                <Icon name="arrow-drop-down" color={Color.White} size={20} />
              </Button>
            </Header>
          </View>
        ) : (
          <CustomHeader
            audio={audio}
            clampedScroll={clampedScroll}
            navigation={props.navigation}
            toggleAudio={toggleAudio}
            chapterNumber={currentVisibleChapter}
            chapterContent={chapterContent}
            onBookmark={onBookmarkPress}
            isBookmark={isBookmark}
            navigateToSelectionTab={navigateToSelectionTab}
            navigateToLanguage={navigateToLanguage}
          />
        )}
        {isLoading && (<Spinner visible={true} textContent={"Loading..."} />)}
        {/** Main View for the single or parrallel View */}
        <View style={styles.singleView}>
          {/** Single view with only bible text */}
          <View
            style={[styles.innerContainer, { width: props.visibleParallelView ? "50%" : width }]}
          >
            {unAvailableContent &&
              chapterContent.length == 0 ? (
              <View
                style={styles.reloadButtonCenter}
              >
                <ReloadButton
                  styles={styles}
                  reloadFunction={() => queryBookFromAPI(null)}
                  message={reloadMessage}
                />
              </View>
            ) : (
              <AnimatedFlatlist
                {...gestureResponder}
                data={chapterContent}
                // ref={(ref) => (this.verseScroll = ref)}
                contentContainerStyle={chapterContent.length === 0 ? styles.centerEmptySet : { paddingHorizontal: 16, paddingTop: props.visibleParallelView ? 52 : 90, paddingBottom: 90, }}
                scrollEventThrottle={1}
                onMomentumScrollBegin={_onMomentumScrollBegin}
                onMomentumScrollEnd={_onMomentumScrollEnd}
                onScrollEndDrag={_onScrollEndDrag}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollAnim, y: scrollAnim } } }], { useNativeDriver: true })}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <VerseView
                    // ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
                    verseData={item}
                    sectionHeading={getHeading(item.contents)}
                    chapterHeader={chapterHeader}
                    index={index}
                    onLayout={onLayout}
                    styles={styles}
                    selectedReferences={selectedReferenceSet}
                    getSelection={(verseIndex, chapterNumber, verseNumber, text) => { props.visibleParallelView == false && getSelectedReferences(verseIndex, chapterNumber, verseNumber, text) }}
                    highlightedVerse={highlightedVerseArray}
                    notesList={notesList}
                    chapterNumber={currentVisibleChapter}
                    navigation={props.navigation}
                  />
                )}
                keyExtractor={_keyExtractor}
                ListFooterComponent={renderFooter}
              />
            )}
            {chapterContent.length > 0 && (
              <View style={{ flex: 1 }}>
                <ChapterNdAudio
                  styles={styles}
                  audio={audio}
                  currentVisibleChapter={currentVisibleChapter}
                  status={
                    props.visibleParallelView ? false : status
                  }
                  showBottomBar={showBottomBar}
                  navigation={props.navigation}
                  previousContent={previousContent}
                  nextContent={nextContent}
                  queryBookFromAPI={queryBookFromAPI}
                />
                {showColorGrid &&
                  bottomHighlightText &&
                  props.visibleParallelView == false && (
                    <HighlightColorGrid
                      styles={styles}
                      bottomHighlightText={bottomHighlightText}
                      doHighlight={(color) => doHighlight(color)}
                    />
                  )}
                {props.visibleParallelView == false &&
                  showBottomBar && (
                    <SelectBottomTabBar
                      showColorGrid={() =>
                        setShowColorGrid(!showColorGrid)
                      }
                      styles={styles}
                      bottomHighlightText={bottomHighlightText}
                      doHighlight={doHighlight}
                      addToNotes={addToNotes}
                      addToShare={addToShare}
                    />
                  )}
              </View>
            )}
          </View>
          {/** 2nd view as  parallelView**/}
          {props.visibleParallelView == true && (
            <View style={styles.parallelView}>
              {props.contentType == "bible" && (
                <BibleChapter
                  currentChapter={currentVisibleChapter}
                  navigation={props.navigation}
                />
              )}
              {props.contentType == "commentary" && (
                <Commentary
                  currentVisibleChapter={currentVisibleChapter}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </CustomStatusBar>
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
    baseAPI: state.updateVersion.baseAPI,
    chapterNumber: state.updateVersion.chapterNumber,
    totalChapters: state.updateVersion.totalChapters,
    bookName: state.updateVersion.bookName,
    bookId: state.updateVersion.bookId,
    selectedVerse: state.updateVersion.selectedVerse,
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