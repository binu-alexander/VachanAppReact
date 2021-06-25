import React, { Component } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import ModalDropdown from 'react-native-modal-dropdown';
import { Header, Title, Button, Left, Right, Body } from "native-base";
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { OBSStyle } from './styles.js'
import Color from '../../../utils/colorConstants';
const Github_URL = 'https://raw.githubusercontent.com/Bridgeconn/vachancontentrepository/master/obs/'

class OBS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languagesList: [],
      langCode: this.props.languageCode,
      langCodeObj: {},
      obsData: null,
      obsLang: [],
      storyList: [],
      bsIndex: '01',
      defaultLanguage: this.props.languageName && this.props.languageName.charAt(0).toUpperCase() + this.props.languageName.slice(1)
    }
    this.styles = OBSStyle(this.props.colorFile, this.props.sizeFile);

  }
  componentDidMount() {
    this.fetchLangList()
  }
  fetchLangList() {
    try {
      fetch(Github_URL + 'languages.json')
        .then((response) => response.json())
        .then((json) => {
          // console.log("JSON RES LANG",json)
          let obslangList = []
          let foundLangCode = false
          for (var key in json) {
            obslangList.push(json[key])
            if (key == this.state.langCode) {
              foundLangCode = true
              this.setState({ langCode: key, defaultLanguage: json[key] })
              fetch(Github_URL + this.state.langCode + '/manifest.json')
                .then((response) => response.json())
                .then((json) => {
                  let storyList = []
                  for (var i = 0; i < json.length; i++) {
                    storyList.push(i + 1 + ' ' + json[i])
                  }
                  // console.log("MENIFEST res",json)
                  this.setState({ storyList })
                })
                .catch((error) => { console.log("MANIFEST DIDMOUNT", error) })
              fetch(Github_URL + this.state.langCode + '/content/' + this.state.bsIndex + '.md')
                .then((response) => response.text())
                .then((json) => {
                  // console.log("CONTENT res",json)
                  this.setState({ obsData: json })
                })
                .catch((error) => { console.log("CONTENT DID MOUNT ", error) })
            }
          }
          if (!foundLangCode) {
            this.setState({ langCode: null })
          }
          this.setState({ obsLang: obslangList, languagesList: [...this.state.languagesList, json] })
        })
        .catch((error) => { "LANGUAGE LIST", console.log(error) })
    } catch (erorr) {
      console.log("ERROR ")
    }

  }
  mdFileFetch() {
    fetch(Github_URL + this.state.langCode + '/content/' + this.state.bsIndex + '.md')
      .then((response) => response.text())
      .then((json) => { this.setState({ obsData: json }) })
      .catch((error) => { console.log("CONTENT  ", error) })
  }
  bibleStoryList() {
    fetch(Github_URL + this.state.langCode + '/manifest.json')
      .then((response) => response.json())
      .then((json) => {
        let storyList = []
        for (var i = 0; i < json.length; i++) {
          storyList.push(i + 1 + ' ' + json[i])
        }
        this.setState({ storyList })
      })
      .catch((error) => { console.log("MANIFEST ", error) })
  }

  onSelectLang = (index, lang) => {
    for (var key in this.state.languagesList[0]) {
      if (this.state.languagesList[0][key] == lang) {
        this.setState({ langCode: key }, () => {
          this.mdFileFetch()
          this.bibleStoryList()
          let selectedStoryIndex = this.state.bsIndex.replace(/^0+/, '')
          this._dropdown_2.select(parseInt(selectedStoryIndex - 1))
        })
      }
    }
  }

  onSelectStory = (index, val) => {
    let num = index + 1
    let bsIndex = ('0' + num).slice(-2)
    this.setState({ bsIndex }, () => {
      this.mdFileFetch()
    })
  }

  componentDidUpdate(prevState) {
    if (prevState.storyList != this.state.storyList) {
      let selectedStoryIndex = this.state.bsIndex.replace(/^0+/, '')
      this._dropdown_2.select(parseInt(selectedStoryIndex - 1))
    }
  }
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <Header>
          <Left>
            <Button transparent>
              <Icon name='arrow-back' color={"#fff"} size={24} onPress={() => { this.props.navigation.pop() }} />
            </Button>
          </Left>
          <Body style={{ flexDirection: 'row' }}>
            <ModalDropdown options={this.state.obsLang} onSelect={this.onSelectLang} style={this.styles.modalStye} defaultValue={this.state.defaultLanguage} isFullWidth={true} dropdownStyle={{ padding: 10, width: '60%', height: '70%' }} dropdownTextStyle={{ fontSize: 18 }} textStyle={{ fontSize: 18, fontWeight: '400', color: '#fff' }} />
            <Icon name="arrow-drop-down" color={Color.White} size={20} />
          </Body>
          <Right>
            <ModalDropdown ref={el => this._dropdown_2 = el} options={this.state.storyList} onSelect={this.onSelectStory} style={{ paddingRight: 20 }} defaultValue={this.state.storyList[0]} isFullWidth={true} dropdownStyle={{ padding: 10, width: '60%', height: '70%' }} dropdownTextStyle={{ fontSize: 18 }} textStyle={{ fontSize: 18, fontWeight: '400', color: '#fff' }} />
            <Icon name="arrow-drop-down" color={Color.White} size={20} />
          </Right>
        </Header>
        {this.state.langCode ?
          <SafeAreaView style={this.styles.container}>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={{ height: '100%' }}
            >
              <Markdown
                style={this.styles}>
                {this.state.obsData}
              </Markdown>
            </ScrollView>
          </SafeAreaView> :
          <View style={this.styles.emptyMessageContainer}>
            <Icon name="image" style={this.styles.emptyMessageIcon} />
            <Text style={this.styles.messageEmpty}>
              Bible story for {this.props.languageName} not available{'\n'} Please select Language from header
            </Text>
          </View>
        }
      </>
    );
  }

};
const mapStateToProps = state => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}

export default connect(mapStateToProps, null)(OBS)
