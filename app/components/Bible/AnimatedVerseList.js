import React, { useEffect, useContext, useState, useMemo, useRef } from "react";
import { FlatList, Animated, View, Text, Platform } from "react-native";
import { createResponder } from "react-native-gesture-responder";
import { updateFontSize } from "../../store/action/";
import VerseView from "../../screens/Bible/VerseView";
import { getHeading } from "../../utils/UtilFunctions";
import { connect } from "react-redux";
import { LoginData } from "../../context/LoginDataProvider";
import { BibleMainContext } from "../../screens/Bible/index";
import { BibleContext } from "../../context/BibleContextProvider";
import {
  extraSmallFont,
  smallFont,
  mediumFont,
  largeFont,
  extraLargeFont,
} from "../../utils/dimens.js";
import { style } from "../../screens/Bible/style";

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
const AnimatedVerseList = (props) => {
  const {
    sizeMode,
    colorFile,
    sizeFile,
    visibleParallelView,
    revision,
    license,
    technologyPartner,
  } = props;
  let _offsetValue = 0;
  let _scrollValue = 0;
  let _scrollEndTimer;
  let styles = style(colorFile, sizeFile);
  const [
    {
      chapterContent,
      navigation,
      _clampedScrollValue,
      scrollAnim,
      offsetAnim,
      chapterHeader,
    },
  ] = useContext(BibleMainContext);
  const {
    currentVisibleChapter,
    selectedReferenceSet,
    notesList,
    highlightedVerseArray,
    showColorGrid,
    getSelectedReferences,
    bottomHighlightText,
  } = useContext(LoginData);
  const { verseScroll, onScrollLayout } = useContext(BibleContext);
  const [gestureVa, setGestureState] = useState("");
  const [left, setLeft] = useState("");
  const [top, setTop] = useState("");
  const [thumbSize, setThumbSize] = useState("");
  let pinchDiff = null;
  let pinchTime = new Date().getTime();

  const _keyExtractor = (item, index) => {
    return index.toString();
  };
  const _onMomentumScrollEnd = () => {
    const toValue =
      _scrollValue > NAVBAR_HEIGHT &&
      _clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
        ? _offsetValue + NAVBAR_HEIGHT
        : _offsetValue - NAVBAR_HEIGHT;

    Animated.timing(offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const _onScrollEndDrag = () => {
    _scrollEndTimer = setTimeout(() => _onMomentumScrollEnd(), 250);
  };
  const _onMomentumScrollBegin = () => {
    clearTimeout(_scrollEndTimer);
  };

  const changeSizeByOne = (value) => {
    switch (sizeMode) {
      case 0: {
        if (value == -1) {
          return;
        } else {
          styles = style(colorFile, smallFont);
          props.updateFontSize(1);
        }
        break;
      }
      case 1: {
        if (value == -1) {
          styles = style(colorFile, extraSmallFont);
          props.updateFontSize(0);
        } else {
          styles = style(colorFile, mediumFont);
          props.updateFontSize(2);
        }
        break;
      }
      case 2: {
        if (value == -1) {
          styles = style(colorFile, smallFont);
          props.updateFontSize(1);
        } else {
          styles = style(colorFile, largeFont);
          props.updateFontSize(3);
        }
        break;
      }
      case 3: {
        if (value == -1) {
          styles = style(colorFile, mediumFont);
          props.updateFontSize(2);
        } else {
          styles = style(colorFile, extraLargeFont);
          props.updateFontSize(4);
        }
        break;
      }
      case 4: {
        if (value == -1) {
          styles = style(colorFile, largeFont);
          props.updateFontSize(3);
        } else {
          return;
        }
        break;
      }
    }
  };
  const gestureResponder = useRef(
    createResponder({
      onStartShouldSetResponder: () => true,
      onStartShouldSetResponderCapture: () => true,
      onMoveShouldSetResponder: () => true,
      onMoveShouldSetResponderCapture: () => true,
      onResponderGrant: () => {},
      onResponderMove: (evt, gestureState) => {
        let thumbS = thumbSize;
        if (gestureState.pinch && gestureState.previousPinch) {
          thumbS *= gestureState.pinch / gestureState.previousPinch;
          let currentDate = new Date().getTime();
          //  pinchTime = new Date().getTime();
          let diff = currentDate - pinchTime;
          pinchDiff = null;
          if (diff > pinchDiff) {
            if (gestureState.pinch - gestureState.previousPinch > 5) {
              // large
              changeSizeByOne(1);
            } else if (gestureState.previousPinch - gestureState.pinch > 5) {
              // small
              changeSizeByOne(-1);
            }
          }
          pinchDiff = diff;
          pinchTime = currentDate;
        }
        let lf = left;
        let tp = top;
        lf += gestureState.moveX - gestureState.previousMoveX;
        tp += gestureState.moveY - gestureState.previousMoveY;
        setGestureState({ ...gestureState });
        setLeft(lf);
        setTop(tp);
        setThumbSize(thumbS);
      },
      onResponderTerminationRequest: () => true,
      onResponderRelease: (gestureState) => {
        setGestureState({ ...gestureState });
      },
      onResponderTerminate: (gestureState) => {},
      onResponderSingleTapConfirmed: () => {},
      moveThreshold: 2,
      debug: false,
    })
  ).current;

  const renderFooter = () => {
    if (chapterContent.length === 0) {
      return null;
    } else {
      return (
        <View
          style={[
            styles.addToSharefooterComponent,
            { marginBottom: showColorGrid && bottomHighlightText ? 32 : 16 },
          ]}
        >
          {
            <View style={styles.footerView}>
              {revision !== null && revision !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={styles.textListFooter}
                >
                  <Text style={styles.footerText}>Copyright:</Text> {revision}
                </Text>
              )}
              {license !== null && license !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={styles.textListFooter}
                >
                  <Text style={styles.footerText}>License:</Text> {license}
                </Text>
              )}
              {technologyPartner !== null && technologyPartner !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={styles.textListFooter}
                >
                  <Text style={styles.footerText}>Technology partner:</Text>{" "}
                  {technologyPartner}
                </Text>
              )}
            </View>
          }
        </View>
      );
    }
  };
  return (
    <AnimatedFlatlist
      data={chapterContent}
      ref={verseScroll}
      contentContainerStyle={
        chapterContent.length === 0
          ? styles.centerEmptySet
          : {
              paddingHorizontal: 16,
              paddingTop: visibleParallelView ? 52 : 90,
              paddingBottom: 90,
            }
      }
      scrollEventThrottle={1}
      onMomentumScrollBegin={_onMomentumScrollBegin}
      onMomentumScrollEnd={_onMomentumScrollEnd}
      onScrollEndDrag={_onScrollEndDrag}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { x: scrollAnim, y: scrollAnim },
            },
          },
        ],
        { useNativeDriver: true }
      )}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...gestureResponder}
      renderItem={({ item, index }) => (
        <VerseView
          // ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
          verseData={item}
          sectionHeading={getHeading(item.contents)}
          chapterHeader={chapterHeader}
          index={index}
          onLayout={onScrollLayout}
          styles={styles}
          selectedReferences={selectedReferenceSet}
          getSelection={(verseIndex, chapterNumber, verseNumber, text) => {
            visibleParallelView == false &&
              getSelectedReferences(
                verseIndex,
                chapterNumber,
                verseNumber,
                text
              );
          }}
          highlightedVerse={highlightedVerseArray}
          notesList={notesList}
          chapterNumber={currentVisibleChapter}
          navigation={navigation}
        />
      )}
      keyExtractor={_keyExtractor}
      ListFooterComponent={renderFooter}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    revision: state.updateVersion.revision,
    license: state.updateVersion.license,
    technologyPartner: state.updateVersion.technologyPartner,
    visibleParallelView: state.selectContent.visibleParallelView,
    colorFile: state.updateStyling.colorFile,
    sizeFile: state.updateStyling.sizeFile,
    sizeMode: state.updateStyling.sizeMode,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateFontSize: (payload) => dispatch(updateFontSize(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AnimatedVerseList);
