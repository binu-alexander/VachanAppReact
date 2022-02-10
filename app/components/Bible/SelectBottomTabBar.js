import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BibleScreenContext } from "../../BibleContext/bibleScreen";
import Color from "../../utils/colorConstants";
import { bibleContext } from "../../screens/Bible";

const SelectBottomTabBar = () => {
  const [{ styles, doHighlight,showColorGrid,addToNotes,addToShare }] = useContext(bibleContext);
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
