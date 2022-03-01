import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { AppState, Animated, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import DbQueries from "../../utils/dbQueries";
import {
  APIAudioURL,
  fetchVersionBooks,
  userInfo,
  updateVersionBook,
  updateVerseNumber,
  updateFontSize,
  updateVersion,
  updateMetadata,
} from "../../store/action/";
import { Toast } from "native-base";
import { getBookChaptersFromMapping } from "../../utils/UtilFunctions";
import { style } from "./style.js";
import { connect } from "react-redux";
import auth from "@react-native-firebase/auth";
import vApi from "../../utils/APIFetch";
import { getHeading } from "../../utils/UtilFunctions";
import BibleMainComponent from "../../components/Bible/BibleMainComponent";
import { LoginData } from "../../context/LoginDataProvider";
import { BibleContext } from "../../context/BibleContextProvider";
const NAVBAR_HEIGHT = 64;
// eslint-disable-next-line no-undef
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
export const BibleMainContext = createContext();

const Bible = (props) => {
  const {
    language,
    languageCode,
    versionCode,
    sourceId,
    downloaded,
    baseAPI,
    chapterNumber,
    bookName,
    bookId,
    sizeFile,
    colorFile,
    books,
    visibleParallelView,
  } = props;
  const [downloadedBook, setDownloadedBook] = useState([]);

  const [chapterContent, setChapterContent] = useState([]);
  const [chapterHeader, setChapterHeader] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reloadMessage, setReloadMessage] = useState("Loading...");

  const [initializing, setInitializing] = useState(true);
  const [unAvailableContent, setUnAvailableContent] = useState("");

  const {
    currentVisibleChapter,
    setCurrentVisibleChapter,
    setSelectedReferenceSet,
    getNotes,
    getBookMarks,
    setConnection_Status,
    setEmail,
    email,
    setUid,
    uid,
    setShowBottomBar,
    setShowColorGrid,
    getHighlights,
    bookmarkedChap,
    setIsBookmark,
    bookmarksList,
  } = useContext(LoginData);
  const {
    setStatus,
    status,
    setPreviousContent,
    _handleAppStateChange,
    audioComponentUpdate,
    setAudio,
    setNextContent,
  } = useContext(BibleContext);
  const offsetAnim = useRef(new Animated.Value(0)).current;
  const scrollAnim = useRef(new Animated.Value(0)).current;
  let _clampedScrollValue = useRef(new Animated.Value(0)).current;
  let _offsetValue = 0;
  let _scrollValue = 0;
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

  const styles = style(colorFile, sizeFile);

  const _handleConnectivityChange = (state) => {
    setConnection_Status(state.isConnected == true ? true : false);
    if (state.isConnected === true) {
      queryBookFromAPI(null);
      Toast.show({
        text: "Online. Now content available.",
        type: "success",
        duration: 5000,
      });
      if (books.length == 0) {
        props.fetchVersionBooks({
          language: language,
          versionCode: versionCode,
          downloaded: downloaded,
          sourceId: sourceId,
        });
      }
    } else {
      setReloadMessage("Offline. Check your internet Connection.");
      Toast.show({
        text: "Offline. Check your internet Connection.",
        type: "warning",
        duration: 5000,
      });
    }
  };
  // if book downloaded or user want to read downloaded book fetch chapter from local db
  const getDownloadedContent = async () => {
    setIsLoading(true);
    var content = await DbQueries.queryVersions(
      language,
      versionCode,
      bookId,
      currentVisibleChapter
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
  // fetch chapter on didmount call
  const getChapter = async () => {
    try {
      if (downloaded) {
        getDownloadedContent;
      } else {
        if (baseAPI != null) {
          let url =
            "bibles" +
            "/" +
            sourceId +
            "/" +
            "books" +
            "/" +
            bookId +
            "/" +
            "chapter" +
            "/" +
            currentVisibleChapter;
          var content = await vApi.get(url);
          if (content) {
            setReloadMessage("Loading....");
            setIsLoading(true);
            let header = getHeading(content.chapterContent.contents);
            setChapterHeader(header);
            setChapterContent(content.chapterContent.contents);
            setError(null);
            setNextContent(content.next);
            setPreviousContent(content.previous);
            getHighlights();
            getNotes();
            getBookMarks();
            setIsLoading(false);
          }
        }
      }
    } catch (error) {
      console.log("ERROR");
      setIsLoading(false);
      setError(error);
      setChapterHeader("");
      setChapterContent([]);
      setUnAvailableContent(true);
    }
  };
  const queryBookFromAPI = async (chapterInfo) => {
    try {
      const { fetchVersionBooks, updateVersionBook } = props;
      if (books.length > 0) {
        setChapterHeader([]);
        setChapterContent([]);
        setIsLoading(true);
        setReloadMessage("Loading ......");
        let cNum =
          chapterInfo && chapterInfo.chapterId
            ? chapterInfo.chapterId
            : chapterNumber;
        let bId =
          chapterInfo && chapterInfo.bibleBookCode
            ? chapterInfo.bibleBookCode
            : bookId;

        let bkName = null;
        let bookItem = books.filter((val) => val.bookId == bId);
        if (bookItem.length > 0) {
          bkName = bookItem[0].bookName;
        }
        let bName = bkName != null ? bkName : bookName;
        let sId =
          chapterInfo && chapterInfo.sourceId ? chapterInfo.sourceId : sourceId;
        setSelectedReferenceSet([]);
        setShowColorGrid(false);
        setShowBottomBar(false);
        setCurrentVisibleChapter(cNum);
        setError(null);
        if (downloaded) {
          if (downloadedBook.length > 0) {
            setChapterHeader(downloadedBook[cNum - 1].chapterHeading);
            setChapterContent(downloadedBook[cNum - 1].verses);
            setPreviousContent(null);
            setNextContent(null);
          } else {
            getDownloadedContent();
          }
        } else {
          let url =
            "bibles" +
            "/" +
            sId +
            "/" +
            "books" +
            "/" +
            bId +
            "/" +
            "chapter" +
            "/" +
            cNum;
          try {
            var content = await vApi.get(url);
            if (content) {
              let header = getHeading(content.chapterContent.contents);
              setChapterHeader(header);
              setChapterContent(content.chapterContent.contents);
              setPreviousContent(content.previous);
              setNextContent(content.next);
              setIsLoading(false);
            }
          } catch (error) {
            setChapterContent([]);
            setError(error);
            setUnAvailableContent(true);
            setIsLoading(false);
          }
        }

        updateVersionBook({
          bookId: bId,
          bookName: bName,
          chapterNumber:
            parseInt(cNum) > getBookChaptersFromMapping(bId)
              ? 1
              : parseInt(cNum),
          totalChapters: getBookChaptersFromMapping(bId),
        });
        getHighlights();
        getNotes();
        bookmarkedChap()
        setIsLoading(false);
      } else {
        fetchVersionBooks({
          language: language,
          versionCode: versionCode,
          downloaded: downloaded,
          sourceId: sourceId,
        });
      }
    } catch (error) {
      setChapterContent([]);
      setError(error);
      setUnAvailableContent(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    var time = new Date();
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
        setEmail(user._user.email);
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
        setEmail(null);
        setUid(null);
      }
    });
    const subs = props.navigation.addListener("focus", () => {
      console.log(" FOCUS ....");
      // setIsLoading(true)
      setSelectedReferenceSet([]);
      setShowBottomBar(false);
      setShowColorGrid(false);
      // setCurrentVisibleChapter(chapterNumber);
      setAudio(props.audio);
      setStatus(props.status);
      getChapter();
      audioComponentUpdate();
      if (books.length == 0) {
        props.fetchVersionBooks({
          language: language,
          versionCode: versionCode,
          downloaded: downloaded,
          sourceId: sourceId,
        });
      }
    });
    return () => {
      DbQueries.addHistory(
        sourceId,
        language,
        languageCode,
        versionCode,
        bookId,
        bookName,
        currentVisibleChapter,
        downloaded,
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
    getChapter();
    audioComponentUpdate();
    bookmarkedChap();
    if (books.length == 0) {
      props.fetchVersionBooks({
        language: language,
        versionCode: versionCode,
        downloaded: downloaded,
        sourceId: sourceId,
      });
    }
  }, [
    language,
    sourceId,
    baseAPI,
    visibleParallelView,
    currentVisibleChapter,
    bookId,
    email,
    uid
  ]);
  useEffect(() => {
    props.fetchVersionBooks({
      language: language,
      versionCode: versionCode,
      downloaded: downloaded,
      sourceId: sourceId,
    });
  }, [language,
    sourceId,
    baseAPI,])
  // console.log("BOOKS ", books)
  return (
    <BibleMainContext.Provider
      value={[
        {
          clampedScroll,
          _clampedScrollValue,
          navigation: props.navigation,
          currentVisibleChapter,
          chapterContent,
          IconFloatingStyle: styles.IconFloatingStyle,
          reloadMessage,
          styles,
          status,
          chapterHeader,
          scrollAnim,
          offsetAnim,
          unAvailableContent,
          isLoading,
          setIsLoading,
          queryBookFromAPI,
        },
      ]}
    >
      <BibleMainComponent />
    </BibleMainContext.Provider>
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
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    email: state.userInfo.email,
    userId: state.userInfo.uid,
    books: state.versionFetch.versionBooks,
    visibleParallelView: state.selectContent.visibleParallelView,
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
    APIAudioURL: (payload) => dispatch(APIAudioURL(payload)),
    updateFontSize: (payload) => dispatch(updateFontSize(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Bible);
