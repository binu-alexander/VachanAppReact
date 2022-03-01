import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Card, CardItem } from "native-base";
import { connect } from "react-redux";
import database from "@react-native-firebase/database";
import { styles } from "./styles.js";
import Colors from "../../utils/colorConstants";
import ListContainer from "../../components/Common/FlatList.js";

const Note = (props) => {
  const chapterNumber = props.route.params
    ? props.route.params.chapterNumber
    : null;
  const bookId = props.route.params ? props.route.params.bookId : null;
  const [notesData, setNotesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const email = props.email;
  const style = styles(props.colorFile, props.sizeFile);

  const onDelete = (createdTime, body, k, l) => {
    var data = [...notesData];
    data.forEach((a, i) => {
      var firebaseRef = database().ref(
        "users/" + props.uid + "/notes/" + props.sourceId + "/" + a.bookId
      );
      if (i == k) {
        a.notes.forEach((b, j) => {
          if (b.body == body && j == l && createdTime == b.createdTime) {
            var updates = {};
            if (a.notes.length == 1) {
              data.splice(i, 1);
              updates[a.chapterNumber] = null;
              firebaseRef.update(updates);
            } else {
              a.notes.splice(j, 1);
              updates[a.chapterNumber] = a.notes;
              firebaseRef.update(updates);
            }
          }
        });
      }
    });
    setNotesData(data);
  };

  const fetchNotes = () => {
    setIsLoading(true);
    if (email) {
      setIsLoading(true);
      var firebaseRef = database().ref(
        "users/" + props.uid + "/notes/" + props.sourceId
      );
      firebaseRef.once("value", (snapshot) => {
        setIsLoading(true);
        if (snapshot.val() === null) {
          setNotesData([]);
          setMessage("No Note for " + props.languageName);
          setIsLoading(false);
        } else {
          var arr = [];
          var notes = snapshot.val();
          for (var bookKey in notes) {
            for (var chapterKey in notes[bookKey]) {
              if (notes[bookKey][chapterKey] != null) {
                if (chapterNumber && bookId) {
                  if (chapterKey == chapterNumber && bookKey == bookId) {
                    arr.push({
                      bookId: bookKey,
                      chapterNumber: chapterKey,
                      notes: Array.isArray(notes[bookKey][chapterKey])
                        ? notes[bookKey][chapterKey]
                        : [notes[bookKey][chapterKey]],
                    });
                  }
                } else {
                  arr.push({
                    bookId: bookKey,
                    chapterNumber: chapterKey,
                    notes: Array.isArray(notes[bookKey][chapterKey])
                      ? notes[bookKey][chapterKey]
                      : [notes[bookKey][chapterKey]],
                  });
                }
              }
            }
          }
          arr.sort(function (a, b) {
            return (
              new Date(b.notes[0].modifiedTime) -
              new Date(a.notes[0].modifiedTime)
            );
          });
          setNotesData(arr);
          setIsLoading(false);
        }
      });
      setIsLoading(false);
    } else {
      setNotesData([]);
      setIsLoading(false);
      setMessage("Please  click here for login");
    }
  };
  const bodyText = (text) => {
    return text;
  };
  const dateFormate = (modifiedTime) => {
    var date = new Date(modifiedTime).toLocaleString();
    return date;
  };
  const emptyMessageNavigation = () => {
    if (email) {
      props.navigation.navigate("Bible");
    } else {
      props.navigation.navigate("Login");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [email]);
  const renderItem = ({ item, index }) => {
    var bookName = null;
    if (props.books) {
      for (var i = 0; i <= props.books.length - 1; i++) {
        var bId = props.books[i].bookId;
        if (bId == item.bookId) {
          bookName = props.books[i].bookName;
        }
      }
    } else {
      setNotesData([]);
      return;
    }
    let value =
      item.notes &&
      item.notes.map((val, j) => (
        <TouchableOpacity
          key={j}
          style={style.noteContent}
          onPress={() => {
            props.navigation.navigate("EditNote", {
              bcvRef: {
                bookId: item.bookId,
                bookName: bookName,
                chapterNumber: item.chapterNumber,
                verses: val.verses,
              },
              notesList: item.notes,
              contentBody: bodyText(val.body),
              onbackNote: fetchNotes,
              noteIndex: j,
            });
          }}
        >
          <Card>
            <CardItem style={style.cardItemStyle}>
              <View style={style.notesContentView}>
                <Text style={style.noteText}>
                  {props.languageName &&
                    props.languageName.charAt(0).toUpperCase() +
                      props.languageName.slice(1)}{" "}
                  {props.versionCode && props.versionCode.toUpperCase()}{" "}
                  {bookName} {item.chapterNumber} {":"} {val.verses.join()}
                </Text>
                <View style={style.noteCardItem}>
                  <Text style={style.noteFontCustom}>
                    {dateFormate(val.modifiedTime)}
                  </Text>
                  <Icon
                    name="delete-forever"
                    style={style.deleteIon}
                    onPress={() =>
                      onDelete(val.createdTime, val.body, index, j)
                    }
                  />
                </View>
              </View>
            </CardItem>
          </Card>
        </TouchableOpacity>
      ));
    return <View>{bookName && value}</View>;
  };
  console.log(isLoading);
  return (
    <View style={style.container}>
      {isLoading && message.length != 0 ? (
        <ActivityIndicator
          size="small"
          color={Colors.Blue_Color}
          animate={true}
          style={style.loaderPosition}
        />
      ) : (
        /* <FlatList
            contentContainerStyle={
              this.state.notesData.length === 0
                ? this.styles.centerEmptySet
                : this.styles.noteFlatlistCustom
            }
            data={this.state.notesData}listData
            renderItem={this.renderItem}
            ListEmptyComponent={
              <View style={this.styles.emptyMessageContainer}>
                <Icon name="note" style={this.styles.emptyMessageIcon} />
                <Text
                  style={this.styles.messageEmpty}
                  onPress={this.emptyMessageNavigation}>
                  {this.state.message}
                </Text>
              </View>
            }
          /> */
        <ListContainer
          listData={notesData}
          listStyle={
            style.centerEmptySet
              ? style.centerEmptySet
              : style.noteFlatlistCustom
          }
          renderItem={renderItem}
          containerStyle={style.emptyMessageContainer}
          icon="note"
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
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    sourceId: state.updateVersion.sourceId,

    languageName: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    email: state.userInfo.email,
    uid: state.userInfo.uid,
    books: state.versionFetch.versionBooks,
  };
};

export default connect(mapStateToProps, null)(Note);
