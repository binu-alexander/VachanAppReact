import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import {
  vachanAPIFetch,
  fetchVersionBooks,
  selectContent,
} from "../../../store/action/index";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import Color from "../../../utils/colorConstants";
import ReloadButton from "../../../components/ReloadButton";
import HTML from "react-native-render-html";
import vApi from "../../../utils/APIFetch";
import securityVaraibles from "../../../../securityVaraibles";
import SelectContent from "../../../components/Bible/SelectContent";
import constants from "../../../utils/constants";
import ModalDropdown from "react-native-modal-dropdown";
import { getBookChaptersFromMapping } from "../../../utils/UtilFunctions";

const commentaryKey = securityVaraibles.COMMENTARY_KEY
  ? "?key=" + securityVaraibles.COMMENTARY_KEY
  : "";

const DrawerCommentary = (props) => {
  // const [commentary, setCommentary] = useState([]);
  const [totalChapters, setTotalChapters] = useState(
    Array.from(new Array(getBookChaptersFromMapping(props.bookId)), (x, i) =>
      (i + 1).toString()
    )
  );
  const [chapterNumber, setChapterNumber] = useState(props.chapterNumber);
  const [error, setError] = useState(null);
  const [bookName, setBookName] = useState(props.bookName);
  const [bookId, setBookId] = useState(props.bookId);
  const [bookNameList, setBookNameList] = useState([]);
  const [dropDownList, setDropDownList] = useState([]);
  const [bookResponse, setBookResponse] = useState([]);
  const [parallelMetaData, setParallelMetaData] = useState(
    props.parallelMetaData
  );
  const [parallelLanguage, setParallelLanguage] = useState( props.parallelLanguage);
  const [selectedBookIndex, setSelectedBookIndex] = useState(-1);
  const [selectedBook, setSelectedBook] = useState(props.bookName);
  const prevParallelLanguage = useRef(props.parallelLanguage).current;
  const prevDropDownList = useRef(dropDownList).current;
  let _dropdown_1;
  let _dropdown_2;

  const style = styles(props.colorFile, props.sizeFile);
  let alertPresent = false;

  const fetchBookName = async () => {
    try {
      const response = await vApi.get("booknames")
      setBookResponse(response)
      updateBookName(response)
    } catch (error) {
      setError(error)
      setBookNameList([]);
      setBookResponse([]);
    }
  };
  const updateBookName = (bookRes) => {
    let res = bookRes == null ? bookResponse : bookRes
    if (res.length > 0) {
      let bookNameLists = [];
      let dropDownLists = [];
      if (res) {
        for (let i = 0; i <= res.length - 1; i++) {
          let parallelLanguages = parallelLanguage.languageName.toLowerCase();
          if (res[i].language.name === parallelLanguages) {
            let bookLists = res[i].bookNames.sort(function (a, b) {
              return a.book_id - b.book_id;
            });
            for (let j = 0; j <= bookLists.length - 1; j++) {
              let bId = bookLists[j].book_code;
              let bName = bookLists[j].short;
              let bNumber = bookLists[j].book_id;
              if (bId == bookId) {
                setBookName(bName);
                setBookId(bId);
              }
              bookNameLists.push({
                bookName: bName,
                bookId: bId,
                bookNumber: bNumber,
              });
              dropDownLists.push(bName);
            }
          }
        }
        console.log(bookNameLists, dropDownLists, "update");
        setBookNameList(bookNameLists);
        setDropDownList(dropDownLists);
      } else {
        return;
      }
    }
  };

  // console.log(dropDownList, "drop");
  const onSelectBook = (index, val) => {
    let bookId = null;
    bookNameList.forEach((item) => {
      if (item.bookName == val) {
        bookId = item.bookId;
      }
    });
    setBookId(bookId);
    setTotalChapters(
      Array.from(new Array(getBookChaptersFromMapping(bookId)), (x, i) =>
        (i + 1).toString()
      )
    );
    let selectedNumber =
      totalChapters.length < chapterNumber ? "1" : chapterNumber;
    _dropdown_2.select(parseInt(selectedNumber) - 1);
    setChapterNumber(selectedNumber);
    setSelectedBookIndex(index);
    setSelectedBook(val);
    setBookName(val);
    commentaryUpdate();
  };
  const onSelectChapter = (index, value) => {
    setChapterNumber(parseInt(value));
    commentaryUpdate();
  };
  const commentaryUpdate = () => {
    let url =
      "commentaries/" +
      parallelLanguage.sourceId +
      "/" +
      bookId +
      "/" +
      chapterNumber +
      commentaryKey;
    props.vachanAPIFetch(url);
  };

  const fetchCommentary = () => {
    let commentary = [];
    props.availableContents.forEach((element) => {
      if (element.contentType == "commentary") {
        element.content.forEach((lang) => {
          if (lang.languageName == props.language) {
            commentary = lang;
          }
        });
      }
    });
    if (Object.keys(commentary).length > 0) {
      setParallelMetaData(commentary.versionModels[0].metaData[0]);
      setParallelLanguage({
        languageName: commentary.languageName,
        versionCode: commentary.versionModels[0].versionCode,
        sourceId: commentary.versionModels[0].sourceId,
      });
      commentaryUpdate();
      props.selectContent({
        parallelLanguage: parallelLanguage,
        parallelMetaData: parallelMetaData,
      });
    } else {
      setParallelMetaData(constants.defaultCommentaryMd);
      setParallelLanguage(constants.defaultCommentary);
      commentaryUpdate();
      props.selectContent({
        parallelLanguage: constants.defaultCommentary,
        parallelMetaData: constants.defaultCommentaryMd,
      });
    }
  };
  const errorMessage = () => {
    if (!alertPresent) {
      alertPresent = true;
      if (props.error || error) {
        Alert.alert(
          "",
          "Check your internet connection",
          [
            {
              text: "OK",
              onPress: () => {
                alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
        if (props.parallelLanguage) {
          commentaryUpdate();
        }
      } else {
        alertPresent = false;
      }
    }
  };
  const updateData = () => {
    errorMessage();
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        {item.verse &&
          (item.verse == 0 ? (
            <Text style={style.commentaryHeading}>Chapter Intro</Text>
          ) : (
            <Text style={style.commentaryHeading}>
              Verse Number : {item.verse}
            </Text>
          ))}
        <HTML
          baseFontStyle={style.textString}
          tagsStyles={{ p: style.textString }}
          html={item.text}
        />
      </View>
    );
  };

  const ListHeaderComponent = () => {
    return (
      <View>
        {props.commentaryContent && props.commentaryContent.bookIntro ? (
          <View style={style.cardItemBackground}>
            <Text style={style.commentaryHeading}>Book Intro</Text>
            <HTML
              baseFontStyle={style.textString}
              tagsStyles={{ p: style.textString }}
              html={
                props.commentaryContent && props.commentaryContent.bookIntro
              }
            />
          </View>
        ) : null}
      </View>
    );
  };

  const renderFooter = () => {
    var metadata = parallelMetaData;
    return (
      <View style={{ paddingVertical: 20 }}>
        {props.commentaryContent &&
          props.commentaryContent.commentaries &&
          props.parallelMetaData && (
            <View style={style.centerContainer}>
              {metadata?.revision !== null && metadata?.revision !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metaDataText}>
                  <Text>Copyright:</Text> {metadata?.revision}
                </Text>
              )}
              {metadata?.copyrightHolder !== null &&
                metadata?.copyrightHolder !== "" && (
                  <Text textBreakStrategy={"simple"} style={style.metaDataText}>
                    <Text>License:</Text> {metadata?.copyrightHolder}
                  </Text>
                )}
              {metadata?.license !== null && metadata?.license !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metaDataText}>
                  <Text>Technology partner:</Text> {metadata?.license}
                </Text>
              )}
            </View>
          )}
      </View>
    );
  };
  useEffect(() => {
    fetchBookName()
    fetchCommentary()
    props.navigation.setOptions({
      // headerTitle: () => <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>Commentary</Text>,
      headerRight: () => (
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <SelectContent
            navigation={props.navigation}
            navStyles={navStyles}
            iconName={"arrow-drop-down"}
            title={parallelLanguage.languageName}
            displayContent="commentary"
          />
        </View>
      ),
    });
  },[])
  useEffect(() => {
      setParallelLanguage(props.parallelLanguage)
      setParallelMetaData(props.parallelMetaData)
      props.navigation.setOptions({
        headerRight: () => (
          <View style={style.headerView}>
            <SelectContent
              navigation={props.navigation}
              navStyles={navStyles}
              iconName={"arrow-drop-down"}
              title={props.parallelLanguage.languageName}
              displayContent="commentary"
            />
          </View>
        ),
      })
  }, [parallelLanguage.sourceId,parallelLanguage.languageName,props.parallelLanguage.languageName,props.parallelLanguage.sourceId])
