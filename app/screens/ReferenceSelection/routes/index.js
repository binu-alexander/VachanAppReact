import React, { Component } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SelectBook from "../SelectBook/";
import SelectChapter from "../SelectChapter";
import Color from "../../../utils/colorConstants";
import SelectVerse from "../VerseSelection";

const Tab = createMaterialTopTabNavigator();

export default class SelectionTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBookId: this.props.params ? this.props.params.bookId : null,
      selectedBookName: this.props.params ? this.props.params.bookName : null,
      totalChapters: this.props.params ? this.props.params.totalChapters : null,
      selectedChapterIndex: 0,
      selectedChapterNumber: this.props.params
        ? this.props.params.chapterNumber
        : null,
      selectedVerse: this.props.params ? this.props.params.selectedVerse : null,
    };
  }

  render() {
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
          options={{ tabBarLabel: "Select Book" }}
          initialParams={{
            selectedBookId: this.state.selectedBookId,
            selectedBookName: this.state.selectedBookName,
          }}
        />
        <Tab.Screen
          name="Chapters"
          component={SelectChapter}
          options={{ tabBarLabel: "Select Chapter" }}
          initialParams={{
            selectedBookId: this.state.selectedBookId,
            selectedBookName: this.state.selectedBookName,
            selectedChapterIndex: this.state.selectedChapterIndex,
            selectedChapterNumber: this.state.selectedChapterNumber,
            totalChapters: this.state.totalChapters,
          }}
        />
        <Tab.Screen
          name="Verses"
          component={SelectVerse}
          options={{ tabBarLabel: "Select Verse" }}
          initialParams={{
            selectedChapterNumber: this.state.selectedChapterNumber,
            totalChapters: this.state.totalChapters,
            selectedBookId: this.state.selectedBookId,
            selectedVerse: this.state.selectedVerse,
            selectedBookName: this.state.selectedBookName,
            getReference: this.props.params && this.props.params.getReference,
          }}
        />
      </Tab.Navigator>
    );
  }
}
