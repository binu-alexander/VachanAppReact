import React, { Fragment } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from "../utils/colorConstants";

const CustomStatusBar = (props) => {
  return (
    <Fragment>
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.Blue_Color }}>
        <StatusBar barStyle="light-content" />
        {props.children}
      </SafeAreaView>
    </Fragment>
  );
};

export default CustomStatusBar;
