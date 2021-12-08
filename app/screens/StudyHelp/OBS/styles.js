import { StyleSheet,Dimensions } from "react-native";
// const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const styles = (colorFile, sizeFile) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorFile.backgroundColor,
    },
    textStyle: {
      fontSize: sizeFile.contentText,
      color: colorFile.textColor,
      fontWeight: "400",
    },
    dropdownTextStyle: {
      fontSize: sizeFile.titleText,
      color: colorFile.textColor,
    },
    modalStyle: {
      alignSelf: "flex-end",
      width: 150,
      marginTop: 32,
      right: 8,
      padding: 10,
      borderWidth: 0,
      borderRadius: 3,
      backgroundColor: colorFile.blueText,
    },
    modalStyle2: {
      alignSelf: "flex-start",
      width: 150,
      marginTop: 32,
      left: 8,
      padding: 10,
      borderWidth: 0,
      borderRadius: 3,
      backgroundColor: colorFile.blueText,
    },
    dropdownStyle: {
      padding: 10,
      width: "60%",
      height: "70%",
      backgroundColor: colorFile.backgroundColor,
    },
    body: {
      color: colorFile.textColor,
      lineHeight: sizeFile.lineHeight,
      fontSize: sizeFile.contentText,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: colorFile.textColor,
      lineHeight: sizeFile.lineHeight,
      fontSize: sizeFile.contentText,
    },
    code_block: { color: colorFile.textColor, fontSize: sizeFile.contentText },
    emptyMessageContainer: {
      flex: 1,
      backgroundColor: colorFile.backgroundColor,
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
    },
    messageEmpty: {
      fontSize: sizeFile.titleText,
      color: colorFile.textColor,
      textAlign: "center",
    },
    emptyMessageIcon: {
      fontSize: sizeFile.emptyIconSize,
      margin: 16,
      color: colorFile.iconColor,
    },
    centerEmptySet: {
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    dropdownView:{
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    dropdownPos:{
      padding: 10,
      margin: 10,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderColor: colorFile.iconColor,
      borderWidth: 0.5,
    },
    dropdownSize:{ width: "60%", height: height / 2 },
    dropdownText:{
      paddingHorizontal: 8,
      fontSize: 18,
      fontWeight: "400",
      color: colorFile.textColor,
    },
    loaderPos:{ flex: 1, justifyContent: "center", alignSelf: "center" },
    scrollView:{ paddingHorizontal: 12, height: "100%" }
    
  });
};
