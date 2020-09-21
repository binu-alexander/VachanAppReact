import React, { Component } from 'react';
import {
  Text,
  View,
  Slider,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { List, ListItem, Right, Left } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { settingsPageStyle } from './styles.js'
import { nightColors, dayColors } from '../../utils/colors.js'
import AsyncStorageUtil from '../../utils/AsyncStorageUtil';
import { AsyncStorageConstants } from '../../utils/AsyncStorageConstants'
import { connect } from 'react-redux'
import { updateColorMode, updateFontSize, updateVerseInLine } from '../../store/action/index'
import Color from '../../utils/colorConstants'

class Setting extends Component {
  static navigationOptions = {
    headerTitle: 'Settings',
  };

  constructor(props) {
    super(props);
    this.state = {
      colorMode: this.props.colorMode,
      colorFile: this.props.colorFile,
      sizeMode: this.props.sizeMode,
      sizeFile: this.props.sizeFile,
      verseInLine: this.props.verseInLine
    }
    this.styles = settingsPageStyle(this.props.colorFile, this.props.sizeFile);
  }
  async onChangeSlider(value) {
    await this.props.updateFontSize(value)
    AsyncStorageUtil.setAllItems([
      [AsyncStorageConstants.Keys.SizeMode, JSON.stringify(value)],
    ]);
  }

  async onColorModeChange(value) {
    await this.props.updateColorMode(value)
    AsyncStorageUtil.setAllItems([
      [AsyncStorageConstants.Keys.ColorMode, JSON.stringify(value)],
    ]);
  }

  onVerseInLineModeChange = () => {
    this.setState({ verseInLine: !this.state.verseInLine }, () => {
      this.props.updateVerseInLine(!this.state.verseInLine);
      AsyncStorageUtil.setAllItems([
        [AsyncStorageConstants.Keys.VerseViewMode, JSON.stringify(!this.state.verseInLine)],
      ]);
    })
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      colorMode: nextProps.colorMode,
      sizeMode: nextProps.sizeMode,
      colorFile: nextProps.colorFile,
      sizeFile: nextProps.sizeFile,
      verseInLine: nextProps.verseInLine
    }
  }
  render() {
    this.styles = settingsPageStyle(this.props.colorFile, this.props.sizeFile)
    const dayModeIconColor = this.state.colorMode == AsyncStorageConstants.Values.DayMode ? dayColors.accentColor : Color.Gray
    const nightModeIconColor = this.state.colorMode == AsyncStorageConstants.Values.NightMode ? nightColors.accentColor : Color.Gray

    return (
      <View style={this.styles.container}>
        <View style={this.styles.containerMargin}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <List>
              <ListItem style={this.styles.cardItemStyle}>
                <Left>
                  <Text style={this.styles.textStyle}>
                    Reading Mode
                  </Text>
                </Left>
                <Right>
                  <View
                    style={
                      this.styles.cardItemColumn
                    }>
                    <View style={this.styles.cardItemRow}>
                      <Text
                        style={
                          this.styles.modeTextCustom
                        }>
                        Night
                      </Text>
                      <Icon
                        name="brightness-7"
                        style={this.styles.modeIconCustom}
                        color={nightModeIconColor}
                        onPress={() => this.onColorModeChange(0)}
                      />
                    </View>
                    <View style={this.styles.cardItemRow}>
                      <Text
                        style={
                          this.styles.modeTextCustom
                        }>
                        Day
                      </Text>
                      <Icon
                        name="brightness-5"
                        style={this.styles.modeIconCustom}
                        color={dayModeIconColor}
                        onPress={() => this.onColorModeChange(1)}
                      />
                    </View>
                  </View>
                </Right>
              </ListItem>

              <ListItem bordered style={this.styles.cardItemStyle}>
                <Right style={this.styles.cardItemAlignRight}>
                  <View style={this.styles.cardItemRow}>
                    <Icon name='format-size' style={this.styles.cardItemIconCustom} />
                    <Text style={this.styles.textStyle}>Text Size</Text>
                  </View>
                  <Slider
                    style={this.styles.segmentCustom}
                    step={1}
                    minimumValue={0}
                    maximumValue={4}
                    thumbColor={this.state.colorMode == AsyncStorageConstants.Values.DayMode ? dayModeIconColor : nightModeIconColor}
                    minimumTrackTintColor={this.state.colorMode == AsyncStorageConstants.Values.DayMode ? dayModeIconColor : nightModeIconColor}
                    onValueChange={(value) => { this.onChangeSlider(value) }}
                    value={this.state.sizeMode}
                  />
                </Right>
              </ListItem>
              <ListItem >
                <TouchableOpacity style={[{ flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('LanguageList',{updateLangVer:null})}>
                  <Icon name='cloud-download' style={this.styles.cardItemIconCustom} />
                  <Text style={this.styles.textStyle}>Download More Bibles</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem >
                <TouchableOpacity style={[{ flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('About')}>
                  <Icon name='info' style={this.styles.cardItemIconCustom} />
                  <Text style={this.styles.textStyle}>About</Text>
                </TouchableOpacity>
              </ListItem>
            </List>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    sizeMode: state.updateStyling.sizeMode,
    sizeFile: state.updateStyling.sizeFile,
    colorMode: state.updateStyling.colorMode,
    colorFile: state.updateStyling.colorFile,
    verseInLine: state.updateStyling.verseInLine
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateColorMode: (colorMode) => dispatch(updateColorMode(colorMode)),
    updateFontSize: (sizeMode) => dispatch(updateFontSize(sizeMode)),
    updateVerseInLine: (val) => dispatch(updateVerseInLine(val))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Setting)


