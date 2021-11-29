import React, { Component } from "react";
import { FlatList, Alert, Text, View } from "react-native";
import { connect } from "react-redux";
import { Body, Header, Right, Title, Button } from "native-base";
import { vachanAPIFetch, fetchVersionBooks } from "../../../store/action/index";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import Color from "../../../utils/colorConstants";
import ReloadButton from "../../../components/ReloadButton";
import HTML from "react-native-render-html";
import vApi from "../../../utils/APIFetch";
import securityVaraibles from "../../../../securityVaraibles";

const commentaryKey = securityVaraibles.COMMENTARY_KEY
  ? "?key=" + securityVaraibles.COMMENTARY_KEY
  : "";

class Commentary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentary: [],
      error: null,
      bookName: this.props.bookName,
      bookNameList: [],
    };
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
    this.alertPresent = false;
  }
  // fetch bookname in perticular language of commenatry
  async fetchBookName() {
    try {
      let response = await vApi.get("booknames");
      this.setState({ bookNameList: response });
    } catch (error) {
      this.setState({ error: error, bookNameList: [] });
    }
  }
  componentDidMount() {
    if (this.props.parallelLanguage) {
      let url =
        "commentaries/" +
        this.props.parallelLanguage.sourceId +
        "/" +
        this.props.bookId +
        "/" +
        this.props.currentVisibleChapter +
        commentaryKey;
      console.log("URL UPDATE ", url);
      this.props.vachanAPIFetch(url);
      this.fetchBookName();
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.bookId != prevProps.bookId ||
      prevProps.currentVisibleChapter != this.props.currentVisibleChapter
    ) {
      if (this.props.parallelLanguage) {
        console.log(
          " this.props.parallelLanguage ",
          this.props.parallelLanguage
        );
        const url =
          "commentaries/" +
          this.props.parallelLanguage.sourceId +
          "/" +
          this.props.bookId +
          "/" +
          this.props.currentVisibleChapter +
          commentaryKey;
        this.props.vachanAPIFetch(url);
        this.fetchBookName();
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
          const url =
            "commentaries/" +
            this.props.parallelLanguage.sourceId +
            "/" +
            this.props.bookId +
            "/" +
            this.props.currentVisibleChapter +
            commentaryKey;
          this.props.vachanAPIFetch(url);
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
        this.props.commentaryContent.bookIntro == "" ? null : (
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
        )}
      </View>
    );
  };
  renderFooter = () => {
    return (
      <View style={{ paddingVertical: 20 }}>
        {this.props.commentaryContent &&
          this.props.commentaryContent.commentaries && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {this.props.parallelMetaData?.revision !== null &&
                this.props.parallelMetaData?.revision !== "" && (
                  <Text
                    textBreakStrategy={"simple"}
                    style={{ textAlign: "center" }}
                  >
                    <Text>Copyright:</Text>{" "}
                    {this.props.parallelMetaData?.revision}
                  </Text>
                )}
              {this.props.parallelMetaData?.copyrightHolder !== null &&
                this.props.parallelMetaData?.copyrightHolder !== "" && (
                  <Text
                    textBreakStrategy={"simple"}
                    style={{ textAlign: "center" }}
                  >
                    <Text>License:</Text>{" "}
                    {this.props.parallelMetaData?.copyrightHolder}
                  </Text>
                )}
              {this.props.parallelMetaData?.license !== null &&
                this.props.parallelMetaData?.license !== "" && (
                  <Text
                    textBreakStrategy={"simple"}
                    style={{ textAlign: "center" }}
                  >
                    <Text>Technology partner:</Text>{" "}
                    {this.props.parallelMetaData?.license}
                  </Text>
                )}
            </View>
          )}
      </View>
    );
  };
  render() {
    var bookName = null;
    if (this.state.bookNameList) {
      for (var i = 0; i <= this.state.bookNameList.length - 1; i++) {
        let parallelLanguage =
          this.props.parallelLanguage &&
          this.props.parallelLanguage.languageName.toLowerCase();
        if (this.state.bookNameList[i].language.name === parallelLanguage) {
          for (
            var j = 0;
            j <= this.state.bookNameList[i].bookNames.length - 1;
            j++
          ) {
            var bId = this.state.bookNameList[i].bookNames[j].book_code;
            if (bId == this.props.bookId) {
              bookName = this.state.bookNameList[i].bookNames[j].short;
            }
          }
        }
      }
    } else {
      return;
    }

    return (
      <View style={this.styles.container}>
        <Header
          style={{
            backgroundColor: Color.Blue_Color,
            height: 40,
            borderLeftWidth: 0.5,
            borderLeftColor: Color.White,
          }}
        >
          <Body>
            <Title style={{ fontSize: 16 }}>
              {this.props.parallelLanguage &&
                this.props.parallelLanguage.versionCode}
            </Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.closeParallelView(false)}
            >
              <Icon name="cancel" color={Color.White} size={20} />
            </Button>
          </Right>
        </Header>

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
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={[this.styles.commentaryHeading, { margin: 10 }]}>
              {bookName != null && bookName} {}{" "}
              {this.props.commentaryContent &&
                this.props.commentaryContent.chapter}
            </Text>
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
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    contentType: state.updateVersion.contentType,
    books: state.versionFetch.versionBooks,
    commentaryContent: state.vachanAPIFetch.apiData,
    error: state.vachanAPIFetch.error,
    baseAPI: state.updateVersion.baseAPI,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    vachanAPIFetch: (payload) => dispatch(vachanAPIFetch(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Commentary);
