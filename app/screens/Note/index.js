import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Card, CardItem } from "native-base";
import { connect } from "react-redux";
import database from "@react-native-firebase/database";
import { noteStyle } from "./styles.js";
import Colors from "../../utils/colorConstants";

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verseNumber: this.props.route.params
        ? this.props.route.params.verseNumber
        : null,
      chapterNumber: this.props.route.params
        ? this.props.route.params.chapterNumber
        : null,
      bookId: this.props.route.params ? this.props.route.params.bookId : null,

      colorFile: this.props.colorFile,
      sizeFile: this.props.sizeFile,
      notesData: [],
      referenceList: [],
      isLoading: false,
      message: "",
      email: this.props.email,
    };
    this.styles = noteStyle(props.colorFile, props.sizeFile);

    this.fetchNotes = this.fetchNotes.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    if (props.email !== state.email) {
      return {
        email: props.email,
      };
    }
    return null;
  }
  onDelete = (createdTime, body, k, l) => {
    var data = [...this.state.notesData];
    data.forEach((a, i) => {
      var firebaseRef = database().ref(
        "users/" +
          this.props.uid +
          "/notes/" +
          this.props.sourceId +
          "/" +
          a.bookId
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
    this.setState({ notesData: data });
  };

  fetchNotes() {
    this.setState({ isLoading: true }, () => {
      if (this.state.email) {
        var firebaseRef = database().ref(
          "users/" + this.props.uid + "/notes/" + this.props.sourceId
        );
        firebaseRef.once("value", (snapshot) => {
          if (snapshot.val() === null) {
            this.setState({
              notesData: [],
              message: "No Note for " + this.props.languageName,
              isLoading: false,
            });
          } else {
            var arr = [];
            var notes = snapshot.val();
            for (var bookKey in notes) {
              for (var chapterKey in notes[bookKey]) {
                if (notes[bookKey][chapterKey] != null) {
                  if (this.state.chapterNumber && this.state.bookId) {
                    if (
                      chapterKey == this.state.chapterNumber &&
                      bookKey == this.state.bookId
                    ) {
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
            this.setState({
              notesData: arr,
              isLoading: false,
            });
          }
        });
        this.setState({ isLoading: false });
      } else {
        this.setState({
          notesData: [],
          isLoading: false,
          message: "Please  click here for login",
        });
      }
    });
  }
  componentDidMount() {
    this.fetchNotes();
  }

  bodyText(text) {
    return text;
  }
  dateFormate(modifiedTime) {
    var date = new Date(modifiedTime).toLocaleString();
    return date;
  }
  emptyMessageNavigation = () => {
    if (this.state.email) {
      this.props.navigation.navigate("Bible");
    } else {
      this.props.navigation.navigate("Login");
    }
  };
  renderItem = ({ item, index }) => {
    var bookName = null;
    if (this.props.books) {
      for (var i = 0; i <= this.props.books.length - 1; i++) {
        var bId = this.props.books[i].bookId;
        if (bId == item.bookId) {
          bookName = this.props.books[i].bookName;
        }
      }
    } else {
      this.setState({ notesData: [] });
      return;
    }
    let value =
      item.notes &&
      item.notes.map((val, j) => (
        <TouchableOpacity
          key={j}
          style={this.styles.noteContent}
          onPress={() => {
            this.props.navigation.navigate("EditNote", {
              bcvRef: {
                bookId: item.bookId,
                bookName: bookName,
                chapterNumber: item.chapterNumber,
                verses: val.verses,
              },
              notesList: item.notes,
              contentBody: this.bodyText(val.body),
              onbackNote: this.fetchNotes,
              noteIndex: j,
            });
          }}
        >
          <Card>
            <CardItem style={this.styles.cardItemStyle}>
              <View style={this.styles.notesContentView}>
                <Text style={this.styles.noteText}>
                  {this.props.languageName &&
                    this.props.languageName.charAt(0).toUpperCase() +
                      this.props.languageName.slice(1)}{" "}
                  {this.props.versionCode &&
                    this.props.versionCode.toUpperCase()}{" "}
                  {bookName} {item.chapterNumber} {":"} {val.verses.join()}
                </Text>
                <View style={this.styles.noteCardItem}>
                  <Text style={this.styles.noteFontCustom}>
                    {this.dateFormate(val.modifiedTime)}
                  </Text>
                  <Icon
                    name="delete-forever"
                    style={this.styles.deleteIon}
                    onPress={() =>
                      this.onDelete(val.createdTime, val.body, index, j)
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

  render() {
    return (
      <View style={this.styles.container}>
        {this.state.isLoading ? (
          <ActivityIndicator
            size="small"
            color={Colors.Blue_Color}
            animate={true}
            style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
          />
        ) : (
          <FlatList
            contentContainerStyle={
              this.state.notesData.length === 0
                ? this.styles.centerEmptySet
                : this.styles.noteFlatlistCustom
            }
            data={this.state.notesData}
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
          />
        )}
      </View>
    );
  }
}

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
