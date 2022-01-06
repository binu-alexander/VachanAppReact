import React, { useEffect, useState } from "react";
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

// class Search extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       searchedResult: [],
//       activeTab: SearchResultTypes.ALL,
//       isLoading: false,
//       searchText: "",
//       tabsData: [],
//       sourceId: this.props.sourceId,
//       languageName: this.props.languageName,
//       versionCode: this.props.versionCode,
//       downloaded: this.props.downloaded,
//       languageCode: this.props.languageCode,
//       bookName: this.props.bookName,
//       bookId: this.props.bookId,
//       books: this.props.books,
//       metadata: null,
//     };

//     this.onSearchText = this.onSearchText.bind(this);
//     this.toggleButton = this.toggleButton.bind(this);
//     this.clearData = this.clearData.bind(this);

//     this.styles = styles(props.colorFile, props.sizeFile);
//   }

//   onSearchText() {
//     this.setState(
//       { isLoading: true, searchedResult: [], tabsData: [] },
//       async () => {
//         if (this.state.downloaded) {
//           let searchResultByBookName = await DbQueries.querySearchBookWithName(
//             this.state.versionCode,
//             this.state.languageName,
//             this.state.searchText
//           );
//           if (searchResultByBookName) {
//             let reference = [
//               {
//                 bookId: searchResultByBookName.bookId,
//                 bookName: searchResultByBookName.bookName,
//                 chapterNumber: 1,
//                 verseNumber: "1",
//                 searchText: "",
//               },
//             ];
//             this.setState({ searchedResult: reference });
//             this.addRefListToTab(reference);
//           }

//           let searchResultByVerseText = await DbQueries.querySearchVerse(
//             this.state.versionCode,
//             this.state.languageName,
//             this.state.searchText
//           );
//           if (searchResultByVerseText && searchResultByVerseText.length > 0) {
//             this.setState({
//               searchedResult: [
//                 ...this.state.searchedResult,
//                 ...searchResultByVerseText,
//               ],
//             });
//             this.addRefListToTab(searchResultByVerseText);
//           }
//           this.setState({ isLoading: false });
//         } else {
//           var res = await vApi.get(
//             "search/" +
//               JSON.parse(this.state.sourceId) +
//               "?keyword=" +
//               this.state.searchText
//           );
//           var data = [];
//           if (res.result.length > 0 && this.state.books) {
//             for (var i = 0; i < res.result.length; i++) {
//               for (var j = 0; j < this.state.books.length; j++) {
//                 var bId = this.state.books[j].bookId;
//                 var bName = this.state.books[j].bookName;
//                 if (bId == res.result[i].bookCode) {
//                   data.push({
//                     bookId: res.result[i].bookCode,
//                     bookName: bName,
//                     chapterNumber: res.result[i].chapter,
//                     verseNumber: res.result[i].verse,
//                     text: res.result[i].text,
//                   });
//                 }
//               }
//             }
//             this.setState({ searchedResult: data });
//             this.addRefListToTab(data);
//           }
//         }
//       }
//     );
//     this.setState({ isLoading: false });
//   }

//   clearData() {
//     if (this.state.searchText) {
//       this.setState({ searchText: "" });
//     }
//   }

//   addRefListToTab(list) {
//     switch (this.state.activeTab) {
//       case SearchResultTypes.ALL: {
//         this.setState({ tabsData: [...this.state.tabsData, ...list] });
//         break;
//       }
//       case SearchResultTypes.OT: {
//         let reflist = [];
//         for (var i = 0; i < list.length; i++) {
//           if (getBookNumberFromMapping(list[i].bookId) <= 39) {
//             reflist.push(list[i]);
//           }
//         }
//         this.setState({ tabsData: [...this.state.tabsData, ...reflist] });
//         break;
//       }
//       case SearchResultTypes.NT: {
//         let reflist = [];
//         for (var j = 0; j < list.length; j++) {
//           if (getBookNumberFromMapping(list[j].bookId) >= 40) {
//             reflist.push(list[j]);
//           }
//         }
//         this.setState({ tabsData: [...this.state.tabsData, ...reflist] });
//         break;
//       }
//     }
//   }

//   renderDataOnPressTab(activeTab) {
//     this.setState({ tabsData: [] }, () => {
//       switch (activeTab) {
//         case SearchResultTypes.ALL: {
//           this.setState({ tabsData: this.state.searchedResult });
//           break;
//         }
//         case SearchResultTypes.OT: {
//           let data = [];
//           for (var i = 0; i < this.state.searchedResult.length; i++) {
//             if (
//               getBookNumberFromMapping(this.state.searchedResult[i].bookId) <=
//               39
//             ) {
//               data.push(this.state.searchedResult[i]);
//             }
//           }
//           this.setState({ tabsData: data });
//           break;
//         }
//         case SearchResultTypes.NT: {
//           let data = [];
//           for (var j = 0; j < this.state.searchedResult.length; j++) {
//             if (
//               getBookNumberFromMapping(this.state.searchedResult[j].bookId) >=
//               40
//             ) {
//               data.push(this.state.searchedResult[j]);
//             }
//           }
//           this.setState({ tabsData: data });
//           break;
//         }
//       }
//     });
//   }

