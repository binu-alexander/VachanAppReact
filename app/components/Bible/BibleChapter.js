import React, { useEffect, useState, useContext, useRef } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Spinner from "react-native-loading-spinner-overlay";
import {
  fetchVersionBooks,
  selectContent,
  parallelVisibleView,
  updateVersionBook,
} from "../../store/action";
import { styles } from "./styles";
import { connect } from "react-redux";
import { getBookChaptersFromMapping, getResultText } from "../../utils/UtilFunctions";
import { Header, Button, Right, Title } from "native-base";
import Color from "../../utils/colorConstants";
import ReloadButton from "../ReloadButton";
import vApi from "../../utils/APIFetch";
import { getHeading } from "../../utils/UtilFunctions";
import { BibleMainContext } from "../../screens/Bible";
import { LoginData } from "../../context/LoginDataProvider";
const BibleChapter = (props) => {
  const [{ navigation }] = useContext(BibleMainContext);//navigation function values are coming from context
  const { currentVisibleChapter, setCurrentVisibleChapter } = useContext(LoginData);//current visible chapter(display currently on the screen) value and setter from another context
  //below making big bookname into short 
  const bShortName =
    bookNameList != null &&
      bookNameList.length > 10
      ? bookNameList.slice(0, 9) + "..."
      : bookNameList;
  const [currentParallelViewChapter, setCurrentParallelViewChapter] = useState(
    currentVisibleChapter
  ); // setting chapter value as the currentParallel chapter(as a state variable)
  const [bookNameList, setBookNameList] = useState([]);// state variable for the bookname 
  const [shortBookName, setShortBookName] = useState(bShortName);//state variable for the short bookname
  const [totalChapters, setTotalChapters] = useState(props.totalChapters);//state variable for the total chapter
  const [error, setError] = useState(false);//state variable for the error 
  const [message, setMessage] = useState(null);//state variable for the message need to display
  const [parallelBible, setParallelBible] = useState(null);// state variable contain the parallel bible contain
  const [parallelBibleHeading, setParallelBibleHeading] = useState(null); //state variable contain the parallel bible heading
  const [pNextContent, setPNextContent] = useState(null);
  const [previousContent, setPreviousContent] = useState(null);
  const [totalVerses, setTotalVerses] = useState(null);
  const [loading, setLoading] = useState(false);
  const style = styles(props.colorFile, props.sizeFile);// external css file
  let alertPresent = false;
  const scrollViewRef = useRef();// scroll reference 
  //below function is used to update the book 
  const updateBook = async () => {
    try {
      let bukName = null;
      if (bookNameList.length > 0) {
        // looping in booklist 
        for (var j = 0; j <= bookNameList.length - 1; j++) {
          if (props.bookId != null) {
            //comparing the response id and props book id
            if (bookNameList[j].book_code === props.bookId) {
              bukName = bookNameList[j].short;
            }
          }
        }
        if (bukName != null) {
          //making the bookname short if bukname is not null 
          let shortBookNames =
            bukName != null &&
            (bukName.length > 10 ? bukName.slice(0, 9) + "..." : bukName);
          setMessage(null);
          setError(false);
          setShortBookName(shortBookNames);
        } else {
          setError(true);
          setMessage("This will be available soon");
          let parallelLanguage = props.parallelLanguage?.languageName.toLowerCase();
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
    }
  };
  // below function is to fetch the data according to parallel bible 
  const queryParallelBible = async (val, bkId) => {
    try {
      if (props.parallelLanguage) {
        // val is chapter,bkId is book id 
        let chapter = val === null ? currentVisibleChapter : val;
        let bookIdCh = bkId === null ? props.bookId : bkId;
        setLoading(true);
        setCurrentParallelViewChapter(chapter);
        setCurrentVisibleChapter(chapter)
        updateBook();

        let url =
          "bibles" +
          "/" +
          props.parallelLanguage.sourceId +
          "/" +
          "books" +
          "/" +
          bookIdCh +
          "/" +
          "chapter" +
          "/" +
          chapter;
        let response = await vApi.get(url);// fetching the response according to updated value in the url
        if (response.chapterContent) {
          let chapterContent = response.chapterContent.contents;
          let totalVerse = response.chapterContent.contents.length;
          let pNextContents =
            Object.keys(response.next).length > 0 ? response.next : null;
          let PrevContents =
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
          setPreviousContent(PrevContents);
        } else {
          setParallelBible(null);
          setParallelBibleHeading(null);
          setLoading(false);
          setError(true);
          setMessage(null);
          setPNextContent(null);
          setPreviousContent(null);
        }
      }
    } catch (error) {
      setMessage(null);
      setError(true);
      setLoading(false);
    }
  };
  //in the below we updating the props values
  const getRef = async (item) => {
    try {
      setCurrentParallelViewChapter(item.chapterNumber)
      setTotalChapters(item.totalChapters);
      queryParallelBible(item.chapterNumber, item.bookId);
      updateBook();
      props.updateVersionBook({
        bookId: item.bookId,
        bookName: item.bookName,
        chapterNumber: item.chapterNumber,
        totalChapters: getBookChaptersFromMapping(
          item.bookId
        ),
      });
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
    //here we are going to referenceSelection tab with updated values
    if (props.parallelLanguage) {
      navigation.navigate("ReferenceSelection", {
        getReference: getRef,
        parallelContent: true,
        bookId: props.bookId,
        bookName: props.bookName,
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
      //for getting the updated props value
      props.fetchVersionBooks({
        language: props.language,
        versionCode: props.versionCode,
        downloaded: props.downloaded,
        sourceId: props.sourceId,
      });
    };
  }, []);
  useEffect(async () => {
    //on load we getting the response
    let response = await vApi.get("booknames");
    if (response) {
      let parallelLanguage =
        props.parallelLanguage &&
        props.parallelLanguage.languageName.toLowerCase();
      for (var i = 0; i <= response.length - 1; i++) {
        if (response[i].language.name === parallelLanguage) {
          setBookNameList(response[i].bookNames);
        }
      }
    }
  }, [])
  // below useeffect on changing the dependency value those will run
  useEffect(() => {
    updateBook();
    queryParallelBible(currentVisibleChapter, props.bookId);
  }, [currentParallelViewChapter, props.bookName, bShortName, shortBookName, bookNameList, currentVisibleChapter]);

  const closeParallelView = (value) => {
    props.parallelVisibleView({
      modalVisible: false,
      visibleParallelView: value,
    });
  };
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
          {shortBookName ? (
            <Title style={{ fontSize: 16 }}>
              {shortBookName}{currentVisibleChapter}{" "}
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
      {parallelBible === null && error ? (
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
            ref={scrollViewRef}
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
                  (currentParallelViewChapter === currentParallelViewChapter) !=
                  totalChapters
                  ? "center"
                  : "space-around",
              alignItems: "center",
            }}
          >
            {/* {previousContent &&
              Object.keys(previousContent).length > 0 &&
              previousContent.constructor === Object ? (
              <View style={style.bottomBarParallelPrevView}>
                <Icon
                  name={"chevron-left"}
                  color={Color.Blue_Color}
                  size={16}
                  style={style.bottomBarChevrontIcon}
                  onPress={() =>
                    queryParallelBible(
                      previousContent.chapterId,
                      previousContent.bibleBookCode
                    )
                  }
                />
              </View>
            ) : null} */}
            {/* {pNextContent &&
              Object.keys(pNextContent).length > 0 &&
              pNextContent.constructor === Object ? (
              <View style={style.bottomBarNextParallelView}>
                <Icon
                  name={"chevron-right"}
                  color={Color.Blue_Color}
                  size={16}
                  style={style.bottomBarChevrontIcon}
                  onPress={() =>
                    queryParallelBible(
                      pNextContent.chapterId,
                      pNextContent.bibleBookCode
                    )
                  }
                />
              </View>
            ) : null} */}
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
    chapterNumber: state.updateVersion.chapterNumber,
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
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BibleChapter);
