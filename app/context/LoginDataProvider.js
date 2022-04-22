import React, { createContext, useEffect, useState } from "react";
import { connect } from "react-redux";
import database from "@react-native-firebase/database";
import Color from "../utils/colorConstants";
import { setHighlightColor } from "../utils/BiblePageUtil";
import { Alert, Share } from "react-native";
import { Toast } from "native-base";
export const LoginData = createContext();

// try with add login data provider here
const LoginDataProvider = (props) => {
  const { bookName, bookId, sourceId, versionCode, language, chapterNumber } =
    props;
  const [connection_Status, setConnection_Status] = useState(true);
  const [notesList, setNotesList] = useState([]);
  const [bookmarksList, setBookmarksList] = useState([]);
  const [isBookmark, setIsBookmark] = useState(false);
  const [email, setEmail] = useState(props.email);
  const [uid, setUid] = useState(props.userId);
  const [highlightedVerseArray, setHighlightedVerseArray] = useState([]);
  const [currentVisibleChapter, setCurrentVisibleChapter] =
    useState(chapterNumber);
  const [selectedReferenceSet, setSelectedReferenceSet] = useState([]);
  const [showBottomBar, setShowBottomBar] = useState("");
  const [bottomHighlightText, setBottomHighlightText] = useState(false);
  const [showColorGrid, setShowColorGrid] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // check internet connection to fetch api's accordingly

  const getNotes = () => {
    if (connection_Status) {
      if (email && uid) {
        database()
          .ref(
            "users/" +
            uid +
            "/notes/" +
            sourceId +
            "/" +
            bookId +
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

  const getHighlights = () => {
    if (connection_Status) {
      if (email && uid) {
        database()
          .ref(
            "users/" +
            uid +
            "/highlights/" +
            sourceId +
            "/" +
            bookId +
            "/" +
            currentVisibleChapter
          )
          .on("value", (snapshot) => {
            let VerseArray = [];
            if (snapshot.val() != null) {
              let value = snapshot.val();
              for (var i = 0; i < value.length; i++) {
                if (isNaN(value[i])) {
                  VerseArray.push(value[i]);
                } else {
                  let addColor = value[i] + ":" + Color.highlightColorA.const;
                  VerseArray.push(addColor);
                }
              }
            }
            setHighlightedVerseArray(VerseArray);
          });
      } else {
        setHighlightedVerseArray([]);
      }
    } else {
      setHighlightedVerseArray([]);
    }
  };

  const getBookMarks = () => {
    if (connection_Status) {
      if (email) {
        database()
          .ref("users/" + uid + "/bookmarks/" + sourceId + "/" + bookId)
          .on("value", (snapshot) => {
            if (snapshot.val() === null) {
              setBookmarksList([]);
              setIsBookmark(false);
            } else {
              setBookmarksList(snapshot.val());
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
  const bookmarkedChap = () => {
    if (bookmarksList.length > 0) {
      for (var i = 0; i < bookmarksList.length; i++) {
        if (bookmarksList[i] == currentVisibleChapter) {
          setIsBookmark(true);
          return;
        }
      }
      setIsBookmark(false);
    }
    setIsBookmark(false);
  };

  //add book mark from header icon
  const onBookmarkPress = (isbkmark) => {
    if (connection_Status) {
      if (email) {
        var newBookmarks = isbkmark
          ? bookmarksList.filter((a) => a !== currentVisibleChapter)
          : bookmarksList.concat(currentVisibleChapter);
        database()
          .ref("users/" + uid + "/bookmarks/" + sourceId + "/" + bookId)
          .set(newBookmarks);
        setBookmarksList(newBookmarks);
        setIsBookmark(!isbkmark);
        Toast.show({
          text: isbkmark ? "Bookmarked chapter removed" : "Chapter bookmarked",
          type: isbkmark ? "default" : "success",
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
              bookId: bookId,
              bookName: bookName,
              chapterNumber: parseInt(tempVal[0]),
              verseNumber: verseNumber,
              verseText: tempVal[3],
              versionCode: versionCode,
              languageName: language,
            };
            refList.push(refModel);
            verses.push(verseNumber);
          }
        }
        props.navigation.navigate("EditNote", {
          referenceList: refList,
          notesList: notesList,
          bcvRef: {
            bookId: bookId,
            bookName: bookName,
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
  const onbackNote = () => { };
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
            let index = array.indexOf(val);
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
            sourceId +
            "/" +
            bookId +
            "/" +
            currentVisibleChapter
          )
          .set(array);
      } else {
        props.navigation.navigate("Login");
      }
    } else {
      Alert.alert("Please check internet connection ");
    }
    setSelectedReferenceSet([]);
    setShowBottomBar(false);
    setShowColorGrid(false);
  };
  const addToShare = () => {
    let shareText = "";
    if (Object.keys(selectedReferenceSet).length != 0) {
      for (let item of selectedReferenceSet) {
        let tempVal = item.split("_");
        let cNumber = parseInt(tempVal[0]);
        // let vIndex = parseInt(tempVal[1]);
        let verseNumber = tempVal[2];
        shareText = shareText.concat(
          bookName + " " + cNumber + ":" + verseNumber + " "
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
  const getSelectedReferences = (vIndex, chapterNum, vNum, text) => {
    if (vIndex != -1 && chapterNum != -1 && vNum != -1) {
      let obj = chapterNum + "_" + vIndex + "_" + vNum + "_" + text;
      let selectedReferences = [...selectedReferenceSet];
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
        for (let i = 0; i <= highlightedVerseArray.length - 1; i++) {
          let regexMatch = /(\d+):([a-zA-Z]+)/;
          if (highlightedVerseArray[i]) {
            let match = highlightedVerseArray[i].match(regexMatch);
            if (match) {
              if (parseInt(match[1]) == parseInt(tempVal[2])) {
                highlightCount++;
              }
            }
          }
        }
      }
      setSelectedReferenceSet(selectedReferences);
      setShowBottomBar(selectedReferences.length > 0 ? true : false);
      setBottomHighlightText(selectedCount == highlightCount ? false : true);
      setShowColorGrid(selectedCount == highlightCount ? false : true);
    }
  };
  useEffect(() => {
    setCurrentVisibleChapter(chapterNumber);
  }, [chapterNumber]);
  useEffect(() => {
    getHighlights();
    getNotes();
    getBookMarks();
  }, [currentVisibleChapter, bookId, email, uid, language, sourceId]);
  useEffect(() => {
    bookmarkedChap();
  }, [bookmarksList, currentVisibleChapter]);

  return (
    <LoginData.Provider
      value={{
        notesList,
        setNotesList,
        getNotes,
        connection_Status,
        setConnection_Status,
        currentVisibleChapter,
        setCurrentVisibleChapter,
        getBookMarks,
        bookmarksList,
        setBookmarksList,
        isBookmark,
        setIsBookmark,
        setEmail,
        email,
        uid,
        bookId,
        bookName,
        setUid,
        getHighlights,
        highlightedVerseArray,
        setHighlightedVerseArray,
        onBookmarkPress,
        doHighlight,
        addToShare,
        addToNotes,
        setShowBottomBar,
        setShowColorGrid,
        showColorGrid,
        showBottomBar,
        selectedReferenceSet,
        setSelectedReferenceSet,
        getSelectedReferences,
        bottomHighlightText,
        setBottomHighlightText,
        bookmarkedChap,
      }}
    >
      {props.children}
    </LoginData.Provider>
  );
};

const mapStateToProps = (state) => {
  return {
    sourceId: state.updateVersion.sourceId,
    chapterNumber: state.updateVersion.chapterNumber,
    email: state.userInfo.email,
    userId: state.userInfo.uid,
    bookName: state.updateVersion.bookName,
    bookId: state.updateVersion.bookId,
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
  };
};

export default connect(mapStateToProps, null)(LoginDataProvider);
