import React from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Color from "../../utils/colorConstants";
import SelectContent from "./SelectContent";

const NAVBAR_HEIGHT = 80;
// const STATUS_BAR_HEIGHT = Platform.select({ ios: 20, android: 24 });
// const HEADER_MIN_HEIGHT = 0;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const CustomHeader = (props) => {
  // console.log("BOOK NAME ",props.bookName)
  let bookName = !isNaN(props.bookName.charAt(0))
  ? props.bookName.charAt(0).toUpperCase() +
    props.bookName.slice(1)
  : props.bookName;
 
  const navbarTranslate = props.clampedScroll.interpolate({
    inputRange: [0, NAVBAR_HEIGHT],
    outputRange: [0, -NAVBAR_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        navStyles.navbar,
        { transform: [{ translateY: navbarTranslate }] },
      ]}
    >
      <View style={navStyles.headerRightStyle}>
        <TouchableOpacity
          style={navStyles.touchableStyleRight}
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
        >
          <Icon name="menu" color={Color.White} size={28} />
        </TouchableOpacity>
        {props.audio ? (
          <TouchableOpacity
            onPress={props.toggleAudio}
            style={navStyles.touchableStyleRight}
          >
            <Icon name="volume-up" size={28} color={Color.White} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={props.toggleAudio}
            style={navStyles.touchableStyleRight}
          >
            <Icon name="volume-off" size={28} color={Color.White} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={props.navigateToVideo}
          style={navStyles.touchableStyleRight}
        >
          <Icon name="videocam" size={24} color={Color.White} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.navigateToImage}
          style={navStyles.touchableStyleRight}
        >
          <Icon name="image" size={24} color={Color.White} />
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.touchableStyleRight}>
          <Icon
            onPress={props.onSearch}
            name="search"
            color={Color.White}
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.touchableStyleRight}>
          <Icon
            onPress={() => {
              props.onBookmark(props.isBookmark);
            }}
            name="bookmark"
            color={props.isBookmark ? Color.Red : Color.White}
            size={24}
          />
        </TouchableOpacity>
        <SelectContent
          navigation={props.navigation}
          navStyles={navStyles}
          iconName={"auto-stories"}
        />
        <TouchableOpacity style={navStyles.touchableStyleRight}>
          <Icon
            onPress={props.navigateToSettings}
            name="settings"
            color={Color.White}
            size={24}
          />
        </TouchableOpacity>
      </View>
      <Animated.View style={[navStyles.title]}>
        <TouchableOpacity
          style={navStyles.titleTouchable}
          onPress={props.navigateToSelectionTab}
        >
          {bookName && props.chapterNumber ? (
            <Text style={{ fontSize: 18, color: "#fff" }}>
              {bookName.length > 16 ? bookName.slice(0, 15) + "..." : bookName}{" "}
              {props.chapterNumber}
            </Text>
          ) : null}
          <Icon name="arrow-drop-down" color={Color.White} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[navStyles.titleTouchable]}
          onPress={props.navigateToLanguage}
        >
          <Text style={navStyles.langVer}>
            {props.language &&
              props.language.charAt(0).toUpperCase() +
                props.language.slice(1)}{" "}
            {props.versionCode && props.versionCode.toUpperCase()}
          </Text>
          <Icon name="arrow-drop-down" color={Color.White} size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.printView} onPress={props.createPDF}>
          <Icon name="print" color={Color.White} size={28} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const navStyles = StyleSheet.create({
  navbar: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    alignItems: "center",
    // borderBottomColor: '#dedede',
    // borderBottomWidth: 1,
    height: NAVBAR_HEIGHT,
    width: "100%",
    justifyContent: "center",
    // paddingTop: STATUS_BAR_HEIGHT,
  },
  printView: { position: "absolute", right: 0, paddingRight: 8 },
  langVer: { fontSize: 18, color: "#fff" },
  title: {
    color: "#333333",
    flexDirection: "row",
    height: 40,
    // top:0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.Blue_Color,
    zIndex: 0,
    width: "100%",
    // marginBottom:30
  },

  border: {
    paddingHorizontal: 4,
    paddingVertical: 4,

    borderWidth: 0.2,
    borderColor: Color.White,
  },
  headerRightStyle: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: Color.Blue_Color,
  },
  touchableStyleRight: {
    alignSelf: "center",
  },
  titleTouchable: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightdownload: {
    alignSelf: "flex-end",
  },
  touchableStyleLeft: {
    flexDirection: "row",
    marginHorizontal: 8,
  },
  headerTextStyle: {
    fontSize: 18,
    color: Color.White,
    textAlign: "center",
  },
});

export default CustomHeader;
