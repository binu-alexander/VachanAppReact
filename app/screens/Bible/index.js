import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Alert,
  Dimensions,
  Share,
  AppState,
  Animated,
  Platform,
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
import CustomStatusBar from "../../components/CustomStatusBar";
const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const width = Dimensions.get("window").width;
const NAVBAR_HEIGHT = 64;
// eslint-disable-next-line no-undef
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
const Bible = (props) => {
  // const [colorFile, setColorFile] = useState(props.colorFile)
  // const [sizeFile, setSizeFile] = useState(props.sizeFile)
  const [downloadedBook, setDownloadedBook] = useState([]);
  const [audio, setAudio] = useState(false);
  const [uid, setUid] = useState("");

  const [chapterContent, setChapterContent] = useState([]);
  const [chapterHeader, setChapterHeader] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState("");
  const [bookmarksList, setBookmarksList] = useState([]);
  const [isBookmark, setIsBookmark] = useState("");
  const [showColorGrid, setShowColorGrid] = useState("");
  const [currentVisibleChapter, setCurrentVisibleChapter] = useState(
    props.chapterNumber
  );
  const [nextContent, setNextContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");

  const [selectedReferenceSet, setSelectedReferenceSet] = useState([]);
  const [bottomHighlightText, setBottomHighlightText] = useState(false);
  const [HighlightedVerseArray, setHighlightedVerseArray] = useState([]);
  const [connection_Status, setConnection_Status] = useState(true);
  // const [message,setMessage ] = useState('')
  const [status, setStatus] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [email, setEmail] = useState(null);
  const [arrLayout, setArrLayout] = useState([]);

  const [unAvailableContent, setUnAvailableContent] = useState("");
  const [userData, setUserData] = useState("");
  const [bookId, setBookId] = useState("");
  const [bookName, setBookName] = useState("");
  const position = useRef(new Animated.ValueXY()).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;
  let _clampedScrollValue = useRef(new Animated.Value(0)).current;

  let _offsetValue = 0;
  let _scrollValue = 0;
  let gestureResponder, _scrollEndTimer;
  const clampedScroll = Animated.diffClamp(
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
  );

  const style = styles(props.colorFile, props.sizeFile);

  const _handleAppStateChange = (currentAppState) => {
    if (currentAppState == "background") {
      setStatus(false);
    }
    if (currentAppState == "inactive") {
      setStatus(false);
    }
    if (currentAppState == "active") {
      setStatus(true);
    }
  };

  // if book downloaded or user want to read downloaded book fetch chapter from local db
  const getDownloadedContent = async () => {
    setIsLoading(true);
    var content = await DbQueries.queryVersions(
      props.language,
      props.versionCode,
      props.bookId,
      props.currentVisibleChapter
    );
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
  // getSelectedReferences

  // fetch chapter on didmount call
  const getChapter = async () => {
    try {
      if (props.downloaded) {
        getDownloadedContent;
      } else {
        if (props.baseAPI != null) {
          var content = await vApi.get(
            "bibles" +
              "/" +
              props.sourceId +
              "/" +
              "books" +
              "/" +
              props.bookId +
              "/" +
              "chapter" +
              "/" +
              currentVisibleChapter
          );
          if (content) {
            let header = getHeading(content.chapterContent.contents);
            setChapterHeader(header);
            setChapterContent(content.chapterContent.contents);
            setError(null);
            setIsLoading(false);
            setCurrentVisibleChapter(currentVisibleChapter);
            setNextContent(content.next);
            setPreviousContent(content.previous);
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      setError(error);
      setChapterContent([]);
      setUnAvailableContent(true);
    }
    // setSelectedReferenceSet([])
    // setShowBottomBar(false)
    // setShowColorGrid(false)
  };
  const queryBookFromAPI = async (chapterInfo) => {
    try {
      console.log("LANGUAGE ", props.language);
      console.log("SOURCE ID ", props.sourceId);
      let bookName = null;
      let bookItem = props.books.filter((val) => val.bookId == props.bookId);
      if (bookItem.length > 0) {
        bookName = bookItem[0].bookName;
      }
      let chapterType = typeof chapterInfo;
      let allData = chapterType == "object" && chapterInfo;

      let chapterNum =
        chapterType == "boolean" &&
        (chapterInfo === true
          ? currentVisibleChapter + 1
          : currentVisibleChapter - 1);
      let cNum =
        chapterType == "boolean"
          ? parseInt(chapterNum)
          : allData
          ? parseInt(allData.chapterId)
          : props.chapterNumber;

      let bookId = allData ? allData.bibleBookCode : tprops.bookId;
      let bName = bookName != null ? bookName : props.bookName;
      setIsLoading(true);
      // setSelectedReferenceSet([])
      // setShowColorGrid(false)
      // setShowBottomBar(false)
      setCurrentVisibleChapter(cNum);
      error(null);
      if (props.downloaded) {
        if (downloadedBook.length > 0) {
          setChapterHeader(
            downloadedBook[currentVisibleChapter - 1].chapterHeading
          );
          setIsLoading(false);
          setChapterContent(downloadedBook[currentVisibleChapter - 1].verses);
          setCurrentVisibleChapter(currentVisibleChapter);
          setNextContent(null);
          setPreviousContent(null);
        } else {
          getDownloadedContent();
        }
      } else {
        try {
          var content = await vApi.get(
            "bibles" +
              "/" +
              props.sourceId +
              "/" +
              "books" +
              "/" +
              bookId +
              "/" +
              "chapter" +
              "/" +
              currentVisibleChapter
          );
          if (content) {
            let header = getHeading(content.chapterContent.contents);
            setChapterHeader(header);
            setIsLoading(false);
            setChapterContent(content.chapterContent.contents);
            setCurrentVisibleChapter(currentVisibleChapter);
            setNextContent(content.next);
            setPreviousContent(content.previous);
          }
        } catch (error) {
          setIsLoading(false);
          setError(error);
          setChapterContent([]);
          setUnAvailableContent(true);
        }
      }
      props.updateVersionBook({
        bookId: bookId,
        bookName: bName,
        chapterNumber:
          parseInt(cNum) > getBookChaptersFromMapping(bookId)
            ? 1
            : parseInt(cNum),
        totalChapters: getBookChaptersFromMapping(bookId),
      });
      getHighlights();
      getNotes();
      isBookmarked();
    } catch (error) {
      setIsLoading(false);
      setError(error);
      setChapterContent([]);
      setUnAvailableContent(true);
    }
  };
  const getSelectedReferences = (vIndex, chapterNum, vNum, text) => {
    if (vIndex != -1 && chapterNum != -1 && vNum != -1) {
      let obj = chapterNum + "_" + vIndex + "_" + vNum + "_" + text;
      // let selectedReferenceSet = [...selectedReferenceSet];
      // var found = false;
      var found = selectedReferenceSet.indexOf(obj);
      if (found != -1) {
        selectedReferenceSet.splice(found, 1);
      } else {
        selectedReferenceSet.push(obj);
      }
      let selectedCount = selectedReferenceSet.length,
        highlightCount = 0;
      for (let item of selectedReferenceSet) {
        let tempVal = item.split("_");
        for (var i = 0; i <= HighlightedVerseArray.length - 1; i++) {
          let regexMatch = /(\d+):([a-zA-Z]+)/;
          if (HighlightedVerseArray[i]) {
            let match = HighlightedVerseArray[i].match(regexMatch);
            if (match) {
              if (parseInt(match[1]) == parseInt(tempVal[2])) {
                highlightCount++;
              }
            }
          }
        }
      }
      setShowBottomBar(selectedReferenceSet.length > 0 ? true : false);
      setBottomHighlightText(selectedCount == highlightCount ? false : true);
      setShowColorGrid(selectedCount == highlightCount ? false : true);
    }
  };
  const toggleAudio = () => {
    if (audio) {
      setStatus(status);
    } else {
      Toast.show({
        text: "No audio for " + props.language + " " + props.bookName,
        duration: 5000,
      });
    }
  };
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
          props.APIAudioURL({
            audioURL: data[0].audioBibles[0].url,
            audioFormat: data[0].audioBibles[0].format,
            audioList: data[0].audioBibles,
          });
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
      Toast.show({
        text: "Online. Now content available.",
        type: "success",
        duration: 5000,
      });
      if (props.books.length == 0) {
        props.fetchVersionBooks({
          language: props.language,
          versionCode: props.versionCode,
          downloaded: props.downloaded,
          sourceId: props.sourceId,
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
    props.navigation.navigate("ReferenceSelection", {
      getReference: getReference,
      language: props.language,
      version: props.versionCode,
      sourceId: props.sourceId,
      downloaded: props.downloaded,
      parallelContent: props.visibleParallelView ? false : true,
      bookId: props.bookId,
      bookName: props.bookName,
      chapterNumber: currentVisibleChapter,
      totalChapters: props.totalChapters,
      selectedVerse: props.selectedVerse,
    });
  };
  const ZoomTextSize = () => {
    (gestureResponder = React.useRef(
      createResponder({
        onStartShouldSetResponder: () => true,
        //onStartShouldSetResponderCapture: (evt, gestureState) => true,
        onStartShouldSetResponderCapture: () => true,
        //onMoveShouldSetResponder: (evt, gestureState) => true,
        onMoveShouldSetResponder: () => true,
        //onMoveShouldSetResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetResponderCapture: () => true,
        //onResponderGrant: (evt, gestureState) => {},
        onResponderGrant: () => {},
        // onStartShouldSetPanResponder: (evt, gestureState) => true,
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
          let left, top;
          left += gestureState.moveX - gestureState.previousMoveX;
          top += gestureState.moveY - gestureState.previousMoveY;

          position.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onResponderTerminationRequest: () => true,
        onResponderRelease: (gestureState) => {},
        onResponderTerminate: (gestureState) => {},
        onResponderSingleTapConfirmed: () => {},
        moveThreshold: 2,
        debug: false,
      })
    ).current),
      [];
  };

  const navigateToVideo = () => {
    setStatus(false);
    props.navigation.navigate("Video", {
      bookId: props.bookId,
      bookName: props.bookName,
    });
  };
  const navigateToImage = () => {
    setStatus(false);
    props.navigation.navigate("Infographics", {
      bookId: props.bookId,
      bookName: props.bookName,
    });
  };
  const navigateToSettings = () => {
    setStatus(false);
    props.navigation.navigate("Settings");
  };
  const onSearch = () => {
    props.navigation.navigate("Search");
  };
  const navigateToLanguage = () => {
    setStatus(false);
    props.navigation.navigate("LanguageList", {
      updateLangVer: updateLangVer,
    });
  };
  const downloadPDF = async () => {
    setIsLoading(true);
    var texttohtml = "";
    chapterContent.forEach((val) => {
      if (val.verseNumber != undefined && val.verseText != undefined) {
        texttohtml += `<p>${val.verseNumber} : ${val.verseText}</p>`;
      }
    });
    let header1 = `<h1>${props.language + " " + props.versionCode}</h1>`;
    let header3 = `<h3>${props.bookName + " " + currentVisibleChapter}</h3>`;
    let options = {
      html: `${header1}${header3}<p>${texttohtml}</p>`,
      fileName: `${
        "VachanGo_" +
        props.language +
        "_" +
        props.bookId +
        "_" +
        currentVisibleChapter
      }`,
      // eslint-disable-next-line no-constant-condition
      directory: "Download" ? "Download" : "Downloads",
    };
    setIsLoading(false);
    await RNHTMLtoPDF.convert(options);
    setIsLoading(false);
    Toast.show({ text: "Pdf downloaded.", type: "success", duration: 5000 });
  };
  const createPDF_File = async () => {
    let permissionGranted = await AndroidPermission(
      Permission.PermissionTypes.WRITE_EXTERNAL_STORAGE
    );
    if (permissionGranted) {
      Alert.alert("", "Do you want to download the pdf for current chapter", [
        {
          text: "No",
          onPress: () => {
            return;
          },
        },
        { text: "Yes", onPress: () => downloadPDF() },
      ]);
    } else {
      return;
    }
  };
  const closeParallel = (value) => {
    console.log("VALUE........ ", value);
    if (value) {
      setStatus(false);
      // props.parallelVisibleView({
      //   modalVisible: false,
      //   visibleParallelView: value,
      // })
    }
  };

  // console.log("visibleParallelView ",props.visibleParallelView)
  const renderFooter = () => {
    if (chapterContent.length === 0) {
      return null;
    } else {
      return (
        <View
          style={[
            style.addToSharefooterComponent,
            {
              marginBottom: showColorGrid && bottomHighlightText ? 32 : 16,
            },
          ]}
        >
          {
            <View style={style.footerView}>
              {props.revision !== null && props.revision !== "" && (
                <Text textBreakStrategy={"simple"} style={style.textListFooter}>
                  <Text style={style.footerText}>Copyright:</Text>{" "}
                  {props.revision}
                </Text>
              )}
              {props.license !== null && props.license !== "" && (
                <Text textBreakStrategy={"simple"} style={style.textListFooter}>
                  <Text style={style.footerText}>License:</Text> {props.license}
                </Text>
              )}
              {props.technologyPartner !== null &&
                props.technologyPartner !== "" && (
                  <Text
                    textBreakStrategy={"simple"}
                    style={style.textListFooter}
                  >
                    <Text style={style.footerText}>Technology partner:</Text>{" "}
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
      var time = new Date();
      DbQueries.addHistory(
        props.sourceId,
        props.language,
        props.languageCode,
        props.versionCode,
        item.bookId,
        item.bookName,
        parseInt(item.chapterNumber),
        props.downloaded,
        time
      );
      setCurrentVisibleChapter(item.chapterNumber);
      setBookId(item.bookId);
      setBookName(item.bookName);

      props.updateVerseNumber({ selectedVerse: item.selectedVerse });
      props.updateVersionBook({
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
  //   // update language and version  onback from language list page (callback function) also this function is usefull to update only few required values of redux
  const updateLangVer = async (item) => {
    console.log("updateLangVer ====> ");
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);

    if (item) {
      let bookName = null;
      let bookId = null;
      let bookItem = item.books.filter((i) => i.bookId == props.bookId);
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
        parseInt(currentVisibleChapter) > getBookChaptersFromMapping(bookId)
          ? 1
          : parseInt(currentVisibleChapter);
      props.updateMetadata({
        copyrightHolder: item.metadata[0].copyrightHolder,
        description: item.metadata[0].description,
        license: item.metadata[0].license,
        source: item.metadata[0].source,
        technologyPartner: item.metadata[0].technologyPartner,
        revision: item.metadata[0].revision,
        versionNameGL: item.metadata[0].versionNameGL,
      });
      props.updateVersion({
        language: item.languageName,
        languageCode: item.languageCode,
        versionCode: item.versionCode,
        sourceId: item.sourceId,
        downloaded: item.downloaded,
      });
      props.updateVersionBook({
        bookId: bookId,
        bookName: bookName,
        chapterNumber: chapterNum,
        totalChapters: getBookChaptersFromMapping(bookId),
      });
      props.fetchVersionBooks({
        language: item.languageName,
        versionCode: item.versionCode,
        downloaded: item.downloaded,
        sourceId: item.sourceId,
      });
      setPreviousContent(null);
      setNextContent(null);
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

  //   // fetching chapter content on next or prev icon press

  //   // get highlights from firebase
  const getHighlights = async () => {
    if (connection_Status) {
      if (email) {
        database()
          .ref(
            "users/" +
              uid +
              "/highlights/" +
              props.sourceId +
              "/" +
              props.bookId +
              "/" +
              currentVisibleChapter
          )
          .on("value", (snapshot) => {
            if (snapshot.val() != null) {
              let value = snapshot.val();
              let HighlightedVerseArray = [];
              for (var i = 0; i < value.length; i++) {
                if (isNaN(value[i])) {
                  HighlightedVerseArray.push(value[i]);
                } else {
                  let addColor = value[i] + ":" + Color.highlightColorA.const;
                  HighlightedVerseArray.push(addColor);
                }
                setHighlightedVerseArray(HighlightedVerseArray);
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
  };
  // get bookmarks from firebase
  const getBookMarks = async () => {
    if (connection_Status) {
      if (email) {
        database()
          .ref(
            "users/" + uid + "/bookmarks/" + props.sourceId + "/" + props.bookId
          )
          .on("value", (snapshot) => {
            if (snapshot.val() === null) {
              setBookmarksList([]);
              setIsBookmark(false);
            } else {
              setBookmarksList(snapshot.val());
              isBookmarked();
              // )
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
  //   //get notes from firebase
  const getNotes = () => {
    if (connection_Status) {
      if (email) {
        database()
          .ref(
            "users/" +
              uid +
              "/notes/" +
              props.sourceId +
              "/" +
              props.bookId +
              "/" +
              currentVisibleChapter
          )
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
  //   //check chapter is bookmarked
  const isBookmarked = () => {
    if (bookmarksList.length > 0) {
      let bm = bookmarksList.includes(currentVisibleChapter);
      setIsBookmark(bm);
    } else {
      setIsBookmark(false);
    }
  };

  //   //add book mark from header icon
  const onBookmarkPress = (isbookmark) => {
    if (connection_Status) {
      if (email) {
        var newBookmarks = isbookmark
          ? bookmarksList.filter((a) => a !== currentVisibleChapter)
          : bookmarksList.concat(currentVisibleChapter);
        database()
          .ref(
            "users/" + uid + "/bookmarks/" + props.sourceId + "/" + props.bookId
          )
          .set(newBookmarks);
        setBookmarksList(newBookmarks);
        setIsBookmark(!isbookmark);
        Toast.show({
          text: isbookmark
            ? "Bookmarked chapter removed"
            : "Chapter bookmarked",
          type: isbookmark ? "default" : "success",
          duration: 5000,
        });
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
        let id = props.bookId;
        let name = props.bookName;
        var verses = [];
        if (Object.keys(selectedReferenceSet).length != 0) {
          for (let item of selectedReferenceSet) {
            let tempVal = item.split("_");
            const verseNumber = parseInt(tempVal[2]);
            let refModel = {
              bookId: id,
              bookName: name,
              chapterNumber: parseInt(tempVal[0]),
              verseNumber: verseNumber,
              verseText: tempVal[3],
              versionCode: props.versionCode,
              languageName: props.language,
            };
            refList.push(refModel);
            verses.push(verseNumber);
          }
        }
        props.navigation.navigate("EditNote", {
          referenceList: refList,
          notesList: notesList,
          bcvRef: {
            bookId: id,
            bookName: props.bookName,
            chapterNumber: currentVisibleChapter,
            verses: verses,
          },
          contentBody: "",
          onbackNote: onbackNote,
          noteIndex: -1,
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
  //   onbackNote = () => {};

  const setHighlightColor = (color) => {
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
    if (connection_Status) {
      if (email) {
        var array = [...HighlightedVerseArray];
        if (Object.keys(selectedReferenceSet).length != 0) {
          for (let item of selectedReferenceSet) {
            let tempVal = item.split("_");
            let selectedColor = setHighlightColor(color);
            let val = tempVal[2].trim() + ":" + selectedColor;
            for (var i = 0; i < array.length; i++) {
              let regexMatch = /(\d+):([a-zA-Z]+)/;
              if (array[i]) {
                let match = array[i].match(regexMatch);
                if (match) {
                  if (parseInt(match[1]) == parseInt(tempVal[2])) {
                    array.splice(i, 1);
                    setHighlightedVerseArray(array);
                  }
                }
              }
            }
            var index = array.indexOf(val);
            //solve the issue of 2 color on single verse
            if (bottomHighlightText) {
              if (index == -1) {
                array.push(val);
              }
              setHighlightedVerseArray(array);
            }
          }
        }
        database()
          .ref(
            "users/" +
              uid +
              "/highlights/" +
              props.sourceId +
              "/" +
              props.bookId +
              "/" +
              currentVisibleChapter
          )
          .set(array);
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
    switch (props.sizeMode) {
      case 0: {
        if (value == -1) {
          return;
        } else {
          style = styles(props.colorFile, smallFont);
          props.updateFontSize(1);
        }
        break;
      }
      case 1: {
        if (value == -1) {
          style = styles(props.colorFile, extraSmallFont);
          props.updateFontSize(0);
        } else {
          style = styles(props.colorFile, mediumFont);
          props.updateFontSize(2);
        }
        break;
      }
      case 2: {
        if (value == -1) {
          style = styles(props.colorFile, smallFont);
          props.updateFontSize(1);
        } else {
          style = styles(props.colorFile, largeFont);
          props.updateFontSize(3);
        }
        break;
      }
      case 3: {
        if (value == -1) {
          style = styles(props.colorFile, mediumFont);
          props.updateFontSize(2);
        } else {
          style = styles(props.colorFile, extraLargeFont);
          props.updateFontSize(4);
        }
        break;
      }
      case 4: {
        if (value == -1) {
          style = styles(props.colorFile, largeFont);
          props.updateFontSize(3);
        } else {
          return;
        }
        break;
      }
    }
  };
  useEffect(() => {
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
        setUserData(user);
        setEmail(user._user.email);
        setIsLoading(false);
        setUid(user._user.uid);
        props.userInfo({
          email: user._user.email,
          uid: user._user.uid,
          userName: user._user.displayName,
          phoneNumber: null,
          photo: user._user.photoURL,
        });
      } else {
        props.userInfo({
          email: null,
          uid: null,
          userName: null,
          phoneNumber: null,
          photo: null,
        });
        setUserData(null);
        setEmail(null);
        setIsLoading(false);
        setUid(null);
      }
    });
    const subs = props.navigation.addListener("focus", () => {
      console.log("FOCUSED called ");
      setIsLoading(false);
      setSelectedReferenceSet([]);
      setShowBottomBar(false);
      setShowColorGrid(false);
      setCurrentVisibleChapter(props.chapterNumber);
      setAudio(props.audio);
      setStatus(props.status);
      getChapter();
      audioComponentUpdate();
      getHighlights();
      getBookMarks();
      getNotes();
      if (props.books.length == 0) {
        props.fetchVersionBooks({
          language: props.language,
          versionCode: props.versionCode,
          downloaded: props.downloaded,
          sourceId: props.sourceId,
        });
      }
      setIsLoading(false);
    });
    return () => {
      DbQueries.addHistory(
        props.sourceId,
        props.language,
        props.languageCode,
        props.versionCode,
        props.bookId,
        props.bookName,
        currentVisibleChapter,
        props.downloaded,
        time
      );
      appstate;
      netInfo;
      offsetAnimListner;
      subs;
      scrollListner;
      unsubscriber;
    };
  }, []);

  useEffect(() => {
    console.log("COMPONENT update ====>");
    // queryBookFromAPI(null)
    audioComponentUpdate();
    // scrollToVerse(props.selectedVerse)
    if (props.books.length == 0) {
      props.fetchVersionBooks({
        language: props.language,
        versionCode: props.versionCode,
        downloaded: props.downloaded,
        sourceId: props.sourceId,
      });
    }
  }, [
    props.language,
    props.sourceId,
    props.baseAPI,
    props.chapterNumber,
    props.bookId,
  ]);
  useEffect(() => {
    getChapter();
  }, [props.sourceId, props.bookId, currentVisibleChapter]);
  return (
    <CustomStatusBar>
      <View style={style.container}>
        {props.visibleParallelView ? (
          <View style={style.headerView}>
            <Header style={{ backgroundColor: Color.Blue_Color, height: 40 }}>
              <Button transparent onPress={navigateToSelectionTab(true)}>
                <Title style={{ fontSize: 16 }}>
                  {props.bookName.length > 10
                    ? props.bookName.slice(0, 9) + "..."
                    : props.bookName}{" "}
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
            navigateToVideo={navigateToVideo}
            navigateToImage={navigateToImage}
            navigateToSettings={navigateToSettings}
            onSearch={onSearch}
            bookName={props.bookName}
            language={props.language}
            versionCode={props.versionCode}
            chapterNumber={currentVisibleChapter}
            onBookmark={onBookmarkPress}
            isBookmark={isBookmark}
            navigateToSelectionTab={navigateToSelectionTab}
            navigateToLanguage={navigateToLanguage}
            createPDF={createPDF_File}
          />
        )}
        {isLoading && <Spinner visible={true} textContent={"Loading..."} />}

        {/** Main View for the single or parrallel View */}
        <View style={style.singleView}>
          {/** Single view with only bible text */}
          <View
            style={[
              style.innerContainer,
              { width: props.visibleParallelView ? "50%" : width },
            ]}
          >
            {unAvailableContent && chapterContent.length == 0 ? (
              <View style={style.reloadButtonCenter}>
                <ReloadButton
                  styles={style}
                  reloadFunction={() => queryBookFromAPI(null)}
                  message={null}
                />
              </View>
            ) : (
              <AnimatedFlatlist
                {...gestureResponder}
                data={chapterContent}
                scrollEventThrottle={1}
                onMomentumScrollBegin={_onMomentumScrollBegin}
                onMomentumScrollEnd={_onMomentumScrollEnd}
                onScrollEndDrag={_onScrollEndDrag}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: scrollAnim,
                          y: scrollAnim,
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
                    verseData={item}
                    sectionHeading={getHeading(item.contents)}
                    chapterHeader={chapterHeader}
                    index={index}
                    onLayout={onLayout}
                    styles={style}
                    selectedReferences={selectedReferenceSet}
                    getSelection={(
                      verseIndex,
                      chapterNumber,
                      verseNumber,
                      text
                    ) => {
                      props.visibleParallelView == false &&
                        getSelectedReferences(
                          verseIndex,
                          chapterNumber,
                          verseNumber,
                          text
                        );
                    }}
                    HighlightedVerse={HighlightedVerseArray}
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
                  styles={style}
                  audio={audio}
                  currentVisibleChapter={currentVisibleChapter}
                  status={props.visibleParallelView ? false : status}
                  visibleParallelView={props.visibleParallelView}
                  languageCode={props.languageCode}
                  versionCode={props.versionCode}
                  bookId={props.bookId}
                  totalChapters={props.totalChapters}
                  showBottomBar={showBottomBar}
                  navigation={props.navigation}
                  previousContent={previousContent}
                  downloaded={props.downloaded}
                  nextContent={nextContent}
                  queryBookFromAPI={queryBookFromAPI}
                />
                {showColorGrid &&
                  bottomHighlightText &&
                  props.visibleParallelView == false && (
                    <HighlightColorGrid
                      styles={style}
                      bottomHighlightText={bottomHighlightText}
                      doHighlight={doHighlight}
                    />
                  )}
                {props.visibleParallelView == false && showBottomBar && (
                  <SelectBottomTabBar
                    showColorGrid={() => setShowColorGrid(!showColorGrid)}
                    styles={style}
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
            <View style={style.parallelView}>
              {props.contentType == "bible" && (
                <BibleChapter
                  currentChapter={currentVisibleChapter}
                  id={props.bookId}
                  bookName={props.bookName}
                  closeParallelView={closeParallel}
                  totalChapters={props.totalChapters}
                  navigation={props.navigation}
                />
              )}
              {props.contentType == "commentary" && (
                <Commentary
                  id={props.bookId}
                  bookName={props.bookName}
                  closeParallelView={closeParallel}
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
