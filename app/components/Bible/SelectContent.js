import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Alert, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



import { Card, Accordion } from 'native-base'
import { updateContentType, fetchAllContent, fetchVersionBooks, parallelMetadta } from '../../store/action/'
import { styles } from '../../screens/LanguageList/styles'
import { connect } from 'react-redux'
import Color from '../../utils/colorConstants'


var contentType = ''
class SelectContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isExpanded: false,
    }
    this.alertPresent = false
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    this.alertPresent = false
  }

  _renderHeader = (item, expanded) => {
    var value = expanded && item.contentType
    if (value) {
      contentType = value
    }
    return (
      <View style={this.styles.accordionHeader}>
        <Text style={this.styles.accordionHeaderText} >
          {" "}{item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1)}

        </Text>
        <Icon style={this.styles.iconStyleSelection} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} />
      </View>
    )
  }
  _renderHeaderInner = (item, expanded) => {
    return (
      <View style={this.styles.headerInner} >
        <Text style={this.styles.selectionHeaderModal}>
          {" "}{item.languageName}
        </Text>
        <Icon style={this.styles.iconStyleSelection} name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} />
      </View>
    )
  }

  _renderContentInner = (item) => {
    return (
      item.versionModels.map(v =>
        <TouchableOpacity
          style={this.styles.selectionInnerContent}
          onPress={() => {
            this.props.navigation.setParams({ modalVisible: false, visibleParallelView: true,
              parallelLanguage:{languageName:item.languageName,versionCode:v.versionCode,sourceId:v.sourceId},
              parallelMetaData:v.metaData[0]
            });
            this.props.updateContentType({
              parallelContentType: contentType
            })
          }}

        >
          <Text style={this.styles.selectionHeaderModal}>{v.versionName}</Text>
          <Text style={this.styles.selectionHeaderModal}>{v.versionCode}</Text>
        </TouchableOpacity>)
    )
  }

  _renderContent = (item) => {
    return (
      <Accordion
        dataArray={item.content}
        animation={true}
        expanded={true}
        renderHeader={this._renderHeaderInner}
        renderContent={this._renderContentInner}
      />
    )
  }

  errorMessage() {
    // if(this.props.netConnection){
      if (!this.alertPresent) {
        this.alertPresent = true;
        if (this.props.error ||
          this.props.availableContents[0].content.length === 0 ||
          this.props.availableContents[1].content.length === 0 
        ) {
          console.log("select content api error ",this.props.erorr )
          this.props.navigation.setParams({ modalVisible: false })
          Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
          this.props.fetchAllContent()
        } else {
          this.props.navigation.setParams({ modalVisible: !this.props.visible })
          this.alertPresent = false;
        }
      }
    // }else{
    //   Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
    // }

  }
  onPressModal = () => {
    this.errorMessage()
  }
  render() {
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.visible}
          onPress={() => { this.props.navigation.setParams({ modalVisible: this.props.visible }) }}
        >
          <View>
            <TouchableWithoutFeedback
              style={this.styles.modalContainer}
              onPressOut={() => { this.props.navigation.setParams({ modalVisible: false }) }}
            >
              <View style={{ height: '80%', width: '70%', alignSelf: 'flex-end' }}>
                <Card style={{ marginTop: 40 }}>
                {this.props.availableContents.length > 0 &&
                  <Accordion
                    dataArray={this.props.availableContents}
                    animation={true}
                    expanded={true}
                    renderHeader={this._renderHeader}
                    renderContent={this._renderContent}
                  />}
                </Card>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>

        <TouchableOpacity onPress={this.onPressModal} style={this.props.navStyles.touchableStyleRight}>
          <MaterialCommunityIcons
            name='book-open-variant'
            color={Color.White}
            size={26}
          />
        </TouchableOpacity>
      </View>

    )
  }
}

const mapStateToProps = state => {
  return {
    availableContents: state.contents.contentLanguages,
    error: state.contents.error,
    contentType: state.updateVersion.parallelContentType,
    baseAPI: state.updateVersion.baseAPI,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    netConnection:state.updateStyling.netConnection,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateContentType: (content) => dispatch(updateContentType(content)),
    fetchAllContent: (value) => dispatch(fetchAllContent(value)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    parallelMetadta: (payload) => dispatch(parallelMetadta(payload)),

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectContent)