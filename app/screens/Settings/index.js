import React from "react";
import { Text, View, Slider, TouchableOpacity, ScrollView } from "react-native";
import { List, ListItem, Right, Left } from "native-base";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles.js";
import { nightColors, dayColors } from "../../utils/colors.js";
import { connect } from "react-redux";
import {
  updateColorMode,
  updateFontSize,
  updateVerseInLine,
} from "../../store/action/index";
import Color from "../../utils/colorConstants";

const Setting = (props) => {
  const colorMode = props.colorMode;
  const sizeMode = props.sizeMode;
  // const [verseInLine, setVerseLine] = useState(props.verseInLine);
  const style = styles(props.colorFile, props.sizeFile);
  async function onChangeSlider(value) {
    await props.updateFontSize(value);
  }
  // async function onColorModeChange(value) {
  //   await props.updateColorMode(value);
  // }
  const dayModeIconColor = colorMode == 1 ? dayColors.accentColor : Color.Gray;
  const nightModeIconColor =
    colorMode == 0 ? nightColors.accentColor : Color.Gray;

  // const onVerseInLineModeChange = () => {
  //   setVerseLine({ verseInLine: !verseInLine }, () => {
  //     props.updateVerseInLine(!verseInLine);
  //   });
  // };
  Setting.getDerivedStateFromProps = (nextProps) => {
    return {
      colorMode: nextProps.colorMode,
      sizeMode: nextProps.sizeMode,
      colorFile: nextProps.colorFile,
      sizeFile: nextProps.sizeFile,
      verseInLine: nextProps.verseInLine,
    };
  };

  return (
    <View style={style.container}>
      <View style={style.containerMargin}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <List>
            <ListItem style={style.cardItemStyle}>
              <Left>
                <Text style={style.textStyle}>Reading Mode</Text>
              </Left>
              <Right>
                <View style={style.cardItemColumn}>
                  <View style={style.cardItemRow}>
                    <Text style={style.modeTextCustom}>Night</Text>
                    <Icon
                      name="brightness-7"
                      style={style.modeIconCustom}
                      color={nightModeIconColor}
                      onPress={() => props.updateColorMode(0)}
                    />
                  </View>
                  <View style={style.cardItemRow}>
                    <Text style={style.modeTextCustom}>Day</Text>
                    <Icon
                      name="brightness-5"
                      style={style.modeIconCustom}
                      color={dayModeIconColor}
                      onPress={() => props.updateColorMode(1)}
                    />
                  </View>
                </View>
              </Right>
            </ListItem>
            <ListItem bordered style={style.cardItemStyle}>
              <Right style={style.cardItemAlignRight}>
                <View style={style.cardItemRow}>
                  <Icon name="format-size" style={style.cardItemIconCustom} />
                  <Text style={style.textStyle}>Text Size</Text>
                </View>
                <Slider
                  style={style.segmentCustom}
                  step={1}
                  minimumValue={0}
                  maximumValue={4}
                  thumbColor={
                    colorMode == 1 ? dayModeIconColor : nightModeIconColor
                  }
                  minimumTrackTintColor={
                    colorMode == 1 ? dayModeIconColor : nightModeIconColor
                  }
                  onValueChange={(value) => {
                    onChangeSlider(value);
                  }}
                  value={sizeMode}
                />
              </Right>
            </ListItem>
            <ListItem>
              <TouchableOpacity
                style={[{ flexDirection: "row" }]}
                onPress={() =>
                  props.navigation.navigate("LanguageList", {
                    updateLangVer: null,
                  })
                }
              >
                <Icon name="cloud-download" style={style.cardItemIconCustom} />
                <Text style={style.textStyle}>Download More Bibles</Text>
              </TouchableOpacity>
            </ListItem>
            <ListItem>
              <TouchableOpacity
                style={[{ flexDirection: "row" }]}
                onPress={() => props.navigation.navigate("About")}
              >
                <Icon name="info" style={style.cardItemIconCustom} />
                <Text style={style.textStyle}>About</Text>
              </TouchableOpacity>
            </ListItem>
          </List>
        </ScrollView>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    sizeMode: state.updateStyling.sizeMode,
    sizeFile: state.updateStyling.sizeFile,
    colorMode: state.updateStyling.colorMode,
    colorFile: state.updateStyling.colorFile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateColorMode: (colorMode) => dispatch(updateColorMode(colorMode)),
    updateFontSize: (sizeMode) => dispatch(updateFontSize(sizeMode)),
    updateVerseInLine: (val) => dispatch(updateVerseInLine(val)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Setting);
