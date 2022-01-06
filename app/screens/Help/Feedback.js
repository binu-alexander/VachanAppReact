import React from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";
import { styles } from "./styles.js";
import { connect } from "react-redux";
import Color from "../../utils/colorConstants";

const displaySpinner = () => {
  return (
    <View style={{ flex: 1 }}>
      <ActivityIndicator size="large" color={Color.Blue_Color} />
    </View>
  );
};

const Feedback = (props) => {
  const styleFile = styles(props.colorFile, props.sizeFile);
  return (
    <WebView
      startInLoadingState={true}
      style={styleFile.container}
      source={{
        uri: "https://docs.google.com/forms/d/e/1FAIpQLSd75swOEtsvWrzcQrynmCsu-ZZYktWbeeJXVxH7zNz-JIlEdA/viewform",
      }}
      renderLoading={() => {
        return displaySpinner();
      }}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(Feedback);
