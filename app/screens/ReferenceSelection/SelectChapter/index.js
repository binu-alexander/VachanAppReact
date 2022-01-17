import React from "react";
import { View } from "react-native";

import SelectionGrid from "../../../components/SelectionGrid/";
import { styles } from "./styles.js";
import { connect } from "react-redux";
import { Icon } from "native-base";
import { updateVersionBook } from "../../../store/action";

const ChapterSelection = (props) => {
  const state = {
    chapterData: Array.from(
      new Array(props.route.params ? props.route.params.totalChapters : 0),
      (x, i) => i + 1
    ),
    totalChapters: props.route.params ? props.route.params.totalChapters : null,
    selectedBookId: props.route.params
      ? props.route.params.selectedBookId
      : null,
    selectedBookName: props.route.params
      ? props.route.params.selectedBookName
      : null,
    selectedChap: props.route.params
      ? props.route.params.selectedChapterNumber
      : null,
    prevSelectChap: props.route.params
      ? props.route.params.selectedChapterNumber
      : null,
  };
  const style = styles(props.colorFile, props.sizeFile);
  const onNumPress = (item) => {
    var chapterNum = item == null ? state.selectedChapterNumber : item;
    let selectedChapter = chapterNum > state.totalChapters ? "1" : chapterNum;
    if (props.route.params) {
      props.navigation.navigate("Verses", {
        selectedBookId: state.selectedBookId,
        selectedBookName: state.selectedBookName,
        selectedChapterNumber: selectedChapter,
        totalChapters: state.totalChapters,
      });
    }
  };
  const onBack = () => {
    if (props.route.params) {
      props.updateVersionBook({
        bookId: props.route.params.selectedBookId,
        bookName: props.route.params.selectedBookName,
        chapterNumber: state.prevSelectChap,
      });
      props.navigation.navigate("Bible");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SelectionGrid
        styles={style}
        onNumPress={(item, index) => {
          onNumPress(item, index);
        }}
        numbers={state.chapterData}
        selectedNumber={props.route.params.selectedChapterNumber}
        blueText={props.colorFile.blueText}
        textColor={props.colorFile.textColor}
      />
      <Icon
        type="AntDesign"
        name="back"
        onPress={onBack}
        size={64}
        style={style.chapterIconPos}
      />
    </View>
  );
};
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