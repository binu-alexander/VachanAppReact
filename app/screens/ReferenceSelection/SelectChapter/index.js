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
      prevSelectedBookId: this.props.route.params
        ? this.props.route.params.selectedBookId
        : null,
      prevSelectedBookName: this.props.route.params
        ? this.props.route.params.selectedBookName
        : null,
      prevTotalChapters: this.props.route.params
        ? this.props.route.params.totalChapters
        : null,
    };
    this.styles = numberSelection(this.props.colorFile, this.props.sizeFile);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(prevState.selectedBookId, "pre");
    return {
      chapterData: Array.from(
        new Array(
          nextProps.route.params ? nextProps.route.params.totalChapters : 0
        ),
        (x, i) => i + 1
      ),
      totalChapters: nextProps.route.params
        ? nextProps.route.params.totalChapters
        : prevState.totalChapters,
      selectedBookId: nextProps.route.params
        ? nextProps.route.params.selectedBookId
        : prevState.selectedBookId,
      selectedBookName: nextProps.route.params
        ? nextProps.route.params.selectedBookName
        : prevState.selectedBookName,
      prevSelectedBookId: prevState.selectedBookId,
      prevSelectedBookName: prevState.selectedBookName,
      prevStateTotalChapters: prevState.totalChapters,
    };
  }
  onNumPress = (item, index) => {
    var chapterNum = item == null ? this.state.selectedChapterNumber : item;
    let selectedChapter =
      chapterNum > this.state.totalChapters ? "1" : chapterNum;
    if (this.props.route.params) {
      console.log(this.props.route.params.selectedBookId, "onNum");
      this.props.navigation.navigate("Verses", {
        selectedBookId: this.state.selectedBookId,
        selectedBookName: this.state.selectedBookName,
        selectedChapterNumber: selectedChapter,
        totalChapters: this.state.totalChapters,
      });
    }
  };
  onBack = () => {
    // this.props.updateVersionBook({
    //   bookId: this.state.prevSelectedBookId,
    //   bookName: this.state.prevSelectedBookName,
    //   chapterNumber: this.props.route.params.selectedChapterNumber,
    //   totalChapters: this.state.prevStateTotalChapters,
    // });
    this.props.navigation.navigate("Bible");
  };
  render() {
    console.log(
      this.state.prevSelectedBookId,
      this.state.prevSelectedBookName,
      this.props.route.params.selectedChapterNumber,
      "prevselectedid"
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
          // onPress={() =>
          //   this.props.route.params.updateSelectedChapter(
          //     this.props.route.params.selectedChapterNumber,
          //     this.props.route.params.selectedChapterIndex
          //   )
          // }
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
