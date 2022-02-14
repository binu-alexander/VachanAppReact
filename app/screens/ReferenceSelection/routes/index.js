import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectBook from "../SelectBook/";
import SelectChapter from "../SelectChapter";
import Color from "../../../utils/colorConstants";
import SelectVerse from "../VerseSelection";
import { connect } from "react-redux";
const Tab = createMaterialTopTabNavigator();
const SelectionTab = (props) => {
  const selectedBookId = props.bookId ? props.bookId : null;
  const selectedBookName = props.bookName ? props.bookName : null;
  const totalChapters = props.totalChapters ? props.totalChapters : null;
  const selectedChapterIndex = 0;
  const selectedChapterNumber = props.params ? props.params.chapterNumber  : null;
  const selectedVerse = props.selectedVerse ? props.selectedVerse : null;
console.log("REFERENCE SELECTION ",props.params)
  return (
    <Tab.Navigator
      initialRouteName="Books"
      tabBarOptions={{
        labelStyle: {
          fontSize: 16,
          margin: 0,
          padding: 0,
          color: Color.White,
        },
        upperCaseLabel: false,
        style: {
          borderBottomWidth: 1,
          borderColor: Color.White,
          backgroundColor: Color.Blue_Color,
          height: 36,
          // headerStyle: {
          //     backgroundColor: Color.Blue_Color,
          //     height: 36,
          //     elevation: 0,
          //     shadowOpacity: 0,
          //   },
        },
        indicatorStyle: {
          backgroundColor: Color.White,
        },
        // inactiveTintColor: Color.Black,
        // swipeEnabled: false,
      }}
    >
      <Tab.Screen
        name="Books"
        component={SelectBook}
        options={{ tabBarLabel: "Book" }}
        initialParams={{
          selectedBookId: selectedBookId,
          selectedBookName: selectedBookName,
        }}
      />
      <Tab.Screen
        name="Chapters"
        component={SelectChapter}
        options={{ tabBarLabel: "Chapter" }}
        initialParams={{
          selectedBookId: selectedBookId,
          selectedBookName: selectedBookName,
          selectedChapterIndex: selectedChapterIndex,
          selectedChapterNumber: selectedChapterNumber,
          totalChapters: totalChapters,
          getReference: props.params && props.params.getReference,
        }}
      />
      <Tab.Screen
        name="Verses"
        component={SelectVerse}
        options={{ tabBarLabel: "Verse" }}
        initialParams={{
          selectedChapterNumber: selectedChapterNumber,
          totalChapters: totalChapters,
          selectedBookId: selectedBookId,
          selectedVerse: selectedVerse,
          selectedBookName: selectedBookName,
          getReference: props.params && props.params.getReference,
        }}
      />
    </Tab.Navigator>
  );
};

const mapStateToProps = (state) => {
  return {
    bookName: state.updateVersion.bookName,
    bookId: state.updateVersion.bookId,
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    chapterNumber: state.updateVersion.chapterNumber,
    books: state.versionFetch.versionBooks,
    error: state.versionFetch.error,
    isLoading: state.versionFetch.loading,
    selectedVerse: state.updateVersion.selectedVerse,
    sizeFile: state.updateStyling.sizeFile,
    totalChapters: state.updateVersion.totalChapters,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(SelectionTab);