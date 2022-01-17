"use strict";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Accordion } from "native-base";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CommonActions } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/stack";
import DbQueries from "../../utils/dbQueries";
import { styles } from "./styles.js";
import { getBookSectionFromMapping } from "../../utils/UtilFunctions";
import { connect } from "react-redux";
import {
  updateVersion,
  fetchVersionBooks,
  fetchAllContent,
  updateMetadata,
  updateLangList,
} from "../../store/action/";
import Spinner from "react-native-loading-spinner-overlay";
import ReloadButton from "../../components/ReloadButton";
import vApi from "../../utils/APIFetch";
import Color from "../../utils/colorConstants";
import { getHeading } from "../../utils/UtilFunctions";

const LanguageList = (props) => {
  const [startDownload, setStartDownloaded] = useState(false);
  const [languages, setLanguages] = useState([]);
  const updateLanguageList = false;
  const prevBible = useRef(props.bibleContent).current;
  const style = styles(props.colorFile, props.sizeFile);
  let alertPresent = false;
  const recallFunc = async () => {
    try {
      await props.fetchAllContent();
      // BackHandler.addEventListener('hardwareBackPress', this.onBack);
      const scheduledDate = new Date();
      let resolution =
        Date.parse(scheduledDate) - Date.parse(props.langTimeStamp);
      var resolutionTime = resolution / 1000 / 60 / 60 / 24;
      if (resolutionTime > 1) {
        let books = await vApi.get("booknames");
        let lang = props.bibleLanguages[0].content;
        if (books && lang) {
          await DbQueries.deleteLangaugeList();
          await DbQueries.addLangaugeList(lang, books);
          await DbQueries.updateLanguageList();
        }
        props.updateLangList({ langTimeStamp: scheduledDate });
      }
      await fetchLanguages();
    } catch (error) {
      console.log(error.message);
    }
  };
  const onBack = () => {
    let updateSourceId = false;
    let updatedObj = {};
    let lanVer = languages;
    if (updateLanguageList) {
      for (var i = 0; i < lanVer.length; i++) {
        for (var j = 0; j < lanVer[i].versionModels.length; j++) {
          if (lanVer[i].versionModels[j].sourceId == props.sourceId) {
            updateSourceId = true;
            updatedObj = {
              sourceId: lanVer[i].versionModels[j].sourceId,
              languageName: lanVer[i].languageName,
              languageCode: lanVer[i].languageCode,
              versionCode: lanVer[i].versionModels[j].versionCode,
              downloaded: lanVer[i].versionModels[j].downloaded,
              books: lanVer[i].bookNameList,
              metadata: lanVer[i].versionModels[j].metaData,
            };
          }
        }
      }
      if (updateSourceId) {
        if (Object.keys(updatedObj).length > 0) {
          props.route.params.updateLangVer(updatedObj);
        }
      } else {
        props.route.params.updateLangVer({
          sourceId: lanVer[0].versionModels[0].sourceId,
          languageName: lanVer[0].languageName,
          languageCode: lanVer[0].languageCode,
          versionCode: lanVer[0].versionModels[0].versionCode,
          downloaded: lanVer[0].versionModels[0].downloaded,
          books: lanVer[0].bookNameList,
          metadata: lanVer[0].versionModels[0].metaData,
        });
        //can add alert for showing user that previous version you were reading not available set a default one
      }
    }
    props.navigation.dispatch(CommonActions.goBack());
  };
  const errorMessage = () => {
    if (!alertPresent) {
      alertPresent = true;
      if (languages.length == 0) {
        fetchLanguages();
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
  //refetch data if internet connection lost
  const updateData = () => {
    props.fetchAllContent();
    errorMessage();
  };

  const getLangList = async (languages, books) => {
    var lanVer = [];
    if (languages && books) {
      for (var i = 0; i < languages.length; i++) {
        for (var j = 0; j < books.length; j++) {
          var bookArr = [];
          if (
            languages[i].languageName.toLowerCase() == books[j].language.name
          ) {
            for (var k = 0; k < books[j].bookNames.length; k++) {
              const bookObj = {
                bookId: books[j].bookNames[k].book_code,
                bookName: books[j].bookNames[k].short,
                bookNumber: books[j].bookNames[k].book_id,
              };
              bookArr.push(bookObj);
            }
            var bookList = bookArr.sort(function (a, b) {
              return a.bookNumber - b.bookNumber;
            });
            lanVer.push({
              languageName: languages[i].languageName,
              languageCode: languages[i].languageCode,
              versionModels: languages[i].versionModels,
              bookNameList: bookList,
            });
          }
        }
      }
      return lanVer;
    }
  };
  const fetchLanguages = async () => {
    var lanVer = [];
    const languageList = await DbQueries.getLangaugeList();
    try {
      if (languageList == null) {
        let books = await vApi.get("booknames");
        let languages = props.bibleLanguages[0].content;
        lanVer = await getLangList(languages, books);
        DbQueries.addLangaugeList(languages, books);
      } else {
        for (var i = 0; i < languageList.length; i++) {
          lanVer.push(languageList[i]);
        }
      }

      var res =
        lanVer.length == 0
          ? []
          : lanVer.sort(function (a, b) {
              var textA = a.languageName.toUpperCase();
              var textB = b.languageName.toUpperCase();
              return textA.localeCompare(textB);
            });
      setLanguages(res);
    } catch (error) {
      console.log(error.message);
    }
  };
  const downloadBible = async (langName, verCode, books, sourceId) => {
    try {
      setStartDownloaded(true);
      let bookModels = [];
      let content = await vApi.get(
        "bibles" + "/" + parseInt(sourceId) + "/" + "json"
      );
      if (content.bibleContent && books) {
        for (var i = 0; i < books.length; i++) {
          bookModels.push({
            languageName: langName,
            versionCode: verCode,
            bookId: books[i].bookId,
            bookName: books[i].bookName,
            bookNumber: books[i].bookNumber,
            chapters: getChapters(content.bibleContent, books[i].bookId),
            section: getBookSectionFromMapping(books[i].bookId),
          });
        }
      }
      await DbQueries.addNewVersion(langName, verCode, bookModels, sourceId);
      await fetchLanguages();
      setStartDownloaded(false);
    } catch (error) {
      setStartDownloaded(false);
      Alert.alert(
        "",
        "Something went wrong. Try Again",
        [
          {
            text: "OK",
            onPress: () => {
              return;
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const getChapters = (content, bookId) => {
    try {
      let chapterModels = [];
      // let chapterHeading = null;
      let vNumber = null;
      for (var id in content) {
        if (content != null && id == bookId) {
          for (var c = 0; c < content[id].chapters.length; c++) {
            var verseModels = [];
            for (var v = 0; v < content[id].chapters[c].contents.length; v++) {
              let verseData = content[id].chapters[c].contents[v];
              if (verseData.verseNumber) {
                vNumber = verseData.verseNumber;
                verseModels.push({
                  text: verseData.verseText,
                  number: verseData.verseNumber,
                  section: getHeading(verseData.contents),
                });
              }
            }
            let chapterModel = {
              chapterNumber: c + 1,
              //it was for verse grid not in current use
              numberOfVerses: parseInt(vNumber),
              chapterHeading: getHeading(content[id].chapters[c].contents),
              verses: verseModels,
            };
            chapterModels.push(chapterModel);
          }
          return chapterModels;
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // this is useful for reusing code as this page is calling at other places
  const navigateTo = (
    langName,
    langCode,
    booklist,
    verCode,
    sourceId,
    metadata,
    downloaded
  ) => {
    if (props.route.params.updateLangVer) {
      //call back fucntion to update perticular values on back
      props.route.params.updateLangVer({
        sourceId: sourceId,
        languageName: langName,
        languageCode: langCode,
        versionCode: verCode,
        downloaded: downloaded,
        books: booklist,
        metadata: metadata,
      });
      props.navigation.pop();
    } else {
      // for downloading bible from settings page no need to navigate
      if (langName.toLowerCase() === "english") {
        Alert.alert(
          "",
          "This version is not currently available for download."
        );
      } else {
        if (downloaded) {
          Alert.alert("", "Version " + verCode + " is already downloaded.");
        } else {
          Alert.alert("", "To Download the Bible, click on download icon.");
        }
      }
    }
  };
  const deleteBible = (
    languageName,
    languageCode,
    versionCode,
    sourceId,
    downloaded
  ) => {
    DbQueries.deleteBibleVersion(
      languageName,
      versionCode,
      sourceId,
      downloaded
    );
    fetchLanguages();
  };

  const _renderHeader = (item) => {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={style.headerText}>{item.languageName}</Text>
        <Icon style={style.iconStyle} name={"keyboard-arrow-down"} size={24} />
      </View>
    );
  };
  const _renderContent = (item) => {
    return (
      <View>
        {/*Content under the header of the Expandable List Item*/}
        {item.versionModels.map((element, index) => (
          <TouchableOpacity
            key={index}
            style={style.listContainer}
            onPress={() => {
              navigateTo(
                item.languageName,
                item.languageCode,
                item.bookNameList,
                element.versionCode,
                element.sourceId,
                element.metaData,
                element.downloaded
              );
            }}
          >
            <View>
              <Text style={[style.text, { marginLeft: 8, fontWeight: "bold" }]}>
                {element.versionCode}{" "}
              </Text>
              <Text style={[style.text, { marginLeft: 8 }]}>
                {element.versionName}
              </Text>
            </View>
            <View style={{ padding: 20 }}>
              {element.downloaded === true ? (
                item.languageName.toLowerCase() === "english" ? null : (
                  <Icon
                    style={[style.iconStyle, { marginRight: 8 }]}
                    name="delete"
                    size={24}
                    onPress={() => {
                      deleteBible(
                        item.languageName,
                        item.languageCode,
                        element.versionCode,
                        element.sourceId,
                        element.downloaded
                      );
                    }}
                  />
                )
              ) : item.languageName.toLowerCase() === "english" ? null : (
                <Icon
                  style={[style.iconStyle, { marginRight: 12 }]}
                  name="file-download"
                  size={24}
                  onPress={() => {
                    downloadBible(
                      item.languageName,
                      element.versionCode,
                      item.bookNameList,
                      element.sourceId
                    );
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  useEffect(async () => {
    await recallFunc();
    props.navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton tintColor={Color.White} onPress={onBack} />
      ),
    });
    if (prevBible != props.bibleContent) {
      await recallFunc();
    }
  }, [prevBible]);
  return (
    <View style={style.MainContainer}>
      {props.isLoading ? (
        <Spinner visible={true} textContent={"Loading..."} />
      ) : null}
      {startDownload ? (
        <Spinner visible={true} textContent={"DOWNLOADING BIBLE..."} />
      ) : null}
      {languages.length == 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ReloadButton
            reloadFunction={updateData}
            styles={style}
            message={null}
          />
        </View>
      ) : (
        <Accordion
          dataArray={languages}
          animation={true}
          expanded={[0]}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    bookId: state.updateVersion.bookId,
    chapterNumber: state.updateVersion.chapterNumber,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    bibleLanguages: state.contents.contentLanguages,
    books: state.versionFetch.data,
    baseAPI: state.updateVersion.baseAPI,
    langTimeStamp: state.updateVersion.langTimeStamp,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateVersion: (value) => dispatch(updateVersion(value)),
    fetchAllContent: () => dispatch(fetchAllContent()),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    updateMetadata: (payload) => dispatch(updateMetadata(payload)),
    updateLangList: (payload) => dispatch(updateLangList(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LanguageList);