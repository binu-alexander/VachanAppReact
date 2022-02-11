import React from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Color from "../../utils/colorConstants";
import SelectContent from "./SelectContent";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Permission from "../../utils/constants";
import { connect } from "react-redux";
import { AndroidPermission } from "../../utils/UtilFunctions";
import {  Toast } from "native-base";
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
  })
  const navigateToVideo=()=>{
    props.navigation.navigate("Video", {
      bookId: props.bookId,
      bookName: props.bookName,
    });
  }
  const navigateToImage = () => {
    // setStatus(false);
    props.navigation.navigate("Infographics", {
      bookId: props.bookId,
      bookName: props.bookName,
    });
  };
  const navigateToSettings = () => {
    // setStatus(false);
    props.navigation.navigate("Settings");
  };
  const downloadPDF = async () => {
    // setIsLoading(true);
    var texttohtml = "";
    props.chapterContent.forEach((val) => {
      if (val.verseNumber != undefined && val.verseText != undefined) {
        texttohtml += `<p>${val.verseNumber} : ${val.verseText}</p>`;
      }
    })
    let header1 = `<h1>${props.language + " " + props.versionCode}</h1>`;
    let header3 = `<h3>${props.bookName + " " + props.chapterNumber}</h3>`;
    let options = {
      html: `${header1}${header3}<p>${texttohtml}</p>`,
      fileName: `${
        "VachanGo_" +
        props.language +
        "_" +
        props.bookId +
        "_" +
        props.chapterNumber
      }`,
      // eslint-disable-next-line no-constant-condition
      directory: "Download" ? "Download" : "Downloads",
    };
    await RNHTMLtoPDF.convert(options);
    Toast.show({ text: "Pdf downloaded.", type: "success", duration: 5000 });
    // setIsLoading(false);
  
  };
  const createPDF = async () => {
    let permissionGranted = await AndroidPermission(
      Permission.PermissionTypes.WRITE_EXTERNAL_STORAGE
    );
    if (permissionGranted) {
      Alert.alert("", "Do you want to download the pdf for current chapter", [
        {
          text: "No",
          onPress: () => {
            return;
          },
        },
        { text: "Yes", onPress: () => downloadPDF() },
      ]);
    } else {
      return;
    }
  }
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
          onPress={navigateToVideo}
          style={navStyles.touchableStyleRight}
        >
          <Icon name="videocam" size={24} color={Color.White} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={navigateToImage}
          style={navStyles.touchableStyleRight}
        >
          <Icon name="image" size={24} color={Color.White} />
        </TouchableOpacity>
        <TouchableOpacity style={navStyles.touchableStyleRight}>
          <Icon
            onPress={()=>{props.navigation.navigate("Search")}}
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
            onPress={navigateToSettings}
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
        <TouchableOpacity style={navStyles.printView} onPress={createPDF}>
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
const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,

    chapterNumber: state.updateVersion.chapterNumber,
    totalChapters: state.updateVersion.totalChapters,
    bookName: state.updateVersion.bookName,
    bookId: state.updateVersion.bookId,

  };
};


export default connect(mapStateToProps)(CustomHeader);
