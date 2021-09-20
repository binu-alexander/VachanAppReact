import { Text, View } from "native-base";
import React, { Component } from "react";
import { connect } from "react-redux";
import SelectionGrid from "../../../components/SelectionGrid";
import vApi from "../../../utils/APIFetch";
import { verseSelection } from "./styles";

class SelectVerse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versesData: [],
      selectedBookId: this.props.route.params
        ? this.props.route.params.selectedBookId
        : null,
      selectedBookName: this.props.route.params
        ? this.props.route.params.selectedBookName
        : null,

      selectedChapterNumber: this.props.route.params
        ? this.props.route.params.selectedChapterNumber
        : null,
      totalChapters: this.props.route.params
        ? this.props.route.params.totalChapters
        : null,
    };
    this.styles = verseSelection(this.props.colorFile, this, props.sizeFile);
  }

  async fectchVerses() {
    let versesArray = [];
    const url =
      "bibles/" +
      this.props.sourceId +
      "/books/" +
      this.props.route.params.selectedBookId +
      "/chapters/" +
      this.props.route.params.selectedChapterNumber +
      "/verses";
    let verses = await vApi.get(url);
    if (verses) {
      verses.map((item) => versesArray.push(item.verse.number));
    }
    this.setState({ versesData: versesArray });
  }
  componentDidMount() {
    this.fectchVerses();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      selectedChapterNumber: nextProps.route.params
        ? nextProps.route.params.selectedChapterNumber
        : null,
      totalChapters: nextProps.route.params
        ? nextProps.route.params.totalChapters
        : null,
      selectedBookName: nextProps.route.params
        ? nextProps.route.params.selectedBookName
        : null,
      selectedBookId: nextProps.route.params
        ? nextProps.route.params.selectedBookId
        : null,
    };
  }

  onNumPress = (item, index) => {
    if (this.props.route.params) {
      this.props.route.params.getReference({
        bookId: this.state.selectedBookId,
        bookName: this.state.selectedBookName,
        chapterNumber: this.state.selectedChapterNumber,
        totalChapters: this.state.totalChapters,
        selectedVerse: item ? item : 0,
      });
      this.props.navigation.navigate("Bible");
    }
  };
  render() {
    console.log(
      this.props.route.params.selectedBookName,
      this.state.selectedChapterNumber,
      "number"
    );
    return (
      <View style={{ flex: 1 }}>
        <SelectionGrid
          styles={this.styles}
          onNumPress={(item, index) => {
            this.onNumPress(item, index);
          }}
          numbers={this.state.versesData}
          selectedChapterNumber={this.props.route.params.selectedChapterNumber}
          blueText={this.props.colorFile.blueText}
          textColor={this.props.colorFile.textColor}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    sourceId: state.updateVersion.sourceId,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(SelectVerse);
