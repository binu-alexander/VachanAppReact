import React, { createRef, useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DbQueries from "../../utils/dbQueries.js";
import {
  getBookChaptersFromMapping,
  getBookNumberFromMapping,
  getResultText,
} from "../../utils/UtilFunctions";
import SearchTab from "../../components/SearchTab/SearchTab";
import {
  updateVersionBook,
  updateVersion,
  fetchVersionBooks,
  updateMetadata,
} from "../../store/action/";

import { styles } from "./styles";
import { connect } from "react-redux";
import Color from "../../utils/colorConstants";
import vApi from "../../utils/APIFetch";
const width = Dimensions.get("window").width;

const SearchResultTypes = {
  ALL: 0,
  OT: 1,
  NT: 2,
};

const Search = (props) => {
  const [searchedResult, setSearchedResult] = useState([]);
  const [activeTab, setActiveTab] = useState(SearchResultTypes.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tabsData, setTabsData] = useState([]);
  const [sourceId, setSourceId] = useState(props.sourceId);
  const [languageName, setLanguageName] = useState(props.languageName);
  const [versionCode, setVersionCode] = useState(props.versionCode);
  const [downloaded, setDownloaded] = useState(props.downloaded);
  const [languageCode, setLanguageCode] = useState(props.languageCode);
  const [books, setBooks] = useState(props.books);
  const [metadata, setMetaData] = useState(null);
  const style = styles(props.colorFile, props.sizeFile);
  let elementIndex = createRef();

  const addRefListToTab = (list) => {
    switch (activeTab) {
      case SearchResultTypes.ALL: {
        setTabsData([...tabsData, ...list]);
        break;
      }
      case SearchResultTypes.OT: {
        let reflist = [];
        for (let i = 0; i < list.length; i++) {
          if (getBookNumberFromMapping(list[i].bookId) <= 39) {
            reflist.push(list[i]);
          }
        }
        setTabsData([...tabsData, ...reflist]);
        break;
      }
      case SearchResultTypes.NT: {
        let reflist = [];
        for (let j = 0; j < list.length; j++) {
          if (getBookNumberFromMapping(list[j].bookId) >= 40) {
            reflist.push(list[j]);
          }
        }
        setTabsData([...tabsData, ...reflist]);
        break;
      }
    }
  };

  const onSearchText = async () => {
    setIsLoading(true);
    setSearchedResult([]);
    setTabsData([]);
    console.log(searchText, "text");
    if (downloaded) {
      let searchResultByBookName = await DbQueries.querySearchBookWithName(
        versionCode,
        languageName,
        searchText
      );
      if (searchResultByBookName) {
        let reference = [
          {
            bookId: searchResultByBookName.bookId,
            bookName: searchResultByBookName.bookName,
            chapterNumber: 1,
            verseNumber: "1",
            searchText: "",
          },
        ];
        setSearchedResult(reference);
        addRefListToTab(reference);
      }

      let searchResultByVerseText = await DbQueries.querySearchVerse(
        versionCode,
        languageName,
        searchText
      );
      if (searchResultByVerseText && searchResultByVerseText.length > 0) {
        setSearchedResult([...searchedResult, ...searchResultByVerseText]);
        addRefListToTab(searchResultByVerseText);
      }
      setIsLoading(false);
    } else {
      let res = await vApi.get(
        "search/" + JSON.parse(sourceId) + "?keyword=" + searchText
      );
      console.log(res.result, "res");
      let data = [];
      if (res && res.result.length > 0 && books) {
        for (let i = 0; i < res.result.length; i++) {
          for (let j = 0; j < books.length; j++) {
            var bId = books[j].bookId;
            var bName = books[j].bookName;
            if (bId === res.result[i].bookCode) {
              data.push({
                bookId: res.result[i].bookCode,
                bookName: bName,
                chapterNumber: res.result[i].chapter,
                verseNumber: res.result[i].verse,
                text: res.result[i].text,
              });
            }
          }
        }
        console.log(data, res.result, "ress");
        setSearchedResult(data);
        addRefListToTab(data);
      }
      console.log(data, "data");
    }
    setIsLoading(false);
  };
  const renderDataOnPressTab = (activeTabs) => {
    setTabsData([]);
    switch (activeTabs) {
      case SearchResultTypes.ALL: {
        setTabsData(searchedResult);
        break;
      }
      case SearchResultTypes.OT: {
        let data = [];
        for (var i = 0; i < searchedResult.length; i++) {
          if (getBookNumberFromMapping(searchedResult[i].bookId) <= 39) {
            data.push(searchedResult[i]);
          }
        }
        setTabsData(data);
        break;
      }
      case SearchResultTypes.NT: {
        let data = [];
        for (var j = 0; j < searchedResult.length; j++) {
          if (getBookNumberFromMapping(searchedResult[j].bookId) >= 40) {
            data.push(searchedResult[j]);
          }
        }
        setTabsData(data);
        break;
      }
    }
  };
  useEffect(() => {
    let subs = props.navigation.addListener("didFocus", async () => {
      const response = await vApi.get("booknames");
      for (var i = 0; i < response.length; i++) {
        var books = [];
        if (languageName.toLowerCase() == response[i].language.name) {
          for (var j = 0; j < response[i].bookNames.length; j++) {
            books.push({
              bookId: response[i].bookNames[j].book_code,
              bookName: response[i].bookNames[j].short,
              bookNumber: response[i].bookNames[j].book_id,
            });
          }
          setBooks(books);
        }
      }
      setTabsData([]);
      setSearchedResult([]);
      setSearchText("");
      setIsLoading(false);
    });
    props.navigation.setOptions({
      headerTitle: () => (
        <TextInput
          placeholder="Enter Search Text"
          underlineColorAndroid={Color.Transparent}
          style={{ color: Color.White, width: width - 90 }}
          onChangeText={(searchText) => setSearchText(searchText)}
          placeholderTextColor={Color.White}
          // returnKeyType="search"
          multiline={false}
          numberOfLines={1}
          onSubmitEditing={onSearchText}
        />
      ),
      headerRight: () => (
        <TouchableOpacity onPress={onSearchText}>
          <Icon
            name={"search"}
            size={24}
            color={Color.White}
            style={{ marginHorizontal: 8 }}
          />
        </TouchableOpacity>
      ),
    });
    return () => {
      subs;
    };
  }, [searchText, searchedResult, props.languageName]);
  const toggleButton = (activeTabs) => {
    if (activeTabs === activeTab) {
      return;
    }
    setActiveTab(activeTabs);
    renderDataOnPressTab(activeTabs);
  };

  const goToBible = (bId, bookName, chapterNum) => {
    props.updateVersionBook({
      bookId: bId,
      bookName: bookName,
      chapterNumber: chapterNum,
      totalChapters: getBookChaptersFromMapping(bId),
    });

    props.updateVersion({
      language: languageName,
      languageCode: languageCode,
      versionCode: versionCode,
      sourceId: sourceId,
      downloaded: downloaded,
    });

    props.fetchVersionBooks({
      language: languageName,
      versionCode: versionCode,
      downloaded: downloaded,
      sourceId: sourceId,
    });
    if (metadata === null) {
      props.updateMetadata({
        copyrightHolder: null,
        description: null,
        license: null,
        source: null,
        technologyPartner: null,
        revision: null,
        versionNameGL: null,
      });
    } else {
      props.updateMetadata({
        copyrightHolder: metadata[0].copyrightHolder,
        description: metadata[0].description,
        license: metadata[0].license,
        source: metadata[0].source,
        technologyPartner: metadata[0].technologyPartner,
        revision: metadata[0].revision,
        versionNameGL: metadata[0].versionNameGL,
      });
    }

    props.navigation.navigate("Bible");
  };
  const ListEmptyComponent = () => {
    return (
      <View style={style.ListEmptyContainer}>
        {isLoading === false && tabsData === null ? (
          <Text>No Result Found</Text>
        ) : null}
      </View>
    );
  };

  const ListFooterComponent = () => {
    return (
      <View>
        {isLoading ? (
          <ActivityIndicator
            style={{ alignItems: "center", justifyContent: "center" }}
            size="large"
            color={Color.Blue_Color}
          />
        ) : null}
      </View>
    );
  };
  const searchedData = ({ item }) => {
    return (
      <TouchableOpacity
        style={style.searchedDataContainer}
        onPress={() => {
          goToBible(
            item.bookId,
            item.bookName,
            item.chapterNumber,
            item.verseNumber,
            languageName
          );
        }}
      >
        <Text style={style.searchedData}>
          {item.bookName} {item.chapterNumber} : {item.verseNumber}
        </Text>
        <Text style={style.textStyle}>{getResultText(item.text)}</Text>
      </TouchableOpacity>
    );
  };
  const updateLangVer = async (item) => {
    setTabsData([]);
    setSearchedResult([]);
    setSourceId(item.sourceId);
    setLanguageCode(item.languageCode);
    setLanguageName(item.languageName);
    setVersionCode(item.versionCode);
    setDownloaded(item.downloaded);
    setBooks(item.books);
    setMetaData(item.metadata);
  };
  let text =
    isLoading === true
      ? "Loading..."
      : tabsData.length + " search results found";
  return (
    <View style={style.container}>
      <View style={style.toggleBibleTouchable}>
        <Text style={style.headerStyle}>Bible</Text>
        <TouchableOpacity
          style={{
            backgroundColor: Color.Blue_Color,
            padding: 8,
            borderRadius: 8,
          }}
          onPress={() =>
            props.navigation.navigate("LanguageList", {
              updateLangVer: updateLangVer,
            })
          }
        >
          <Text style={style.text}>
            {languageName.charAt(0).toUpperCase() + languageName.slice(1)}{" "}
            {versionCode.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={style.textLength}>{text}</Text>
      {searchedResult.length > 0 && (
        <View style={{ flex: 1 }}>
          <SearchTab toggleFunction={toggleButton} activeTab={activeTab} />
          <FlatList
            contentContainerStyle={{ paddingBottom: 60 }}
            ref={elementIndex}
            data={tabsData}
            renderItem={searchedData}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={ListFooterComponent}
          />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    languageName: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    downloaded: state.updateVersion.downloaded,
    sourceId: state.updateVersion.sourceId,
    bookName: state.updateVersion.bookName,
    books: state.versionFetch.versionBooks,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
    updateVersion: (value) => dispatch(updateVersion(value)),
    fetchVersionBooks: (value) => dispatch(fetchVersionBooks(value)),
    updateMetadata: (payload) => dispatch(updateMetadata(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
