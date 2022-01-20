import React, { Fragment } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from "../utils/colorConstants";

const CustomStatusBar = (props) => {
  return (
    <Fragment>
      {/* <SafeAreaView style={{ flex: 0, backgroundColor:Color.Blue_Color }} /> */}
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.Blue_Color }}>
        {/* <SafeAreaView style={{ flex: 1, backgroundColor:Color.Blue_Color }} >
                <SafeAreaView style={{ flex: 1, backgroundColor:Color.White }} > */}
        <StatusBar barStyle="light-content" />
        {props.children}
      </SafeAreaView>
    </Fragment>
  );
};

export default CustomStatusBar;
