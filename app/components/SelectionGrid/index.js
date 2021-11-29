import React from "react";

import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Color from "../../utils/colorConstants";

const SelectionGrid = ({
  styles,
  onNumPress,
  numbers,
  loader,
  selectedNumber,
  blueText,
  textColor,
}) => (
  <View style={styles.chapterSelectionContainer}>
    {loader && <Spinner visible={true} textContent={"Loading..."} />}
    <FlatList
      numColumns={4}
      data={numbers}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={[styles.selectGridNum, { backgroundColor: Color.Transparent }]}
          onPress={() => {
            onNumPress(item, index);
          }}
        >
          <View>
            <Text
              style={[
                styles.chapterNum,
                {
                  fontWeight: item == selectedNumber ? "bold" : "normal",
                  color: item == selectedNumber ? blueText : textColor,
                },
              ]}
            >
              {item}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ListFooterComponent={<View style={{ marginBottom: 84 }} />}
    />
  </View>
);
export default SelectionGrid;
