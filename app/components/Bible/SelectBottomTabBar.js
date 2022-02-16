import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Color from "../../utils/colorConstants";
import { LoginData } from "../../context/LoginDataProvider";
import { BibleMainContext } from "../../screens/Bible";
const SelectBottomTabBar = () => {
  const [{ styles }] = useContext(BibleMainContext);
  const {
    showColorGrid,
    doHighlight,
    addToShare,
    addToNotes,
    bottomHighlightText,
  } = useContext(LoginData);

  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomOption}>
        <TouchableOpacity
          onPress={bottomHighlightText == true ? showColorGrid : doHighlight}
        >
          <Text style={styles.bottomOptionText}>
            {bottomHighlightText == true ? "HIGHLIGHT" : "REMOVE HIGHLIGHT"}
          </Text>
          <Icon
            name={"border-color"}
            color={Color.White}
            size={24}
            style={styles.bottomOptionIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomOptionSeparator} />

      <View style={styles.bottomOption}>
        <TouchableOpacity onPress={addToNotes}>
          <Text style={styles.bottomOptionText}>NOTES</Text>
          <Icon
            name={"note"}
            color={Color.White}
            size={24}
            style={styles.bottomOptionIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomOptionSeparator} />

      <View style={styles.bottomOption}>
        <TouchableOpacity onPress={addToShare}>
          <Text style={styles.bottomOptionText}>SHARE</Text>
          <Icon
            name={"share"}
            color={Color.White}
            size={24}
            style={styles.bottomOptionIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomOptionSeparator} />
    </View>
  );
};

export default SelectBottomTabBar;
