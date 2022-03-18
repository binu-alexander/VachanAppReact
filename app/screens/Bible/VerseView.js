import React, { useEffect, useState, useRef, useContext } from "react";
import { Text, Alert } from "react-native";
import { connect } from "react-redux";
import { selectContent, parallelVisibleView } from "../../store/action/";
import { getResultText } from "../../utils/UtilFunctions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Color from "../../utils/colorConstants";
import { LoginData } from "../../context/LoginDataProvider";
const VerseView = (props) => {
  const {
    currentVisibleChapter,
    selectedReferenceSet,
    notesList,
    highlightedVerseArray,
  } = useContext(LoginData);
  const {
    downloaded,
    verseData,
    index,
    visibleParallelView,
    bookId,
    styles,
    chapterHeader,
  } = props;
  let verseNumber = downloaded ? verseData.number : verseData.verseNumber;
  let verseText = downloaded ? verseData.text : verseData.verseText;
  let sectionHeading = downloaded ? verseData.section : props.sectionHeading;
  let obj =
    currentVisibleChapter + "_" + index + "_" + verseNumber + "_" + verseText;
  const onPress = () => {
    let verseNumber = downloaded ? verseData.number : verseData.verseNumber;
    let verseText = downloaded ? verseData.text : verseData.verseText;
    props.getSelection(index, currentVisibleChapter, verseNumber, verseText);
  };

  const isSelect = () => {
    for (var i = 0; i < selectedReferenceSet.length; i++) {
      if (selectedReferenceSet[i] == obj) {
        if (visibleParallelView) {
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

  const isHighlight = () => {
    let verseNumber = downloaded ? verseData.number : verseData.verseNumber;
    for (var i = 0; i <= highlightedVerseArray.length; i++) {
      if (highlightedVerseArray[i]) {
        let regexMatch = /(\d+):([a-zA-Z]+)/;
        let match = highlightedVerseArray[i].match(regexMatch);
        if (match) {
          if (parseInt(match[1]) == verseNumber) {
            return getColor(match[2]);
          }
        }
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
  const isNoted = () => {
    var arr = [];
    for (var i = 0; i <= notesList.length - 1; i++) {
      for (var j = 0; j <= notesList[i].verses.length - 1; j++) {
        var index = arr.indexOf(notesList[i].verses[j]);
        if (index == -1) {
          arr.push(notesList[i].verses[j]);
        }
      }
    }
    let verseNumber = downloaded ? verseData.number : verseData.verseNumber;
    var value = arr.filter((v) => v == verseNumber);
    if (value[0]) {
      return true;
    } else {
      return false;
    }
  };

  const goToNote = (verse_num) => {
    props.navigation.navigate("Notes", {
      chapterNumber: currentVisibleChapter,
      bookId: bookId,
      verseNumber: verse_num,
    });
  };

  if (verseNumber == 1 && typeof verseNumber != "undefined") {
    return (
      <Text
        style={styles.textStyle}
        // onLayout={(event) => props.onLayout(event, index, verseNumber)}
        // onLayout={(event) => console.log(event, "event verse")}
      >
        {chapterHeader ? (
          <Text style={styles.sectionHeading}>
            {chapterHeader} {"\n"}
          </Text>
        ) : null}

        <Text onPress={onPress}>
          <Text style={styles.verseChapterNumber}>
            {currentVisibleChapter}{" "}
          </Text>
          <Text
            style={[
              styles.textHighlight,
              isSelect() && isHighlight()
                ? {
                    backgroundColor: isHighlight(),
                    textDecorationLine: "underline",
                  }
                : !isSelect() && !isHighlight()
                ? styles.textHighlight
                : !isSelect() && isHighlight()
                ? { backgroundColor: isHighlight() }
                : { textDecorationLine: "underline" },
            ]}
          >
            {getResultText(verseText)}
          </Text>
          {isNoted() ? (
            <Icon
              onPress={() => goToNote(verseNumber)}
              name="note-outline"
              size={20}
              style={{ padding: 8 }}
            />
          ) : null}
        </Text>
        {sectionHeading ? (
          <Text style={styles.sectionHeading}>
            {"\n"} {sectionHeading}
          </Text>
        ) : null}
      </Text>
    );
  } else if (typeof verseText != "undefined") {
    return (
      <Text
        textBreakStrategy={"simple"}
        style={styles.textStyle}
        onPress={onPress}
        // onLayout={(event) => props.onLayout(event, index, verseNumber)}
      >
        <Text textBreakStrategy={"simple"}>
          <Text textBreakStrategy={"simple"} style={styles.verseNumber}>
            {verseNumber}{" "}
          </Text>
          <Text
            textBreakStrategy={"simple"}
            style={[
              styles.textHighlight,
              isSelect() && isHighlight()
                ? {
                    backgroundColor: isHighlight(),
                    textDecorationLine: "underline",
                  }
                : !isSelect() && !isHighlight()
                ? styles.textHighlight
                : !isSelect() && isHighlight()
                ? { backgroundColor: isHighlight() }
                : { textDecorationLine: "underline" },
            ]}
          >
            {getResultText(verseText)}
          </Text>
          {isNoted() ? (
            <Icon
              onPress={() => goToNote(verseNumber)}
              name="note-outline"
              size={20}
              style={{ padding: 8 }}
            />
          ) : null}
        </Text>
        {sectionHeading ? (
          <Text textBreakStrategy={"simple"} style={styles.sectionHeading}>
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
