import { StyleSheet } from "react-native";

export const styleFile = () => {
  return StyleSheet.create({
    HistoryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 16,
    },

    headerStyle: {
      backgroundColor: "#3F51B5",
    },
  });
};