//   componentDidMount() {
//     this.subs = this.props.navigation.addListener("didFocus", async () => {
//       const response = await vApi.get("booknames");
//       for (var i = 0; i < response.length; i++) {
//         var books = [];
//         if (
//           this.state.languageName.toLowerCase() == response[i].language.name
//         ) {
//           for (var j = 0; j < response[i].bookNames.length; j++) {
//             books.push({
//               bookId: response[i].bookNames[j].book_code,
//               bookName: response[i].bookNames[j].short,
//               bookNumber: response[i].bookNames[j].book_id,
//             });
//           }
//           this.setState({ books });
//         }
//       }
//       this.setState({
//         tabsData: [],
//         searchedResult: [],
//         searchText: "",
//         isLoading: false,
//       });
//     });
//     this.props.navigation.setOptions({
//       headerTitle: () => (
//         <TextInput
//           placeholder="Enter Search Text"
//           underlineColorAndroid={Color.Transparent}
//           style={{ color: Color.White, width: width - 90 }}
//           // onChange={(text) => this.setState({text:text})}
//           onChangeText={(text) => this.setState({ searchText: text })}
//           placeholderTextColor={Color.White}
//           returnKeyType="search"
//           multiline={false}
//           numberOfLines={1}
//           value={this.state.text}
//           onSubmitEditing={() => this.onSearchText()}
//         />
//       ),
//       headerRight: () => (
//         <TouchableOpacity onPress={() => this.onSearchText()}>
//           <Icon
//             name={"search"}
//             size={24}
//             color={Color.White}
//             style={{ marginHorizontal: 8 }}
//           />
//         </TouchableOpacity>
//       ),
//     });
//   }
//   componentWillUnmount() {
//     this.subs();
//   }

//   toggleButton(activeTab) {
//     if (this.state.activeTab == activeTab) {
//       return;
//     }
//     this.setState({ activeTab }, () => {
//       this.renderDataOnPressTab(activeTab);
//     });
//   }

//   goToBible = (bId, bookName, chapterNum) => {
//     this.props.updateVersionBook({
//       bookId: bId,
//       bookName: bookName,
//       chapterNumber: chapterNum,
//       totalChapters: getBookChaptersFromMapping(bId),
//     });

//     this.props.updateVersion({
//       language: this.state.languageName,
//       languageCode: this.state.languageCode,
//       versionCode: this.state.versionCode,
//       sourceId: this.state.sourceId,
//       downloaded: this.state.downloaded,
//     });

//     this.props.fetchVersionBooks({
//       language: this.state.languageName,
//       versionCode: this.state.versionCode,
//       downloaded: this.state.downloaded,
//       sourceId: this.state.sourceId,
//     });
//     if (this.state.metadata === null) {
//       this.props.updateMetadata({
//         copyrightHolder: null,
//         description: null,
//         license: null,
//         source: null,
//         technologyPartner: null,
//         revision: null,
//         versionNameGL: null,
//       });
//     } else {
//       this.props.updateMetadata({
//         copyrightHolder: this.state.metadata[0].copyrightHolder,
//         description: this.state.metadata[0].description,
//         license: this.state.metadata[0].license,
//         source: this.state.metadata[0].source,
//         technologyPartner: this.state.metadata[0].technologyPartner,
//         revision: this.state.metadata[0].revision,
//         versionNameGL: this.state.metadata[0].versionNameGL,
//       });
//     }

//     this.props.navigation.navigate("Bible");
//   };

//   ListEmptyComponent = () => {
//     return (
//       <View style={this.styles.ListEmptyContainer}>
//         {this.state.isLoading == false && this.state.tabsData == null ? (
//           <Text>No Result Found</Text>
//         ) : null}
//       </View>
//     );
//   };

//   ListFooterComponent = () => {
//     return (
//       <View>
//         {this.state.isLoading ? (
//           <ActivityIndicator
//             style={{ alignItems: "center", justifyContent: "center" }}
//             size="large"
//             color={Color.Blue_Color}
//           />
//         ) : null}
//       </View>
//     );
//   };

