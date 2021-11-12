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
import { styles } from './styles.js'
import { nightColors, dayColors } from '../../utils/colors.js'
import { connect } from 'react-redux'
import { updateColorMode, updateFontSize, updateVerseInLine } from '../../store/action/index'
import Color from '../../utils/colorConstants'

class Setting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      colorMode: this.props.colorMode,
      colorFile: this.props.colorFile,
      sizeMode: this.props.sizeMode,
      sizeFile: this.props.sizeFile,
      verseInLine: this.props.verseInLine
    }

  }
  async onChangeSlider(value) {
    await this.props.updateFontSize(value)
  }

  // async onColorModeChange(value) {
  //   await this.props.updateColorMode(value)
  // }

  onVerseInLineModeChange = () => {
    this.setState({ verseInLine: !this.state.verseInLine }, () => {
      this.props.updateVerseInLine(!this.state.verseInLine);
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
    const dayModeIconColor = this.state.colorMode == 1 ? dayColors.accentColor : Color.Gray
    const nightModeIconColor = this.state.colorMode == 0 ? nightColors.accentColor : Color.Gray

    return (
      <View style={styles.container}>
        <View style={styles.containerMargin}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <List>
              <ListItem style={styles.cardItemStyle}>
                <Left>
                  <Text style={styles.textStyle}>
                    Reading Mode
                  </Text>
                </Left>
                <Right>
                  <View
                    style={
                      styles.cardItemColumn
                    }>
                    <View style={styles.cardItemRow}>
                      <Text
                        style={
                          styles.modeTextCustom
                        }>
                        Night
                      </Text>
                      <Icon
                        name="brightness-7"
                        style={styles.modeIconCustom}
                        color={nightModeIconColor}
                        onPress={() => this.props.updateColorMode(0)}
                      />
                    </View>
                    <View style={styles.cardItemRow}>
                      <Text
                        style={
                          styles.modeTextCustom
                        }>
                        Day
                      </Text>
                      <Icon
                        name="brightness-5"
                        style={styles.modeIconCustom}
                        color={dayModeIconColor}
                        onPress={() => this.props.updateColorMode(1)}
                      />
                    </View>
                  </View>
                </Right>
              </ListItem>
              <ListItem bordered style={styles.cardItemStyle}>
                <Right style={styles.cardItemAlignRight}>
                  <View style={styles.cardItemRow}>
                    <Icon name='format-size' style={styles.cardItemIconCustom} />
                    <Text style={styles.textStyle}>Text Size</Text>
                  </View>
                  <Slider
                    style={styles.segmentCustom}
                    step={1}
                    minimumValue={0}
                    maximumValue={4}
                    thumbColor={this.state.colorMode == 1? dayModeIconColor : nightModeIconColor}
                    minimumTrackTintColor={this.state.colorMode == 1 ? dayModeIconColor : nightModeIconColor}
                    onValueChange={(value) => { this.onChangeSlider(value) }}
                    value={this.state.sizeMode}
                  />
                </Right>
              </ListItem>
              <ListItem >
                <TouchableOpacity style={[{ flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('LanguageList',{updateLangVer:null})}>
                  <Icon name='cloud-download' style={styles.cardItemIconCustom} />
                  <Text style={styles.textStyle}>Download More Bibles</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem >
                <TouchableOpacity style={[{ flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('About')}>
                  <Icon name='info' style={styles.cardItemIconCustom} />
                  <Text style={styles.textStyle}>About</Text>
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


