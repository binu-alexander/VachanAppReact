import { StyleSheet } from "react-native";

export const AudioListStyle = (colorFile, sizeFile) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorFile.backgroundColor,
      padding: 8,
    },
    audioView: {
      width: "100%",
      fontSize: sizeFile.fontSize,
    },
    audioText: {
      fontSize: sizeFile.titleText,
      color: colorFile.iconColor,
    },
    cardItemStyle: {
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: colorFile.backgroundColor,
    },
    messagContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    emptyMessageIcon: {
      fontSize: sizeFile.emptyIconSize,
      color: colorFile.iconColor,
    },
  });
};