useEffect(()=>{
  commentaryUpdate()
  updateBookName()
},[JSON.stringify(props.commentaryContent),parallelLanguage.sourceId,chapterNumber,bookId])
  useEffect(()=>{
  if (selectedBookIndex == -1) {
    dropDownList.forEach((b, index) => {
      if (bookName == b) {
        console.log("BOOK NAME ", b);
        onSelectBook(index, b);
        // this._dropdown_1.select(index)
      }
    });
  } else {
    _dropdown_1.select(selectedBookIndex);
  }
},[JSON.stringify(dropDownList),selectedBookIndex])

  return (
    <View style={style.container}>
      {props.error ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ReloadButton
            styles={style}
            reloadFunction={updateData}
            message={null}
          />
        </View>
      ) : props.parallelLanguage == undefined ? null : (
        <View style={{ flex: 1 }}>
          <View style={style.dropdownPosition}>
            <TouchableOpacity
              onPress={() => {
                _dropdown_1 && _dropdown_1.show();
              }}
              style={style.dropdownView}
            >
              <ModalDropdown
                ref={(el) => (_dropdown_1 = el)}
                options={dropDownList}
                onSelect={onSelectBook}
                style={{ paddingRight: 20 }}
                defaultValue={bookName}
                isFullWidth={true}
                dropdownStyle={style.dropdownSize}
                dropdownTextStyle={{ fontSize: 18 }}
                textStyle={style.dropdownText}
              />
              <Icon
                name="arrow-drop-down"
                color={props.colorFile.iconColor}
                size={20}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                _dropdown_2 && _dropdown_2.show();
              }}
              style={style.dropdownView}
            >
              <ModalDropdown
                ref={(el) => (_dropdown_2 = el)}
                options={totalChapters}
                onSelect={onSelectChapter}
                defaultValue={chapterNumber}
                isFullWidth={true}
                dropdownStyle={style.dropdownSize}
                dropdownTextStyle={{ fontSize: 18 }}
                textStyle={style.dropdownText}
              />
              <Icon
                name="arrow-drop-down"
                color={props.colorFile.iconColor}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={
              props.commentaryContent && props.commentaryContent.commentaries
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, margin: 16 }}
            renderItem={renderItem}
            // ListFooterComponent={<View style={this.styles.listFooter}></View>}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={renderFooter}
          />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    availableContents: state.contents.contentLanguages,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    contentType: state.updateVersion.contentType,
    chapterNumber: state.updateVersion.chapterNumber,
    books: state.versionFetch.versionBooks,
    commentaryContent: state.vachanAPIFetch.apiData,
    error: state.vachanAPIFetch.error,
    baseAPI: state.updateVersion.baseAPI,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
    parallelContentType: state.updateVersion.parallelContentType,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    vachanAPIFetch: (payload) => dispatch(vachanAPIFetch(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    selectContent: (payload) => dispatch(selectContent(payload)),
  };
};

const navStyles = StyleSheet.create({
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
export default connect(mapStateToProps, mapDispatchToProps)(DrawerCommentary);