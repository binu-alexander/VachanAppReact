import React, { createContext, useEffect, useState } from "react";
import {
  getBookChaptersFromMapping,
  getBookSectionFromMapping,
} from "../utils/UtilFunctions";
import DbQueries from "../utils/dbQueries";
import vApi from "../utils/APIFetch";
import { connect } from "react-redux";
export const MainContext = createContext();

const MainProvider = (props) => {
  const { language, downloaded, sourceId, baseAPI } = props;
  const [bookList, setBookList] = useState([]);
  const getBookList = async () => {
    try {
      let bookListData = [];
      if (downloaded) {
        let response = await DbQueries.getDownloadedBook(language);
        if (response != null) {
          for (var i = 0; i <= response.length - 1; i++) {
            let books = {
              bookId: response[i].bookId,
              bookName: response[i].bookName,
              section: getBookSectionFromMapping(response[i].bookId),
              bookNumber: response[i].bookNumber,
              numOfChapters: getBookChaptersFromMapping(response[i].bookId),
            };
            bookListData.push(books);
          }
        }
      } else {
        let found = false;
        let response = await vApi.get("booknames");
        for (var k = 0; k < response.length; k++) {
          if (language.toLowerCase() == response[k].language.name) {
            for (var j = 0; j <= response[k].bookNames.length - 1; j++) {
              let books = {
                bookId: response[k].bookNames[j].book_code,
                bookName: response[k].bookNames[j].short,
                section: getBookSectionFromMapping(
                  response[k].bookNames[j].book_code
                ),
                bookNumber: response[k].bookNames[j].book_id,
                numOfChapters: getBookChaptersFromMapping(
                  response[k].bookNames[j].book_code
                ),
              };
              bookListData.push(books);
            }
            found = true;
          }
        }
        // if (!found) {
        //   //can exit app to refresh the data or give alert
        //   Alert.alert(
        //     "Check for update in languageList screen",
        //     [
        //       {
        //         text: "OK",
        //         onPress: () => {
        //           return;
        //         },
        //       },
        //     ],
        //     { cancelable: false }
        //   );
        //   // BackHandler.exitApp();
        // }
      }
      var res =
        bookListData.length == 0
          ? []
          : bookListData.sort(function (a, b) {
              return a.bookNumber - b.bookNumber;
            });
      setBookList(res);
    } catch (error) {
      setBookList([]);
      console.log("ERROR ", error);
    }
  };
  useEffect(() => {
    getBookList();
  });
  useEffect(() => {
    getBookList;
  }, [language, sourceId, baseAPI]);
  return (
    <MainContext.Provider value={{ getBookList, bookList }}>
      {props.children}
    </MainContext.Provider>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    baseAPI: state.updateVersion.baseAPI,
  };
};

export default connect(mapStateToProps, null)(MainProvider);
