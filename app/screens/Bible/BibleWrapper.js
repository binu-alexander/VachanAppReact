import React, { createContext, useState } from "react";
import { connect } from "react-redux";
import database from "@react-native-firebase/database";
import Color from "../../utils/colorConstants";
import Bible from ".";

// try with add login data provider here
export const LoginContext = createContext();
const BibleWrapper = (props) => {
  const [connection_Status, setConnection_Status] = useState(true);
  const [notesList, setNotesList] = useState([]);
  const [bookmarksList, setBookmarksList] = useState([]);
  const [isBookmark, setIsBookmark] = useState("");
  const [email, setEmail] = useState(props.email);
  const [uid, setUid] = useState(props.userId);
  const [highlightedVerseArray, setHighlightedVerseArray] = useState([]);
  const [currentVisibleChapter, setCurrentVisibleChapter] = useState(
    props.chapterNumber
  );

  const sourceId = props.sourceId;
  const bookId = props.bookId;

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
  const getBookMarks = () => {
    if (connection_Status) {
      if (email && uid) {
        database()
          .ref("users/" + uid + "/bookmarks/" + sourceId + "/" + bookId)
          .on("value", (snapshot) => {
            if (snapshot.val() === null) {
              setBookmarksList([]);
              setIsBookmark(false);
            } else {
              var arr = snapshot.val();
              setBookmarksList(arr);
              let bm = arr.includes(currentVisibleChapter);
              setIsBookmark(bm);
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
  };

  return (
    <LoginContext.Provider
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
        setUid,
        getHighlights,
        highlightedVerseArray,
        setHighlightedVerseArray,
      }}
    >
      <Bible navigation={props.navigation} />
    </LoginContext.Provider>
  );

  // <Bible navigation={props.navigation} />;
};

const mapStateToProps = (state) => {
  return {
    sourceId: state.updateVersion.sourceId,
    chapterNumber: state.updateVersion.chapterNumber,
    email: state.userInfo.email,
    userId: state.userInfo.uid,
  };
};

export default connect(mapStateToProps, null)(BibleWrapper);