//   searchedData = ({ item }) => {
//     return (
//       <TouchableOpacity
//         style={this.styles.searchedDataContainer}
//         onPress={() => {
//           this.goToBible(
//             item.bookId,
//             item.bookName,
//             item.chapterNumber,
//             item.verseNumber,
//             this.state.languageName
//           );
//         }}
//       >
//         <Text style={this.styles.searchedData}>
//           {item.bookName} {item.chapterNumber} : {item.verseNumber}
//         </Text>
//         <Text style={this.styles.textStyle}>{getResultText(item.text)}</Text>
//       </TouchableOpacity>
//     );
//   };
//   updateLangVer = async (item) => {
//     this.setState({
//       tabsData: [],
//       searchedResult: [],
//       sourceId: item.sourceId,
//       languageCode: item.languageCode,
//       languageName: item.languageName,
//       versionCode: item.versionCode,
//       downloaded: item.downloaded,
//       books: item.books,
//       metadata: item.metadata,
//     });
//   };
//   render() {
//     let text =
//       this.state.isLoading == true
//         ? "Loading..."
//         : this.state.tabsData.length + " search results found";
//     return (
//       <View style={this.styles.container}>
//         <View style={this.styles.toggleBibleTouchable}>
//           <Text style={this.styles.headerStyle}>Bible</Text>
//           <TouchableOpacity
//             style={{
//               backgroundColor: Color.Blue_Color,
//               padding: 8,
//               borderRadius: 8,
//             }}
//             onPress={() =>
//               this.props.navigation.navigate("LanguageList", {
//                 updateLangVer: this.updateLangVer,
//               })
//             }
//           >
//             <Text style={this.styles.text}>
//               {this.state.languageName.charAt(0).toUpperCase() +
//                 this.state.languageName.slice(1)}{" "}
//               {this.state.versionCode.toUpperCase()}
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <Text style={this.styles.textLength}>{text}</Text>
//         {this.state.searchedResult.length > 0 && (
//           <View style={{ flex: 1 }}>
//             <SearchTab
//               toggleFunction={this.toggleButton}
//               activeTab={this.state.activeTab}
//             />
//             <FlatList
//               contentContainerStyle={{ paddingBottom: 60 }}
//               ref={(ref) => (this.elementIndex = ref)}
//               data={this.state.tabsData}
//               renderItem={this.searchedData}
//               ListEmptyComponent={this.ListEmptyComponent}
//               ListFooterComponent={this.ListFooterComponent}
//             />
//           </View>
//         )}
//       </View>
//     );
//   }
// }
const Search = (props) => {
  const [searchedResult, setSearchedResult] = useState([]);
  const [activeTab, SetActiveTab] = useState(SearchResultTypes.ALL);
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
  const onSearchText = () => {
    setIsLoading(true);
    setSearchedResult([]);
    setTabsData([]);
    async () => {
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
          setSearchedResult(...searchedResult, ...searchResultByVerseText);
          addRefListToTab(searchResultByVerseText);
        }
        setIsLoading(false);
      } else {
        var res = await vApi.get(
          "search/" + JSON.parse(sourceId) + "?keyword=" + searchText
        );
        var data = [];
        if (res.result.length > 0 && books) {
          for (var i = 0; i < res.result.length; i++) {
            for (var j = 0; j < books.length; j++) {
              var bId = books[j].bookId;
              var bName = books[j].bookName;
              if (bId == res.result[i].bookCode) {
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
          setSearchedResult(data);
          addRefListToTab(data);
        }
      }
    };
    setIsLoading(false);
  };
  const addRefListToTab = (list) => {
    switch (activeTab) {
      case SearchResultTypes.ALL: {
        setTabsData([...tabsData, ...list]);
        break;
      }
      case SearchResultTypes.OT: {
        let reflist = [];
        for (var i = 0; i < list.length; i++) {
          if (getBookNumberFromMapping(list[i].bookId) <= 39) {
            reflist.push(list[i]);
          }
        }
        setTabsData([...tabsData, ...reflist]);
        break;
      }
      case SearchResultTypes.NT: {
        let reflist = [];
        for (var j = 0; j < list.length; j++) {
          if (getBookNumberFromMapping(list[j].bookId) >= 40) {
            reflist.push(list[j]);
          }
        }
        setTabsData([...tabsData, ...reflist]);
        break;
      }
    }
  };

  const toggleButton = (activeTab) => {
    if (activeTab == activeTab) {
      return;
    }
    SetActiveTab(activeTab);
    () => {
      this.renderDataOnPressTab(activeTab);
    };
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
        {this.state.isLoading == false && tabsData == null ? (
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
  useEffect(() => {
    const subs = props.navigation.addListener("didFocus", async () => {
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
          // onChange={(text) => this.setState({text:text})}
          onChangeText={(text) => setSearchText(text)}
          placeholderTextColor={Color.White}
          returnKeyType="search"
          multiline={false}
          numberOfLines={1}
          value={text}
          onSubmitEditing={onSearchText()}
        />
      ),
      headerRight: () => (
        <TouchableOpacity onPress={onSearchText()}>
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
      subs();
    };
  }, []);
  let text =
    isLoading == true
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
            // eslint-disable-next-line no-undef
            ref={(ref) => (elementIndex = ref)}
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
