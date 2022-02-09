import React, { createContext, useState } from "react";
import database from "@react-native-firebase/database";
import { connect } from "react-redux";
import { setHighlightColor } from "../utils/BiblePageUtil";
import { Alert } from "react-native";
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
} from "../store/action/";

export const BibleScreenContext = createContext();

const BibleScreenContextProvider = (props) => {
  const [showColorGrid, setShowColorGrid] = useState("");
  const [bottomHighlightText, setBottomHighlightText] = useState(false);
  const [highlightedVerseArray, setHighlightedVerseArray] = useState([]);
  const [connection_Status, setConnection_Status] = useState(true);
  const [email, setEmail] = useState(props.email);
  const [uid, setUid] = useState(props.userId);
  const [selectedReferenceSet, setSelectedReferenceSet] = useState([]);
  const [showBottomBar, setShowBottomBar] = useState("");
  const [currentVisibleChapter, setCurrentVisibleChapter] = useState(
    props.chapterNumber
  );
  console.log(props, "navigartion");
  const doHighlight = (color) => {
    if (connection_Status) {
      if (email && uid) {
        let array = [...highlightedVerseArray];
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

  return (
    <BibleScreenContext.Provider
      value={{
        showColorGrid,
        setShowColorGrid,
        bottomHighlightText,
        setBottomHighlightText,
        highlightedVerseArray,
        setHighlightedVerseArray,
        connection_Status,
        setConnection_Status,
        email,
        setEmail,
        uid,
        setUid,
        selectedReferenceSet,
        setSelectedReferenceSet,
        showBottomBar,
        setShowBottomBar,
        currentVisibleChapter,
        setCurrentVisibleChapter,
        doHighlight,
      }}
    >
      {props.children}
    </BibleScreenContext.Provider>
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
)(BibleScreenContextProvider);
