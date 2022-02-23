import React, { useState, useEffect, useContext, useRef } from "react";
import { FlatList, Animated, View, Text } from "react-native";
import { createResponder } from "react-native-gesture-responder";
import VerseView from "./VerseView";
import { getHeading } from "../../utils/UtilFunctions";
import { BibleMainContext } from ".";
import { connect } from "react-redux";
import { LoginData } from "../../contextProvider/GetLoginData";
import { changeSizeOnPinch } from "../../utils/BiblePageUtil";
const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
const AnimatedVerseList = (props) => {
  const arrLayout = [];

  let _offsetValue = 0;
  let _scrollValue = 0;
  let gestureResponder, _scrollEndTimer;
  const [{
    chapterContent,
    styles,
    navigation,
    _clampedScrollValue,
    scrollAnim,
    offsetAnim,
    chapterHeader,
  },
  ] = useContext(BibleMainContext);
  const {

    showColorGrid,
    getSelectedReferences,
    bottomHighlightText,
  } = useContext(LoginData);

  const onLayout = (event, index, verseNumber) => {
    arrLayout[index] = {
      height: event.nativeEvent.layout.height,
      verseNumber,
      index,
    };
  };
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
    _scrollEndTimer = setTimeout(_onMomentumScrollEnd(), 250);
  };
  const _onMomentumScrollBegin = () => {
    clearTimeout(_scrollEndTimer);
  };
  changeSizeByOne = (value) => {
    changeSizeOnPinch(value, props.updateFontSize, props.colorFile, styles);
  };
  const ZoomTextSize = () => {
    (gestureResponder = React.useRef(
      createResponder({
        onStartShouldSetResponder: () => true,
        onStartShouldSetResponderCapture: () => true,
        onMoveShouldSetResponder: () => true,
        onMoveShouldSetResponderCapture: () => true,
        onResponderGrant: () => { },
        onResponderMove: (evt, gestureState) => {
          let thumbSize = 10;
          if (gestureState.pinch && gestureState.previousPinch) {
            thumbSize *= gestureState.pinch / gestureState.previousPinch;
            let currentDate = new Date().getTime();
            var pinchTime = new Date().getTime();
            let diff = currentDate - pinchTime;
            var pinchDiff = null;
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
          left += gestureState.moveX - gestureState.previousMoveX;
          top += gestureState.moveY - gestureState.previousMoveY;

          position.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onResponderTerminationRequest: () => true,
        onResponderRelease: (gestureState) => { },
        onResponderTerminate: (gestureState) => { },
        onResponderSingleTapConfirmed: () => { },
        moveThreshold: 2,
        debug: false,
      })
    ).current),
      [];
  };
  useEffect(() => {
    ZoomTextSize();
  }, []);
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
              {props.revision !== null && props.revision !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={styles.textListFooter}
                >
                  <Text style={styles.footerText}>Copyright:</Text>{" "}
                  {props.revision}
                </Text>
              )}
              {props.license !== null && props.license !== "" && (
                <Text
                  textBreakStrategy={"simple"}
                  style={styles.textListFooter}
                >
                  <Text style={styles.footerText}>License:</Text>{" "}
                  {props.license}
                </Text>
              )}
              {props.technologyPartner !== null &&
                props.technologyPartner !== "" && (
                  <Text
                    textBreakStrategy={"simple"}
                    style={styles.textListFooter}
                  >
                    <Text style={styles.footerText}>Technology partner:</Text>{" "}
                    {props.technologyPartner}
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
      {...gestureResponder}
      data={chapterContent}
      // ref={(ref) => (this.verseScroll = ref)}
      contentContainerStyle={
        chapterContent.length === 0
          ? styles.centerEmptySet
          : {
            paddingHorizontal: 16,
            paddingTop: props.visibleParallelView ? 52 : 90,
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
      renderItem={({ item, index }) => (
        <VerseView
          ref={child => (this[`child_${item.chapterNumber}_${index}`] = child)}
          verseData={item}
          sectionHeading={getHeading(item.contents)}
          chapterHeader={chapterHeader}
          index={index}
          onLayout={onLayout}
          styles={styles}
          getSelection={(verseIndex, chapterNumber, verseNumber, text) => {
            props.visibleParallelView == false &&
              getSelectedReferences(
                verseIndex,
                chapterNumber,
                verseNumber,
                text
              );
          }}
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateFontSize: (payload) => dispatch(updateFontSize(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AnimatedVerseList);
