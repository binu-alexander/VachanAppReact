import React, { Component } from "react";
import {
  FlatList,
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import {
  vachanAPIFetch,
  fetchVersionBooks,
  selectContent,
} from "../../../store/action/index";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import Color from "../../../utils/colorConstants";
import ReloadButton from "../../../components/ReloadButton";
import HTML from "react-native-render-html";
import vApi from "../../../utils/APIFetch";
import securityVaraibles from "../../../../securityVaraibles";
import SelectContent from "../../../components/Bible/SelectContent";
import constants from "../../../utils/constants";
import ModalDropdown from "react-native-modal-dropdown";
import { getBookChaptersFromMapping } from "../../../utils/UtilFunctions";

const height = Dimensions.get("window").height;

const commentaryKey = securityVaraibles.COMMENTARY_KEY
  ? "?key=" + securityVaraibles.COMMENTARY_KEY
  : "";

class DrawerCommentary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentary: [],
      totalChapters: Array.from(
        new Array(getBookChaptersFromMapping(this.props.bookId)),
        (x, i) => (i + 1).toString()
      ),
      chapterNumber: this.props.chapterNumber,
      error: null,
      bookName: this.props.bookName,
      bookId: this.props.bookId,
      bookNameList: [],
      dropDownList: [],
      bookResponse: [],
      parallelMetaData: this.props.parallelMetaData,
      parallelLanguage: this.props.parallelLanguage,
      selectedBookIndex: -1,
      selectedBook: this.props.bookName,
    };
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
    this.alertPresent = false;
  }

  async fetchBookName() {
    try {
      let response = await vApi.get("booknames");
      this.setState({ bookResponse: response }, () => {
        this.updateBookName();
      });
    } catch (error) {
      this.setState({ error: error, bookNameList: [], bookResponse: [] });
    }
  }
  updateBookName() {
    let res = this.state.bookResponse;
    if (res.length > 0) {
      var bookNameList = [];
      var dropDownList = [];
      if (res) {
        for (var i = 0; i <= res.length - 1; i++) {
          let parallelLanguage =
            this.state.parallelLanguage.languageName.toLowerCase();
          if (res[i].language.name === parallelLanguage) {
            var bookList = res[i].bookNames.sort(function (a, b) {
              return a.book_id - b.book_id;
            });
            for (var j = 0; j <= bookList.length - 1; j++) {
              let bId = bookList[j].book_code;
              let bName = bookList[j].short;
              let bNumber = bookList[j].book_id;
              if (bId == this.state.bookId) {
                this.setState({ bookName: bName, bookId: bId });
              }
              bookNameList.push({
                bookName: bName,
                bookId: bId,
                bookNumber: bNumber,
              });
              dropDownList.push(bName);
            }
          }
        }
        this.setState({ bookNameList, dropDownList });
      } else {
        return;
      }
    }
  }

  onSelectBook = (index, val) => {
    var bookId = null;
    this.state.bookNameList.forEach((item) => {
      if (item.bookName == val) {
        bookId = item.bookId;
      }
    });
    this.setState(
      {
        bookId,
        totalChapters: Array.from(
          new Array(getBookChaptersFromMapping(bookId)),
          (x, i) => (i + 1).toString()
        ),
      },
      () => {
        let selectedNumber =
          this.state.totalChapters.length < this.state.chapterNumber
            ? "1"
            : this.state.chapterNumber;
        this._dropdown_2.select(parseInt(selectedNumber) - 1);
        this.setState(
          {
            chapterNumber: selectedNumber,
            selectedBookIndex: index,
            selectedBook: val,
            bookName: val,
          },
          () => {
            this.commentaryUpdate();
          }
        );
      }
    );
  };

  onSelectChapter = (index, value) => {
    this.setState({ chapterNumber: parseInt(value) }, () => {
      this.commentaryUpdate();
    });
  };
  commentaryUpdate() {
    let url =
      "commentaries/" +
      this.state.parallelLanguage.sourceId +
      "/" +
      this.state.bookId +
      "/" +
      this.state.chapterNumber +
      commentaryKey;
    this.props.vachanAPIFetch(url);
  }
  fetchCommentary() {
    let commentary = [];
    this.props.availableContents.forEach((element) => {
      if (element.contentType == "commentary") {
        element.content.forEach((lang) => {
          if (lang.languageName == this.props.language) {
            commentary = lang;
          }
        });
      }
    });
    if (Object.keys(commentary).length > 0) {
      this.setState(
        {
          parallelMetaData: commentary.versionModels[0].metaData[0],
          parallelLanguage: {
            languageName: commentary.languageName,
            versionCode: commentary.versionModels[0].versionCode,
            sourceId: commentary.versionModels[0].sourceId,
          },
        },
        () => {
          this.commentaryUpdate();
          this.props.selectContent({
            parallelLanguage: this.state.parallelLanguage,
            parallelMetaData: this.state.parallelMetaData,
          });
        }
      );
    } else {
      this.setState(
        {
          parallelMetaData: constants.defaultCommentaryMd,
          parallelLanguage: constants.defaultCommentary,
        },
        () => {
          this.commentaryUpdate();
          this.props.selectContent({
            parallelLanguage: constants.defaultCommentary,
            parallelMetaData: constants.defaultCommentaryMd,
          });
        }
      );
    }
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 18, fontWeight: "800", color: "#fff" }}>
          Commentary
        </Text>
      ),
      headerRight: () => (
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <SelectContent
            navigation={this.props.navigation}
            navStyles={navStyles}
            iconName={"arrow-drop-down"}
            title={this.state.parallelLanguage.languageName}
            displayContent="commentary"
          />
        </View>
      ),
    });
    this.fetchBookName();
    this.fetchCommentary();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.parallelLanguage.sourceId !==
      this.props.parallelLanguage.sourceId
    ) {
      this.setState(
        {
          parallelLanguage: this.props.parallelLanguage,
          parallelMetaData: this.props.parallelMetaData,
        },
        async () => {
          this.props.navigation.setOptions({
            headerRight: () => (
              <View
                style={{
                  paddingHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <SelectContent
                  navigation={this.props.navigation}
                  navStyles={navStyles}
                  iconName={"arrow-drop-down"}
                  title={this.state.parallelLanguage.languageName}
                  displayContent="commentary"
                />
              </View>
            ),
          });
          this.commentaryUpdate();
          this.updateBookName();
        }
      );
    }
    console.log(
      "prev state ,",
      prevState.dropDownList[0],
      this.state.dropDownList[0]
    );
    if (prevState.dropDownList[0] != this.state.dropDownList[0]) {
      console.log("not ,");
      if (this.state.selectedBookIndex == -1) {
        this.state.dropDownList.forEach((b, index) => {
          if (this.state.bookName == b) {
            console.log("BOOK NAME ", b);
            this.onSelectBook(index, b);
            // this._dropdown_1.select(index)
          }
        });
      } else {
        this._dropdown_1.select(this.state.selectedBookIndex);
      }
    }
  }

  errorMessage() {
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.props.error || this.state.error) {
        Alert.alert(
          "",
          "Check your internet connection",
          [
            {
              text: "OK",
              onPress: () => {
                this.alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
        if (this.props.parallelLanguage) {
          this.commentaryUpdate();
        }
      } else {
        this.alertPresent = false;
      }
    }
  }
  updateData = () => {
    this.errorMessage();
  };

  renderItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        {item.verse &&
          (item.verse == 0 ? (
            <Text style={this.styles.commentaryHeading}>Chapter Intro</Text>
          ) : (
            <Text style={this.styles.commentaryHeading}>
              Verse Number : {item.verse}
            </Text>
          ))}
        <HTML
          baseFontStyle={this.styles.textString}
          tagsStyles={{ p: this.styles.textString }}
          html={item.text}
        />
      </View>
    );
  };
  ListHeaderComponent = () => {
    return (
      <View>
        {this.props.commentaryContent &&
        this.props.commentaryContent.bookIntro ? (
          <View style={this.styles.cardItemBackground}>
            <Text style={this.styles.commentaryHeading}>Book Intro</Text>
            <HTML
              baseFontStyle={this.styles.textString}
              tagsStyles={{ p: this.styles.textString }}
              html={
                this.props.commentaryContent &&
                this.props.commentaryContent.bookIntro
              }
            />
          </View>
        ) : null}
      </View>
    );
  };
  renderFooter = () => {
    var metadata = this.state.parallelMetaData;
    console.log("FOOTER ", this.state.parallelMetaData);
    return (
      <View style={{ paddingVertical: 20 }}>
        {this.props.commentaryContent &&
          this.props.commentaryContent.commentaries &&
          this.props.parallelMetaData && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {metadata?.revision !== null && metadata?.revision !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={{ textAlign: "center" }}
                >
                  <Text>Copyright:</Text> {metadata?.revision}
                </Text>
              )}
              {metadata?.copyrightHolder !== null &&
                metadata?.copyrightHolder !== "" && (
                  <Text
                    textBreakStrategy={"simple"}
                    style={{ textAlign: "center" }}
                  >
                    <Text>License:</Text> {metadata?.copyrightHolder}
                  </Text>
                )}
              {metadata?.license !== null && metadata?.license !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={{ textAlign: "center" }}
                >
                  <Text>Technology partner:</Text> {metadata?.license}
                </Text>
              )}
            </View>
          )}
      </View>
    );
  };

  render() {
    console.log("parallel meta data ", this.state.parallelMetaData);
    return (
      <View style={this.styles.container}>
        {this.props.error ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ReloadButton
              styles={this.styles}
              reloadFunction={this.updateData}
              message={null}
            />
          </View>
        ) : this.props.parallelLanguage == undefined ? null : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this._dropdown_1 && this._dropdown_1.show();
                }}
                style={{
                  padding: 10,
                  margin: 10,
                  borderRadius: 10,
                  width: 150,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: this.props.colorFile.iconColor,
                  borderWidth: 0.5,
                }}
              >
                <ModalDropdown
                  ref={(el) => (this._dropdown_1 = el)}
                  options={this.state.dropDownList}
                  onSelect={this.onSelectBook}
                  style={{ paddingRight: 20 }}
                  defaultValue={this.state.bookName}
                  isFullWidth={true}
                  dropdownStyle={{ width: "60%", height: height / 2 }}
                  dropdownTextStyle={{ fontSize: 18 }}
                  textStyle={{
                    paddingHorizontal: 8,
                    fontSize: 18,
                    fontWeight: "400",
                    color: this.props.colorFile.textColor,
                  }}
                />
                <Icon
                  name="arrow-drop-down"
                  color={this.props.colorFile.iconColor}
                  size={20}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this._dropdown_2 && this._dropdown_2.show();
                }}
                style={{
                  padding: 10,
                  margin: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: this.props.colorFile.iconColor,
                  borderWidth: 0.5,
                }}
              >
                <ModalDropdown
                  ref={(el) => (this._dropdown_2 = el)}
                  options={this.state.totalChapters}
                  onSelect={this.onSelectChapter}
                  defaultValue={this.state.chapterNumber}
                  isFullWidth={true}
                  dropdownStyle={{ width: "60%", height: height / 2 }}
                  dropdownTextStyle={{ fontSize: 18 }}
                  textStyle={{
                    fontSize: 18,
                    fontWeight: "400",
                    color: this.props.colorFile.textColor,
                  }}
                />
                <Icon
                  name="arrow-drop-down"
                  color={this.props.colorFile.iconColor}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={
                this.props.commentaryContent &&
                this.props.commentaryContent.commentaries
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, margin: 16 }}
              renderItem={this.renderItem}
              ListFooterComponent={
                <View style={{ height: 40, marginBottom: 40 }}></View>
              }
              ListHeaderComponent={this.ListHeaderComponent}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              ListFooterComponent={this.renderFooter}
            />
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    availableContents: state.contents.contentLanguages,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    contentType: state.updateVersion.contentType,
    chapterNumber: state.updateVersion.chapterNumber,
    books: state.versionFetch.versionBooks,
    commentaryContent: state.vachanAPIFetch.apiData,
    error: state.vachanAPIFetch.error,
    baseAPI: state.updateVersion.baseAPI,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
    parallelContentType: state.updateVersion.parallelContentType,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    vachanAPIFetch: (payload) => dispatch(vachanAPIFetch(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    selectContent: (payload) => dispatch(selectContent(payload)),
  };
};

const navStyles = StyleSheet.create({
  title: {
    color: "#333333",
    flexDirection: "row",
    height: 40,
    // top:0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.Blue_Color,
    zIndex: 0,
    width: "100%",
    // marginBottom:30
  },

  border: {
    paddingHorizontal: 4,
    paddingVertical: 4,

    borderWidth: 0.2,
    borderColor: Color.White,
  },
  headerRightStyle: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: Color.Blue_Color,
  },
  touchableStyleRight: {
    alignSelf: "center",
  },
  titleTouchable: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightdownload: {
    alignSelf: "flex-end",
  },
  touchableStyleLeft: {
    flexDirection: "row",
    marginHorizontal: 8,
  },
  headerTextStyle: {
    fontSize: 18,
    color: Color.White,
    textAlign: "center",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(DrawerCommentary);
