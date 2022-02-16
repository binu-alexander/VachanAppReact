import React, { useEffect, useState, useContext } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Spinner from "react-native-loading-spinner-overlay";
import { fetchVersionBooks, selectContent, parallelVisibleView } from "../../store/action";
import { styles } from "./styles";
import { connect } from "react-redux";
import { getResultText } from "../../utils/UtilFunctions";
import { Header, Button, Right, Title } from "native-base";
import Color from "../../utils/colorConstants";
import ReloadButton from "../ReloadButton";
import vApi from "../../utils/APIFetch";
import { getHeading } from "../../utils/UtilFunctions";
import { BibleMainContext } from "../../screens/Bible";
import { LoginData } from "../../context/LoginDataProvider";
const BibleChapter = (props) => {
  const [{ navigation }] = useContext(BibleMainContext);
  const {
    currentVisibleChapter,
  } = useContext(LoginData);

  console.log("current chapter in bible ", currentVisibleChapter)
  const bShortName = props.bookName != null &&
    (props.bookName.length > 10 ? props.bookName.slice(0, 9) + "..." : props.bookName);
  const [currentParallelViewChapter, setCurrentParallelViewChapter] = useState(currentVisibleChapter);
  const [bookName, setBookName] = useState(props.bookName);
  const [bookNameList, setBookNameList] = useState([]);
  const [shortbookName, setShortbookName] = useState(bShortName);
  const [totalChapters, setTotalChapters] = useState(props.totalChapters);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const [bookId, setBookId] = useState(props.bookId);
  const [parallelBible, setParallelBible] = useState(null);
  const [parallelBibleHeading, setParallelBibleHeading] = useState(null);
  const [pNextContent, setPNextContent] = useState(null);
  const [PpeviousContent, setPpeviousContent] = useState(null);
  const [totalVerses, setTotalVerses] = useState(null);
  const [loading, setLoading] = useState(false);
  const style = styles(props.colorFile, props.sizeFile);
  let alertPresent = false;

  const updateBook = async () => {
    try {
      let response = await vApi.get("booknames");
      setBookNameList(response);
      let bukName = null;
      if (response) {
        let parallelLanguage =
          props.parallelLanguage &&
          props.parallelLanguage.languageName.toLowerCase();
        for (var i = 0; i <= response.length - 1; i++) {
          if (response[i].language.name === parallelLanguage) {
            for (var j = 0; j <= response[i].bookNames.length - 1; j++) {
              if (bookId != null) {
                if (response[i].bookNames[j].book_code == bookId) {
                  bukName = response[i].bookNames[j].short;
                }
              }
            }
          }
        }
        if (bukName != null) {
          let shortbookNames =
            bukName != null &&
            (bukName.length > 10 ? bukName.slice(0, 9) + "..." : bukName);
          setMessage(null);
          setError(false);
          setBookName(bukName);
          setShortbookName(shortbookNames);
        } else {
          setError(true);
          setMessage("This will be available soon");
          if (parallelLanguage) {
            let lang =
              parallelLanguage.charAt(0).toUpperCase() +
              parallelLanguage.slice(1);
            Alert.alert(
              "",
              "The book you were reading is not available in " + lang,
              [
                {
                  text: "OK",
                  onPress: () => {
                    return;
                  },
                },
              ]
            );
          }
        }
      } else {
        setMessage(null);
        setError(false);
        return;
      }
    } catch (error) {
      setError(true);
      setBookNameList([]);
    }
  };

  const queryParallelBible = async (val, bkId) => {
    try {
      if (props.parallelLanguage) {
        let chapter =
          val == null ? currentParallelViewChapter : val;
        let bookIds = bkId == null ? bookId : bkId;
        console.log(" BIBLE Book id", bookIds)
        setLoading(true);
        setBookId(bookIds);
        setCurrentParallelViewChapter(chapter);
        updateBook();
        let url =
          "bibles" +
          "/" +
          props.parallelLanguage.sourceId +
          "/" +
          "books" +
          "/" +
          bookIds +
          "/" +
          "chapter" +
          "/" +
          chapter;
        let response = await vApi.get(url);

        if (response.chapterContent) {
          let chapterContent = response.chapterContent.contents;
          let totalVerse = response.chapterContent.contents.length;
          let pNextContents =
            Object.keys(response.next).length > 0 ? response.next : null;
          let PpeviousContents =
            Object.keys(response.previous).length > 0
              ? response.previous
              : null;
          setParallelBible(chapterContent);
          setParallelBibleHeading(getHeading(response.chapterContent.contents));
          setTotalVerses(totalVerse);
          setLoading(false);
          setError(false);
          setMessage(null);
          setPNextContent(pNextContents);
          setPpeviousContent(PpeviousContents);
        } else {
          setParallelBible(null);
          setParallelBibleHeading(null);
          setBookId(null);
          setLoading(false);
          setError(true);
          setMessage(null);
          setPNextContent(null);
          setPpeviousContent(null);
        }
      }
    } catch (error) {
      setMessage(null);
      setError(true);
      setLoading(false);
    }
  };
  const getRef = async (item) => {
    try {
      setTotalChapters(item.totalChapters);
      queryParallelBible(item.chapterNumber, item.bookId);
      updateBook()
    } catch (error) {
      setError(true);
      setMessage(null);
    }
  };

  const errorMessage = () => {
    if (!alertPresent) {
      alertPresent = true;
      if (error) {
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
      } else {
        alertPresent = false;
      }
    }
  };

  const goToSelectionTab = () => {
    if (props.parallelLanguage) {
      navigation.navigate("ReferenceSelection", {
        getReference: getRef,
        parallelContent: true,
        bookId: bookId,
        bookName: bookName,
        chapterNumber: currentParallelViewChapter,
        totalChapters: totalChapters,
        language: props.parallelLanguage.languageName,
        version: props.parallelLanguage.versionCode,
        sourceId: props.parallelLanguage.sourceId,
        downloaded: false,
      });
    }
  };

  useEffect(() => {
    queryParallelBible(null, null);
    updateBook();
    return () => {
      props.books.length = 0;
      props.fetchVersionBooks({
        language: props.language,
        versionCode: props.versionCode,
        downloaded: props.downloaded,
        sourceId: props.sourceId,
      });
    };
  }, []);
  useEffect(() => {
    updateBook()
    queryParallelBible(null, null);
  }, [bookId])

  closeParallelView = (value) => {
    props.parallelVisibleView({
      modalVisible: false,
      visibleParallelView: value,
    })
  }
  return (
    <View style={style.container}>
      <Header
        style={{
          backgroundColor: Color.Blue_Color,
          height: 40,
          borderLeftWidth: 0.2,
          borderLeftColor: Color.White,
        }}
      >
        <Button transparent onPress={goToSelectionTab}>
          {shortbookName ? (
            <Title style={{ fontSize: 16 }}>
              {shortbookName} {currentParallelViewChapter}{" "}
            </Title>
          ) : null}
          <Icon name="arrow-drop-down" color={Color.White} size={20} />
        </Button>
        <Right style={{ position: "absolute", right: 4 }}>
          <Button transparent onPress={() => closeParallelView(false)}>
            <Icon name="cancel" color={Color.White} size={20} />
          </Button>
        </Right>
      </Header>
      {loading && <Spinner visible={true} textContent={"Loading..."} />}
      {parallelBible == null && error ? (
        <View style={style.centerReloadButton}>
          <ReloadButton
            styles={style}
            reloadFunction={() => queryParallelBible(null, null)}
            message={message}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={style.scrollVContainer}
            showsVerticalScrollIndicator={false}
            ref={(ref) => {
              scrollViewRef = ref;
            }}
          >
            {parallelBible &&
              parallelBible.map((verse, index) => (
                <View style={{ marginHorizontal: 16 }} key={index}>
                  {(verse.verseNumber == 1 &&
                    typeof verse.verseNumber != "undefined") == 1 ? (
                    <Text letterSpacing={24} style={style.verseWrapperText}>
                      {typeof verse.verseText == "undefined" ? null : (
                        <Text>
                          {parallelBibleHeading != null ? (
                            <Text style={style.sectionHeading}>
                              {parallelBibleHeading} {"\n"}
                            </Text>
                          ) : null}
                          <Text>
                            <Text style={style.verseChapterNumber}>
                              {currentParallelViewChapter}{" "}
                            </Text>
                            <Text style={style.textString}>
                              {getResultText(verse.verseText)}
                            </Text>
                          </Text>
                          {getHeading(verse.contents) ? (
                            <Text style={style.sectionHeading}>
                              {"\n"}
                              {getHeading(verse.contents)}
                            </Text>
                          ) : null}
                        </Text>
                      )}
                    </Text>
                  ) : typeof verse.verseNumber != "undefined" ? (
                    <Text>
                      {typeof verse.verseText == "undefined" ? null : (
                        <Text letterSpacing={24} style={style.verseWrapperText}>
                          <Text>
                            <Text style={style.verseNumber}>
                              {verse.verseNumber}
                            </Text>
                            <Text style={style.textString}>
                              {getResultText(verse.verseText)}
                            </Text>
                          </Text>
                          {getHeading(verse.contents) ? (
                            <Text style={style.sectionHeading}>
                              {"\n"}
                              {getHeading(verse.contents)}
                            </Text>
                          ) : null}
                        </Text>
                      )}
                    </Text>
                  ) : null}
                </View>
              ))}
            <View style={style.addToSharefooterComponent}>
              {props.parallelMetaData != null && parallelBible && (
                <View style={style.footerView}>
                  {props.parallelMetaData.revision !== null &&
                    props.parallelMetaData.revision !== "" && (
                      <Text style={style.textListFooter}>
                        <Text style={style.footerText}>Copyright:</Text>{" "}
                        {props.parallelMetaData.revision}
                      </Text>
                    )}
                  {props.parallelMetaData.license !== null &&
                    props.parallelMetaData.license !== "" && (
                      <Text style={style.textListFooter}>
                        <Text style={style.footerText}>License:</Text>{" "}
                        {props.parallelMetaData.license}
                      </Text>
                    )}
                  {props.parallelMetaData.technologyPartner !== null &&
                    props.parallelMetaData.technologyPartner !== "" && (
                      <Text style={style.textListFooter}>
                        <Text style={style.footerText}>
                          Technology partner:
                        </Text>{" "}
                        {props.parallelMetaData.technologyPartner}
                      </Text>
                    )}
                </View>
              )}
            </View>
          </ScrollView>

          <View
            style={{
              justifyContent:
                currentParallelViewChapter != 1 &&
                  (currentParallelViewChapter == currentParallelViewChapter) !=
                  totalChapters
                  ? "center"
                  : "space-around",
              alignItems: "center",
            }}
          >
            {PpeviousContent &&
              Object.keys(PpeviousContent).length > 0 &&
              PpeviousContent.constructor === Object ? (
              <View style={style.bottomBarParallelPrevView}>
                <Icon
                  name={"chevron-left"}
                  color={Color.Blue_Color}
                  size={16}
                  style={style.bottomBarChevrontIcon}
                  onPress={() => queryParallelBible(
                    PpeviousContent.chapterId,
                    PpeviousContent.bibleBookCode
                  )
                  }
                />
              </View>
            ) : null}
            {pNextContent &&
              Object.keys(pNextContent).length > 0 &&
              pNextContent.constructor === Object ? (
              <View style={style.bottomBarNextParallelView}>
                <Icon
                  name={"chevron-right"}
                  color={Color.Blue_Color}
                  size={16}
                  style={style.bottomBarChevrontIcon}
                  onPress={() => queryParallelBible(
                    pNextContent.chapterId,
                    pNextContent.bibleBookCode
                  )
                  }
                />
              </View>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    books: state.versionFetch.versionBooks,
    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    totalChapters: state.updateVersion.totalChapters,
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    selectContent: (payload) => dispatch(selectContent(payload)),
    parallelVisibleView: (payload) => dispatch(parallelVisibleView(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BibleChapter);
