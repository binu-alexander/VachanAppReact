import React, { Component } from "react";
import { View } from "react-native";

import SelectionGrid from "../../../components/SelectionGrid/";
import { numberSelection } from "./styles.js";
import { connect } from "react-redux";
import { Icon } from "native-base";

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
      selectedBookId: this.props.route.params
        ? this.props.route.params.selectedBookId
        : null,
      selectedBookName: this.props.route.params
        ? this.props.route.params.selectedBookName
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
      selectedBookId: nextProps.route.params
        ? nextProps.route.params.selectedBookId
        : null,
      selectedBookName: nextProps.route.params
        ? nextProps.route.params.selectedBookName
        : null,
    };
  }
  onNumPress = (item, index) => {
    var chapterNum = item == null ? this.state.selectedChapterNumber : item;
    if (this.props.route.params) {
      this.props.route.params.getReference({
        bookId: this.state.selectedBookId,
        bookName: this.state.selectedBookName,
        chapterNumber: chapterNum > this.state.totalChapters ? "1" : chapterNum,
        totalChapters: this.state.totalChapters,
      });
      this.props.navigation.navigate("Bible");
    }
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <SelectionGrid
          styles={this.styles}
          onNumPress={(item, index) => {
            this.onNumPress(item, index);
          }}
          numbers={this.state.chapterData}
          selectedChapterNumber={this.props.route.params.selectedChapterNumber}
          blueText={this.props.colorFile.blueText}
          textColor={this.props.colorFile.textColor}
        />
        <Icon
          type="AntDesign"
          name="back"
          onPress={() =>
            this.props.route.params.updateSelectedChapter(
              this.props.route.params.selectedChapterNumber,
              this.props.route.params.selectedChapterIndex
            )
          }
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
export default connect(mapStateToProps, null)(ChapterSelection);
