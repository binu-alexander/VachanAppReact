import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles.js";
import { updateVersionBook } from "../../store/action/";
import { getBookChaptersFromMapping } from "../../utils/UtilFunctions";
import { connect } from "react-redux";
import database from "@react-native-firebase/database";
import Colors from "../../utils/colorConstants";
import ListContainer from "../../components/Common/FlatList.js";

const BookMarks = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarksList, setBookmarksList] = useState([]);
  const [message, setMessage] = useState("");
  const email = props.email;
  const style = styles(props.colorFile, props.sizeFile);
  const prevBooks = useRef(props.books).current;
  const fecthBookmarks = () => {
    setIsLoading(true);
    if (email) {
      var firebaseRef = database().ref(
        "users/" + props.uid + "/bookmarks/" + props.sourceId
      );
      firebaseRef.once("value", (snapshot) => {
        var data = [];
        var list = snapshot.val();
        if (snapshot.val() != null) {
          for (var key in list) {
            data.push({ bookId: key, chapterNumber: list[key] });
          }
          setBookmarksList(data);
          setIsLoading(false);
        } else {
          setBookmarksList(data);
          setMessage("No bookmark Added for " + props.languageName);
          setIsLoading(false);
        }
      });
      setBookmarksList(bookmarksList);
      setIsLoading(false);
    } else {
      setBookmarksList(bookmarksList);
      setMessage("Please click here for login");
      setIsLoading(false);
    }
  };
  const navigateToBible = (bookId, bookName, chapter) => {
    props.updateVersionBook({
      bookId: bookId,
      bookName: bookName,
      chapterNumber: chapter,
      totalChapters: getBookChaptersFromMapping(bookId),
    });
    props.navigation.navigate("Bible");
  };
  const onBookmarkRemove = (id, chapterNum) => {
    if (email) {
      var data = bookmarksList;
      data.filter((a, i) => {
        if (a.bookId == id) {
          a.chapterNumber.filter((b, j) => {
            if (b == chapterNum) {
              var firebaseRef = database().ref(
                "users/" + props.uid + "/bookmarks/" + props.sourceId + "/" + id
              );
              if (a.chapterNumber.length == 1) {
                data.splice(i, 1);
                firebaseRef.remove();
                return;
              } else {
                a.chapterNumber.splice(j, 1);
              }
              firebaseRef.set(a.chapterNumber);
            }
          });
        }
        setBookmarksList(data);
      });
    }
  };
  const renderItem = ({ item }) => {
    var bookName = null;
    if (props.books) {
      for (var i = 0; i <= props.books.length - 1; i++) {
        var bId = props.books[i].bookId;
        if (bId == item.bookId) {
          bookName = props.books[i].bookName;
        }
      }
    } else {
      setBookmarksList([]);
      return;
    }
    var value =
      item.chapterNumber.length > 0 &&
      item.chapterNumber.map((e, index) => (
        <TouchableOpacity
          style={style.bookmarksView}
          key={index}
          onPress={() => {
            navigateToBible(item.bookId, bookName, e);
          }}
        >
          <Text style={style.bookmarksText}>
            {props.languageName &&
              props.languageName.charAt(0).toUpperCase() +
                props.languageName.slice(1)}{" "}
            {props.versionCode && props.versionCode.toUpperCase()} {bookName}{" "}
            {e}
          </Text>
          <Icon
            name="delete-forever"
            style={style.iconCustom}
            onPress={() => {
              onBookmarkRemove(item.bookId, e);
            }}
          />
        </TouchableOpacity>
      ));
    return <View>{bookName && value}</View>;
  };
  const emptyMessageNavigation = () => {
    if (email) {
      props.navigation.navigate("Bible");
    } else {
      props.navigation.navigate("Login");
    }
  };

  useEffect(() => {
    fecthBookmarks();
    if (prevBooks.length !== props.books.length) {
      fecthBookmarks();
    }
  }, [email, bookmarksList, setBookmarksList]);
  return (
    <View style={style.container}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={Colors.Blue_Color}
          animate={true}
          style={style.loaderPosition}
        />
      ) : (
        <ListContainer
          listData={bookmarksList}
          listStyle={style.centerEmptySet}
          renderItem={renderItem}
          icon="collections-bookmark"
          containerStyle={style.emptyMessageContainer}
          iconStyle={style.emptyMessageIcon}
          textStyle={style.messageEmpty}
          message={message}
          onPress={emptyMessageNavigation}
        />
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    languageName: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    bookName: state.updateVersion.bookName,

    email: state.userInfo.email,
    uid: state.userInfo.uid,

    bookId: state.updateVersion.bookId,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,

    books: state.versionFetch.versionBooks,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookMarks);
