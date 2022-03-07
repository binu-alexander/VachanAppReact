import React, { createContext, useContext, useState } from "react";
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
    bookName,
  } = props;
  const {
    currentVisibleChapter,
    setCurrentVisibleChapter,
    setSelectedReferenceSet,
    setShowBottomBar,
    setShowColorGrid,
  } = useContext(LoginData);
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
      // this.scrollToVerse(item.selectedVerse)
    } else {
      return;
    }
  };
  // update language and version  onback from language list page (callback function) also this function is usefull to update only few required values of redux
  const updateLangVer = async (item) => {
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);
    const {
      updateMetadata,
      updateVersion,
      updateVersionBook,
      fetchVersionBooks,
    } = props;
    updateLangVersion(
      updateMetadata,
      updateVersion,
      updateVersionBook,
      fetchVersionBooks,
      currentVisibleChapter,
      item
    );
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
    } else {
      Toast.show({
        text: "No audio for " + language + " " + bookName,
        duration: 5000,
      });
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
