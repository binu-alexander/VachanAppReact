import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  createRef,
} from "react";
import { connect } from "react-redux";
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
} from "../store/action";
import { LoginData } from "./LoginDataProvider";
import DbQueries from "../utils/dbQueries";
import { Toast } from "native-base";
import vApi from "../utils/APIFetch";
import { updateLangVersion } from "../utils/BiblePageUtil";
import {
  getBookChaptersFromMapping,
  getBookSectionFromMapping,
} from "../utils/UtilFunctions";
export const BibleContext = createContext();

const BibleContextProvider = (props) => {
  const [status, setStatus] = useState(false);
  const [nextContent, setNextContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const [audio, setAudio] = useState(false);
  const {
    sourceId,
    language,
    languageCode,
    versionCode,
    downloaded,
    bookId,
    bookName,
    baseAPI,
  } = props;
  const {
    currentVisibleChapter,
    setCurrentVisibleChapter,
    setSelectedReferenceSet,
    setShowBottomBar,
    setShowColorGrid,
  } = useContext(LoginData);
  const [bookList, setBookList] = useState([]);
  const [audioList, setAudioList] = useState([]);
  const [verseNum, setVerseNum] = useState([]);
  // const verseScroll = useRef()
  // var arrLayout = []
  // const [arrl, setArrL] = useState([])

  const navigateToSelectionTab = () => {
    setStatus(false);
    props.navigation.navigate("ReferenceSelection", {
      getReference: getReference,
      chapterNumber: currentVisibleChapter,
      // parallelContent: visibleParallelView ? false : true,
    });
  };
  const navigateToLanguage = () => {
    setStatus(false);
    props.navigation.navigate("LanguageList", { updateLangVer: updateLangVer });
  };
  const getReference = async (item) => {
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);
    if (item) {
      setCurrentVisibleChapter(item.chapterNumber);
      // updateBookChapterRef()
      var time = new Date();
      DbQueries.addHistory(
        sourceId,
        language,
        languageCode,
        versionCode,
        item.bookId,
        item.bookName,
        parseInt(item.chapterNumber),
        downloaded,
        time
      );
      //it is calling on book,chapter,verse selection screens also, so redux action payload is passing from this screen, if we set it in reference selection it will do changes which is not required for parallel bible(reusing in parallel bible )
      props.updateVerseNumber({ selectedVerse: item.selectedVerse });
      props.updateVersionBook({
        bookId: item.bookId,
        bookName: item.bookName,
        chapterNumber: parseInt(item.chapterNumber),
        totalChapters: item.totalChapters,
      });
      // setVerseNum(item.selectedVerse)
      // scrollToVerse()
    } else {
      return;
    }
  };
  // const getOffset = (index) => {
  //   var offset = 0;
  //   // console.log("GET OFF SET")
  //   for (let i = 0; i < index; i++) {
  //     const elementLayout = arrl[index];
  //     if (elementLayout && elementLayout.height) {
  //       if (arrl[i] != undefined) {
  //         offset += arrl[i].height;
  //         // console.log("GET OFF SET -----> ", offset)
  //       }
  //     }
  //   }
  //   return offset;
  // }

  // const scrollToVerse = () => {
  //   if (arrl.length != 0) {
  //     setArrL([arrl, ...arrLayout])
  //   } else {
  //     setArrL(arrLayout)
  //   }
  // }
  // const updateLayout = () => {
  //   if (arrl != undefined) {
  //     let item = arrl.filter((i) => i.verseNumber == verseNum);
  //     console.log(" item ", item)
  //     if (item.length > 0) {
  //       if (item[0].verseNumber == verseNum) {
  //         const offset = getOffset(item[0].index);
  //         verseScroll.current.scrollToOffset({ offset, animated: true });
  //       }
  //     }
  //   }
  // }
  // useEffect(() => {
  //   scrollToVerse()
  //   updateLayout()
  // }, [verseNum])
  // useEffect(() => {
  //   updateLayout()
  // }, [arrl])
  // const onScrollLayout = (event, index, verseNumber) => {
  //   arrLayout[index] = {
  //     height: event.nativeEvent.layout.height,
  //     verseNumber,
  //     index,
  //   }
  // }
  const updateLangVer = async (item) => {
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);
    let bookInfo = updateLangVersion(currentVisibleChapter, item, bookId);
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
      bookId: bookInfo ? bookInfo.bookId : bookId,
      bookName: bookInfo ? bookInfo.bookName : bookName,
      chapterNumber: bookInfo ? bookInfo.chapterNum : currentVisibleChapter,
      totalChapters: getBookChaptersFromMapping(
        bookInfo ? bookInfo.bookId : bookId
      ),
    });
    setCurrentVisibleChapter(
      bookInfo ? bookInfo.chapterNum : currentVisibleChapter
    );
    props.fetchVersionBooks({
      language: item.languageName,
      versionCode: item.versionCode,
      downloaded: item.downloaded,
      sourceId: item.sourceId,
    });
    setPreviousContent(null);
    setNextContent(null);
  };
  const _handleAppStateChange = (currentAppState) => {
    let status =
      currentAppState == "background"
        ? false
        : (currentAppState = "inactive" ? false : true);
    setStatus(status);
  };

  const toggleAudio = () => {
    if (audio) {
      setStatus(!status);
      props.ToggleAudio({ audio: audio, status: !status });
    } else {
      Toast.show({
        text: "No audio for " + language + " " + bookName,
        duration: 5000,
      });
      props.ToggleAudio({ audio: false, status: false });
    }
  };
  const audioComponentUpdate = async () => {
    let res = await vApi.get("audiobibles");
    try {
      if (res.length !== 0) {
        let data = res.filter((item) => {
          if (item.language.name == language.toLowerCase()) {
            return item;
          }
        });
        if (data.length != 0) {
          props.APIAudioURL({
            audioURL: data[0].audioBibles[0].url,
            audioFormat: data[0].audioBibles[0].format,
            audioList: data[0].audioBibles,
          });
          setAudioList(audioList);
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
  const getBookList = async () => {
    try {
      let bookListData = [];
      if (downloaded) {
        let response = await DbQueries.getDownloadedBook(language);
        if (response != null) {
          for (var i = 0; i <= response.length - 1; i++) {
            let books = {
              bookId: response[i].bookId,
              bookName: response[i].bookName,
              section: getBookSectionFromMapping(response[i].bookId),
              bookNumber: response[i].bookNumber,
              numOfChapters: getBookChaptersFromMapping(response[i].bookId),
            };
            bookListData.push(books);
          }
        }
      } else {
        let found = false;
        let response = await vApi.get("booknames");
        for (var k = 0; k < response.length; k++) {
          if (language.toLowerCase() == response[k].language.name) {
            for (var j = 0; j <= response[k].bookNames.length - 1; j++) {
              let books = {
                bookId: response[k].bookNames[j].book_code,
                bookName: response[k].bookNames[j].short,
                section: getBookSectionFromMapping(
                  response[k].bookNames[j].book_code
                ),
                bookNumber: response[k].bookNames[j].book_id,
                numOfChapters: getBookChaptersFromMapping(
                  response[k].bookNames[j].book_code
                ),
              };
              bookListData.push(books);
            }
            found = true;
          }
        }
        // if (!found) {
        //   //can exit app to refresh the data or give alert
        //   Alert.alert(
        //     "Check for update in languageList screen",
        //     [
        //       {
        //         text: "OK",
        //         onPress: () => {
        //           return;
        //         },
        //       },
        //     ],
        //     { cancelable: false }
        //   );
        //   // BackHandler.exitApp();
        // }
      }
      var res =
        bookListData.length == 0
          ? []
          : bookListData.sort(function (a, b) {
              return a.bookNumber - b.bookNumber;
            });
      setBookList(res);
    } catch (error) {
      console.log("ERROR ", error);
    }
  };

  useEffect(() => {
    getBookList();
  }, []);
  useEffect(() => {
    getBookList();
    audioComponentUpdate();
  }, [language, sourceId, baseAPI]);

  return (
    <BibleContext.Provider
      value={{
        navigateToLanguage,
        updateLangVer,
        getReference,
        navigateToSelectionTab,
        setStatus,
        status,
        setPreviousContent,
        previousContent,
        setNextContent,
        nextContent,
        _handleAppStateChange,
        toggleAudio,
        audioComponentUpdate,
        audio,
        setAudio,
        bookList,
        // onScrollLayout,
        // scrollToVerse,
        // verseScroll
      }}
    >
      {props.children}
    </BibleContext.Provider>
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BibleContextProvider);
