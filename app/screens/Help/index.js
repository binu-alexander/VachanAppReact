import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Card, CardItem } from "native-base";
import { styles } from "./styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

const Help = (props) => {
  const style = styles(props.colorFile, props.sizeFile);
  return (
    <View style={[style.container, { padding: 8 }]}>
      <Card style={style.Card}>
        <TouchableOpacity
          style={[{ flexDirection: "row" }]}
          onPress={() => props.navigation.navigate("Hints")}
        >
          <CardItem style={style.Card}>
            <Icon name="lightbulb-outline" style={style.cardItemIconCustom} />
            <Text style={style.textStyle}>Hints</Text>
          </CardItem>
        </TouchableOpacity>
      </Card>
      <Card style={style.Card}>
        <TouchableOpacity
          style={[{ flexDirection: "row" }]}
          onPress={() => props.navigation.navigate("Feedback")}
        >
          <CardItem style={style.Card}>
            <Icon name="feedback" style={style.cardItemIconCustom} />
            <Text style={style.textStyle}>Feedback</Text>
          </CardItem>
        </TouchableOpacity>
      </Card>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(Help);
