import React, { useEffect, useRef, useState, useContext } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getBookChaptersFromMapping } from "../../utils/UtilFunctions";
import { styles } from "./styles";
import { connect } from "react-redux";
import { updateVersionBook } from "../../store/action/";
import database from "@react-native-firebase/database";
import Colors from "../../utils/colorConstants";
import ListContainer from "../../components/Common/FlatList";
import { MainContext } from "../../context/MainProvider";
const HighLights = (props) => {
  const [HightlightedVerseArray, setHightlightedVerseArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const email = props.email;
  const style = styles(props.colorFile, props.sizeFile);

  const { bookList } = useContext(MainContext);

  const removeHighlight = (id, chapterNum, verseNum) => {
    var data = HightlightedVerseArray;
    data.forEach((a, i) => {
      if (a.bookId == id && a.chapterNumber == chapterNum) {
        a.verseNumber.forEach(async (b, j) => {
          let verse = String(b).split(":", 1);
          let matchedVerse = String(verseNum).split(":", 1);
          if (parseInt(verse) == parseInt(matchedVerse)) {
            if (a.verseNumber.length == 1) {
              database()
                .ref(
                  "users/" +
                  props.uid +
                  "/highlights/" +
                  props.sourceId +
                  "/" +
                  id +
                  "/" +
                  chapterNum
                )
                .remove();
              data.splice(i, 1);
            } else {
              a.verseNumber.splice(j, 1);
              var updates = {};
              updates[chapterNum] = data[i].verseNumber;
              database()
                .ref(
                  "users/" +
                  props.uid +
                  "/highlights/" +
                  props.sourceId +
                  "/" +
                  id
                )
                .update(updates);
            }
          }
        });
      }
    });
    setHightlightedVerseArray(data);
  };
  const fetchHighlights = () => {
    setIsLoading(true);
    if (email) {
      database()
        .ref("/users/" + props.uid + "/highlights/" + props.sourceId + "/")
        .once("value", (snapshot) => {
          var highlights = snapshot.val();
          var array = [];
          if (highlights != null) {
            for (var key in highlights) {
              for (var val in highlights[key]) {
                if (highlights[key][val] != null) {
                  let value = highlights[key][val];
                  if (value != undefined) {
                    let verseNumber = [];
                    for (var i = 0; i < value.length; i++) {
                      if (value[i]) {
                        verseNumber.push(value[i]);
                      }
                    }
                    array.push({
                      bookId: key,
                      chapterNumber: val,
                      verseNumber: verseNumber,
                    });
                  }
                }
              }
            }
            setHightlightedVerseArray(array);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            setMessage("No highlights for " + props.languageName);
            setHightlightedVerseArray(HightlightedVerseArray);
          }
        });
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setMessage("Please click here for login");
      setHightlightedVerseArray(HightlightedVerseArray);
    }
  };
  const navigateToBible = (bId, bookName, chapterNum) => {
    props.updateVersionBook({
      bookId: bId,
      bookName: bookName,
      chapterNumber: chapterNum,
      totalChapters: getBookChaptersFromMapping(bId),
    });
    props.navigation.navigate("Bible");
  };
  const emptyMessageNavigation = () => {
    if (email) {
      props.navigation.navigate("Bible");
    } else {
      props.navigation.navigate("Login");
    }
  };
  const renderItem = ({ item }) => {
    var bookName = null;
    if (bookList) {
      for (var i = 0; i <= bookList.length - 1; i++) {
        var bId = bookList[i].bookId;
        if (bId == item.bookId) {
          bookName = bookList[i].bookName;
        }
      }
    } else {
      setHightlightedVerseArray(HightlightedVerseArray);
      return;
    }
    let value =
      item.verseNumber &&
      item.verseNumber !== "undefined" &&
      item.verseNumber.map((e, index) => {
        let verse = String(e).split(":", 1);
        return (
          <TouchableOpacity
            key={index}
            style={style.bookmarksView}
            onPress={() => {
              navigateToBible(item.bookId, bookName, item.chapterNumber, e);
            }}
          >
            <Text style={style.bookmarksText}>
              {props.languageName &&
                props.languageName.charAt(0).toUpperCase() +
                props.languageName.slice(1)}{" "}
              {props.versionCode && props.versionCode.toUpperCase()} {bookName}{" "}
              {item.chapterNumber} {":"} {verse}
            </Text>
            <Icon
              name="delete-forever"
              style={style.iconCustom}
              onPress={() => {
                removeHighlight(item.bookId, item.chapterNumber, e);
              }}
            />
          </TouchableOpacity>
        );
      });
    return <View>{bookName && value}</View>;
  };

  useEffect(() => {
    fetchHighlights();
  }, [bookList, HightlightedVerseArray]);
  return (
    <View style={style.container}>
      {isLoading ? (
        <ActivityIndicator
          animate={true}
          size="small"
          color={Colors.Blue_Color}
          style={style.loaderStyle}
        />
      ) : (
        <ListContainer
          listData={HightlightedVerseArray}
          listStyle={style.centerEmptySet}
          renderItem={renderItem}
          icon="border-color"
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
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    sourceId: state.updateVersion.sourceId,
    email: state.userInfo.email,
    uid: state.userInfo.uid,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HighLights);
