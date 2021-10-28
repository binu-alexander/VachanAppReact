
import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Alert, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons'
import { Card, Accordion } from 'native-base'
import { updateContentType, parallelVisibleView, fetchAllContent, fetchVersionBooks, parallelMetadta, selectContent } from '../../store/action/'
import { styles } from '../../screens/LanguageList/styles'
import { connect } from 'react-redux'
import Color from '../../utils/colorConstants'

var contentType = ''
class SelectContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      modalVisible: false
    }
    this.alertPresent = false
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    this.alertPresent = false
  }

  _renderHeader = (item, expanded) => {
    var value = expanded && item.contentType;
    if (value) {
      contentType = value;
    }
    return (
      <View >
        {this.props.displayContent == 'commentary' ?
          ((item.contentType == this.props.displayContent) &&
            <View style={this.styles.accordionHeader}>
              <Text style={this.styles.accordionHeaderText}>
                {" "}{(item.contentType == this.props.displayContent) && item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1)}
              </Text>
              <Icon style={this.styles.iconStyleSelection} name="keyboard-arrow-down" size={24} />
            </View>
          )
          : <View style={this.styles.accordionHeader}>
            <Text style={this.styles.accordionHeaderText}>
              {" "}{item.contentType.charAt(0).toUpperCase() + item.contentType.slice(1)}
            </Text>
            <Icon style={this.styles.iconStyleSelection} name="keyboard-arrow-down" size={24} />
          </View>
        }
      </View>
    );
  };
  _renderHeaderInner = (item, expanded) => {
    return (
      <View>
        {this.props.displayContent == 'commentary' ?
          ((contentType == this.props.displayContent) &&
            <View style={this.styles.headerInner} >
              <Text style={this.styles.selectionHeaderModal}>
                {" "}{item.languageName}
              </Text>
              <Icon style={this.styles.iconStyleSelection} name="keyboard-arrow-down" size={24} />
            </View>
          )
          :
          <View style={this.styles.headerInner} >
            <Text style={this.styles.selectionHeaderModal}>
              {" "}{item.languageName}
            </Text>
            <Icon style={this.styles.iconStyleSelection} name="keyboard-arrow-down" size={24} />
          </View>
        }
      </View>

    )
  }

  _renderContentInner = (item) => {
    return (
      item.versionModels.map(v =>
        this.props.displayContent == 'commentary' ?
          ((contentType == this.props.displayContent) &&
            <TouchableOpacity
              style={this.styles.selectionInnerContent}
              onPress={() => {
                this.setState({ modalVisible: false })
                this.props.parallelVisibleView({
                  modalVisible: false,
                  visibleParallelView: false,
                })
                this.props.selectContent({
                  parallelLanguage: {
                    languageName: item.languageName, versionCode: v.versionCode,
                    sourceId: v.sourceId
                  },
                  parallelMetaData: v.metaData[0],
                })
                this.props.updateContentType({
                  parallelContentType: contentType
                })
              }}
            >
              <Text style={this.styles.selectionHeaderModal}>{v.versionName}</Text>
              <Text style={this.styles.selectionHeaderModal}>{v.versionCode}</Text>
            </TouchableOpacity>
          ) :
          <TouchableOpacity
            style={this.styles.selectionInnerContent}
            onPress={() => {
              this.setState({ modalVisible: false })
              this.props.parallelVisibleView({
                modalVisible: false,
                visibleParallelView: true,
              })
              this.props.selectContent({
                parallelLanguage: {
                  languageName: item.languageName, versionCode: v.versionCode,
                  sourceId: v.sourceId
                },
                parallelMetaData: v.metaData[0]
              })
              this.props.updateContentType({
                parallelContentType: contentType
              })
            }}
          >
            <Text style={this.styles.selectionHeaderModal}>{v.versionName}</Text>
            <Text style={this.styles.selectionHeaderModal}>{v.versionCode}</Text>
          </TouchableOpacity>

      )
    )
  }

  _renderContent = (item) => {
    return (
      <Accordion
        dataArray={item.content}
        animation={true}
        expanded={[0]}
        renderHeader={this._renderHeaderInner}
        renderContent={this._renderContentInner}
      />
    );
  };

  errorMessage() {
    // if(this.props.netConnection){
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.props.error ||
        this.props.availableContents.length == 0 ||
        this.props.availableContents.length == 0
      ) {
        this.setState({ modalVisible: false })
        Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
        this.props.fetchAllContent()
      } else {
        this.setState({ modalVisible: !this.state.modalVisible })
        this.alertPresent = false;
      }
    }
    // }else{
    //   Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
    // }
  }
  onPressModal = () => {
    this.errorMessage();
  };
  render() {
    console.log(" PROPS ", this.props.availableContents)
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onPress={() => { this.setState({ modalVisible: !this.state.modalVisible }) }}
        >
          <View>
            <TouchableWithoutFeedback
              style={this.styles.modalContainer}
              onPressOut={() => { this.setState({ modalVisible: false }) }}
            >
              <View
                style={{ height: "80%", width: "70%", alignSelf: "flex-end" }}
              >
                <Card style={{ marginTop: 40 }}>
                  {this.props.availableContents.length > 0 &&
                    <Accordion
                      dataArray={this.props.availableContents}
                      animation={true}
                      expanded={[0]}
                      renderHeader={this._renderHeader}
                      renderContent={this._renderContent}
                    />}
                </Card>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={this.onPressModal}
          style={this.props.navStyles.touchableStyleRight}>
          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            {this.props.title ? <Text style={{ color: Color.White,fontSize:18,fontWeight:'normal' }}>{this.props.title}</Text> : null}
            {
              this.props.iconName ?
                <MaterialCommunityIcons
                  name={this.props.iconName}
                  color={Color.White}
                  size={26}
                /> : null
            }

          </View>

        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    availableContents: state.contents.contentLanguages,
    error: state.contents.error,
    contentType: state.updateVersion.parallelContentType,
    baseAPI: state.updateVersion.baseAPI,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    netConnection: state.updateStyling.netConnection,
    modalVisible: state.selectContent.modalVisible,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateContentType: (content) => dispatch(updateContentType(content)),
    fetchAllContent: (value) => dispatch(fetchAllContent(value)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    parallelMetadta: (payload) => dispatch(parallelMetadta(payload)),
    selectContent: (payload) => dispatch(selectContent(payload)),
    parallelVisibleView: (payload) => dispatch(parallelVisibleView(payload)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SelectContent)
