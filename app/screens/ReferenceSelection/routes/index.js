import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectBook from "../SelectBook/";
import SelectChapter from "../SelectChapter";
import Color from "../../../utils/colorConstants";
import SelectVerse from "../VerseSelection";

const Tab = createMaterialTopTabNavigator();
const SelectionTab = (props) => {
  const selectedBookId = props.params ? props.params.bookId : null;
  const selectedBookName = props.params ? props.params.bookName : null;
  const totalChapters = props.params ? props.params.totalChapters : null;
  const selectedChapterIndex = 0;
  const selectedChapterNumber = props.params
    ? props.params.chapterNumber
    : null;
  const selectedVerse = props.params ? props.params.selectedVerse : null;

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
export default SelectionTab;
