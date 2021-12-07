import React, { Component } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getBookChaptersFromMapping } from "../../utils/UtilFunctions";
import { highlightstyle } from "./styles";
import { connect } from "react-redux";
import { updateVersionBook } from "../../store/action/";
import database from "@react-native-firebase/database";
import Colors from "../../utils/colorConstants";
import ListContainer from "../../components/Common/FlatList";

class HighLights extends Component {
  constructor(props) {
    super(props);
    this.state = {
      HightlightedVerseArray: [],
      isLoading: false,
      message: "",
      email: this.props.email,
    };
    this.styles = highlightstyle(this.props.colorFile, this.props.sizeFile);
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
  removeHighlight = (id, chapterNum, verseNum) => {
    var data = this.state.HightlightedVerseArray;
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
                    this.props.uid +
                    "/highlights/" +
                    this.props.sourceId +
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
                    this.props.uid +
                    "/highlights/" +
                    this.props.sourceId +
                    "/" +
                    id
                )
                .update(updates);
            }
          }
        });
      }
    });
    this.setState({ HightlightedVerseArray: data });
  };

  fetchHighlights() {
    this.setState({ isLoading: true }, () => {
      if (this.state.email) {
        database()
          .ref(
            "/users/" +
              this.props.uid +
              "/highlights/" +
              this.props.sourceId +
              "/"
          )
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
              this.setState({
                HightlightedVerseArray: array,
                isLoading: false,
              });
            } else {
              this.setState({
                HightlightedVerseArray: [],
                message: "No highlights for " + this.props.languageName,
                isLoading: false,
              });
            }
          });
        this.setState({ isLoading: false });
      } else {
        this.setState({
          HightlightedVerseArray: [],
          isLoading: false,
          message: "Please click here for login",
        });
      }
    });
  }
  async componentDidMount() {
    this.fetchHighlights();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.books.length != this.props.books.length) {
      this.fetchHighlights();
    }
  }
  navigateToBible = (bId, bookName, chapterNum) => {
    this.props.updateVersionBook({
      bookId: bId,
      bookName: bookName,
      chapterNumber: chapterNum,
      totalChapters: getBookChaptersFromMapping(bId),
    });
    this.props.navigation.navigate("Bible");
  };
  emptyMessageNavigation = () => {
    if (this.state.email) {
      this.props.navigation.navigate("Bible");
    } else {
      this.props.navigation.navigate("Login");
    }
  };
  renderItem = ({ item }) => {
    var bookName = null;
    if (this.props.books) {
      for (var i = 0; i <= this.props.books.length - 1; i++) {
        var bId = this.props.books[i].bookId;
        if (bId == item.bookId) {
          bookName = this.props.books[i].bookName;
        }
      }
    } else {
      this.setState({ HightlightedVerseArray: [] });
      return;
    }

    let value =
      item.verseNumber &&
      item.verseNumber !== "undefined" &&
      item.verseNumber.map((e, index) => {
        console.log("e ", e);
        let verse = String(e).split(":", 1);
        return (
          <TouchableOpacity
            key={index}
            style={this.styles.bookmarksView}
            onPress={() => {
              this.navigateToBible(
                item.bookId,
                bookName,
                item.chapterNumber,
                e
              );
            }}
          >
            <Text style={this.styles.bookmarksText}>
              {this.props.languageName &&
                this.props.languageName.charAt(0).toUpperCase() +
                  this.props.languageName.slice(1)}{" "}
              {this.props.versionCode && this.props.versionCode.toUpperCase()}{" "}
              {bookName} {item.chapterNumber} {":"} {verse}
            </Text>
            <Icon
              name="delete-forever"
              style={this.styles.iconCustom}
              onPress={() => {
                this.removeHighlight(item.bookId, item.chapterNumber, e);
              }}
            />
          </TouchableOpacity>
        );
      });
    return <View>{bookName && value}</View>;
  };
  render() {
    console.log("HIGHLIGHTS loader ", this.state.isLoading);
    return (
      <View style={this.styles.container}>
        {this.state.isLoading ? (
          <ActivityIndicator
            animate={true}
            size="small"
            color={Colors.Blue_Color}
            style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
          />
        ) : (
          <ListContainer
            listData={this.state.HightlightedVerseArray}
            listStyle={this.styles.centerEmptySet}
            renderItem={this.renderItem}
            icon="border-color"
            containerStyle={this.styles.emptyMessageContainer}
            iconStyle={this.styles.emptyMessageIcon}
            textStyle={this.styles.messageEmpty}
            message={this.state.message}
            onPress={this.emptyMessageNavigation}
          />
        )}
      </View>
    );
  }
}

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
    books: state.versionFetch.versionBooks,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HighLights);
