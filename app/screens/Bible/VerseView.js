import React, { useState } from "react";
import { Text, Alert } from "react-native";
import { connect } from "react-redux";
import { selectContent, parallelVisibleView } from "../../store/action/";
import { getResultText } from "../../utils/UtilFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Color from "../../utils/colorConstants";

const VerseView = (props) => {
  const [unableSelection, setUnableSelection] = useState(false);
  const onPress = () => {
    let verseNumber = props.downloaded
      ? props.verseData.number
      : props.verseData.verseNumber;
    let verseText = props.downloaded
      ? props.verseData.text
      : props.verseData.verseText;
    props.getSelection(
      props.index,
      props.chapterNumber,
      verseNumber,
      verseText
    );
    setUnableSelection(false);
  };

  const has = (selectedReferences, obj) => {
    for (var i = 0; i < selectedReferences.length; i++) {
      if (selectedReferences[i] == obj) {
        if (props.visibleParallelView) {
          props.parallelVisibleView({
            modalVisible: false,
            visibleParallelView: false,
          });
          Alert.alert(
            "",
            "Your text is selected, please choose any option from the bottom bar or unselect the text."
          );
        }
        return true;
      }
    }
    return false;
  };
  const getColor = (colorConst) => {
    let value = Color.highlightColorA.const;
    switch (colorConst) {
      case Color.highlightColorA.const:
        // code
        value = Color.highlightColorA.code;
        break;
      case Color.highlightColorB.const:
        // code
        value = Color.highlightColorB.code;
        break;
      case Color.highlightColorC.const:
        // code
        value = Color.highlightColorC.code;
        break;
      case Color.highlightColorD.const:
        // code
        value = Color.highlightColorD.code;
        break;
      case Color.highlightColorE.const:
        // code
        value = Color.highlightColorE.code;
        break;
      default:
        value = Color.highlightColorA.code;
      // code
    }
    return value;
  };
  const isHighlight = () => {
    let verseNumber = props.downloaded
      ? props.verseData.number
      : props.verseData.verseNumber;
    for (var i = 0; i <= props.HighlightedVerse.length; i++) {
      if (props.HighlightedVerse[i]) {
        let regexMatch = /(\d+):([a-zA-Z]+)/;
        let match = props.HighlightedVerse[i].match(regexMatch);
        if (match) {
          if (parseInt(match[1]) == verseNumber) {
            return getColor(match[2]);
          }
        }
      }
    }
    return false;
  };
  const isNoted = () => {
    var arr = [];
    for (var i = 0; i <= props.notesList.length - 1; i++) {
      for (var j = 0; j <= props.notesList[i].verses.length - 1; j++) {
        var index = arr.indexOf(props.notesList[i].verses[j]);
        if (index == -1) {
          arr.push(props.notesList[i].verses[j]);
        }
      }
    }
    let verseNumber = props.downloaded
      ? props.verseData.number
      : props.verseData.verseNumber;
    var value = arr.filter((v) => v == verseNumber);
    if (value[0]) {
      return true;
    } else {
      return false;
    }
  };
  const goToNote = (verse_num) => {
    props.navigation.navigate("Notes", {
      chapterNumber: props.chapterNumber,
      bookId: props.bookId,
      verseNumber: verse_num,
    });
  };

  let verseNumber = props.downloaded
    ? props.verseData.number
    : props.verseData.verseNumber;
  let verseText = props.downloaded
    ? props.verseData.text
    : props.verseData.verseText;
  let sectionHeading = props.downloaded
    ? props.verseData.section
    : props.sectionHeading;
  let obj =
    props.chapterNumber +
    "_" +
    props.index +
    "_" +
    verseNumber +
    "_" +
    verseText;
  let isSelect = has(props.selectedReferences, obj);
  let isHighlights = isHighlight();
  let isNote = isNoted();
  if (verseNumber == 1 && typeof verseNumber != "undefined") {
    return (
      <Text
        style={props.styles.textStyle}
        onLayout={(event) => props.onLayout(event, props.index, verseNumber)}
        // onLayout={(event) => console.log(event, "event verse")}
      >
        {props.chapterHeader ? (
          <Text style={props.styles.sectionHeading}>
            {props.chapterHeader} {"\n"}
          </Text>
        ) : null}

        <Text
          onPress={() => {
            onPress();
          }}
        >
          <Text style={props.styles.verseChapterNumber}>
            {props.chapterNumber}{" "}
          </Text>
          <Text
            style={[
              props.styles.textHighlight,
              isSelect && isHighlights
                ? {
                    backgroundColor: isHighlights,
                    textDecorationLine: "underline",
                  }
                : !isSelect && !isHighlights
                ? props.styles.textHighlight
                : !isSelect && isHighlights
                ? { backgroundColor: isHighlights }
                : { textDecorationLine: "underline" },
            ]}
          >
            {getResultText(verseText)}
          </Text>
          {isNote ? (
            <Icon
              onPress={() => goToNote(verseNumber)}
              name="note-outline"
              size={20}
              style={{ padding: 8 }}
            />
          ) : null}
        </Text>
        {sectionHeading ? (
          <Text style={props.styles.sectionHeading}>
            {"\n"} {sectionHeading}
          </Text>
        ) : null}
      </Text>
    );
  } else if (typeof verseText != "undefined") {
    return (
      <Text
        textBreakStrategy={"simple"}
        style={props.styles.textStyle}
        onPress={() => {
          onPress();
        }}
        onLayout={(event) => props.onLayout(event, props.index, verseNumber)}
      >
        <Text textBreakStrategy={"simple"}>
          <Text textBreakStrategy={"simple"} style={props.styles.verseNumber}>
            {verseNumber}{" "}
          </Text>
          <Text
            textBreakStrategy={"simple"}
            style={[
              props.styles.textHighlight,
              isSelect && isHighlights
                ? {
                    backgroundColor: isHighlights,
                    textDecorationLine: "underline",
                  }
                : !isSelect && !isHighlights
                ? props.styles.textHighlight
                : !isSelect && isHighlights
                ? { backgroundColor: isHighlights }
                : { textDecorationLine: "underline" },
            ]}
          >
            {getResultText(verseText)}
          </Text>
          {isNote ? (
            <Icon
              onPress={() => goToNote(verseNumber)}
              name="note-outline"
              size={20}
              style={{ padding: 8 }}
            />
          ) : null}
        </Text>
        {sectionHeading ? (
          <Text
            textBreakStrategy={"simple"}
            style={props.styles.sectionHeading}
          >
            {"\n"} {sectionHeading}
          </Text>
        ) : null}
      </Text>
    );
  } else {
    return null;
  }
};
const mapStateToProps = (state) => {
  return {
    bookId: state.updateVersion.bookId,
    sourceId: state.updateVersion.sourceId,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    visibleParallelView: state.selectContent.visibleParallelView,
    downloaded: state.updateVersion.downloaded,
    selectedVerse: state.updateVersion.selectedVerse,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    selectContent: (payload) => dispatch(selectContent(payload)),
    parallelVisibleView: (payload) => dispatch(parallelVisibleView(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerseView);
