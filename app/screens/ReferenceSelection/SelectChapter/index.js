import React, { Component } from "react";
import { View } from "react-native";

import SelectionGrid from "../../../components/SelectionGrid/";
import { numberSelection } from "./styles.js";
import { connect } from "react-redux";
import { Icon } from "native-base";
import { updateVersionBook } from "../../../store/action";

class ChapterSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapterData: Array.from(
        new Array(
          this.props.route.params ? this.props.route.params.totalChapters : 0
        ),
        (x, i) => i + 1
      ),
      totalChapters: this.props.route.params
        ? this.props.route.params.totalChapters
        : null,
      selectedBookId: this.props.route.params
        ? this.props.route.params.selectedBookId
        : null,
      selectedBookName: this.props.route.params
        ? this.props.route.params.selectedBookName
        : null,
      selectedChap: this.props.route.params
        ? this.props.route.params.selectedChapterNumber
        : null,
      prevSelectChap: this.props.route.params
        ? this.props.route.params.selectedChapterNumber
        : null,
    };
    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      chapterData: Array.from(
        new Array(
          nextProps.route.params ? nextProps.route.params.totalChapters : 0
        ),
        (x, i) => i + 1
      ),
      totalChapters: nextProps.route.params
        ? nextProps.route.params.totalChapters
        : null,
      selectedBookId: nextProps.route.params
        ? nextProps.route.params.selectedBookId
        : null,
      selectedBookName: nextProps.route.params
        ? nextProps.route.params.selectedBookName
        : null,
      selectedChapterNumber: nextProps.route.params
        ? nextProps.route.params.selectedChapterNumber
        : null,
      prevSelectChap: prevState.selectedChapterNumber,
    };
  }
  onNumPress = (item, index) => {
    var chapterNum = item == null ? this.state.selectedChapterNumber : item;
    let selectedChapter =
      chapterNum > this.state.totalChapters ? "1" : chapterNum;
    if (this.props.route.params) {
      this.props.navigation.navigate("Verses", {
        selectedBookId: this.state.selectedBookId,
        selectedBookName: this.state.selectedBookName,
        selectedChapterNumber: selectedChapter,
        totalChapters: this.state.totalChapters,
      });
    }
  };
  onBack = () => {
    if (this.props.route.params) {
      this.props.updateVersionBook({
        bookId: this.props.route.params.selectedBookId,
        bookName: this.props.route.params.selectedBookName,
        chapterNumber: this.state.prevSelectChap,
      });
      this.props.navigation.navigate("Bible");
    }
  };
  render() {
    console.log(
      this.state.selectedChapterNumber,
      this.state.prevSelectChap,
      "chap"
    );
    return (
      <View style={{ flex: 1 }}>
        <SelectionGrid
          styles={this.styles}
          onNumPress={(item, index) => {
            this.onNumPress(item, index);
          }}
          numbers={this.state.chapterData}
          selectedNumber={this.props.route.params.selectedChapterNumber}
          blueText={this.props.colorFile.blueText}
          textColor={this.props.colorFile.textColor}
        />
        <Icon
          type="AntDesign"
          name="back"
          onPress={this.onBack}
          size={64}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            paddingRight: 20,
            paddingBottom: 10,
            color: "rgba(62, 64, 149, 0.8)",
            fontSize: 40,
          }}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChapterSelection);
