import { StyleSheet } from "react-native";
import Color from "../../../utils/colors";

export const routestyle = (colorFile) => {
  return StyleSheet.create({
    tabLabel: {
      fontSize: 16,
      margin: 0,
      padding: 0,
      color: colorFile.blueText,
    },
    tabBarOptions: {
      borderBottomWidth: 1,
      borderColor: colorFile.blueText,
      backgroundColor: colorFile.backgroundColor,
      height: 36,
    },
    indicatorStyle: {
      backgroundColor: Color.blueText,
    },
  });
};
