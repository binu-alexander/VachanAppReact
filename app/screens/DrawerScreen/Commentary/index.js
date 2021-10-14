import React, { Component } from 'react';
import {
  FlatList,
  Alert,
  Text,
  View,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { Body, Header, Right, Title, Button, Left } from 'native-base';
import { vachanAPIFetch, fetchVersionBooks } from '../../../store/action/index';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';
import Color from '../../../utils/colorConstants';
import ReloadButton from '../../../components/ReloadButton';
import HTML from 'react-native-render-html';
import vApi from '../../../utils/APIFetch';
import securityVaraibles from '../../../../securityVaraibles';
import SelectContent from "../../../components/Bible/SelectContent";
import constants from '../../../utils/constants';

const commentaryKey = securityVaraibles.COMMENTARY_KEY ? '?key=' + securityVaraibles.COMMENTARY_KEY : ''

class DrawerCommentary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentary: [],
      error: null,
      bookName: this.props.bookName,
      bookNameList: []
    }
    this.styles = styles(this.props.colorFile, this.props.sizeFile)
    this.alertPresent = false
  }
  // fetch bookname in perticular language of commenatry
  async fetchBookName() {
    try {
      let response = await vApi.get('booknames')
      this.setState({ bookNameList: response })
    } catch (error) {
      this.setState({ error: error, bookNameList: [] });
    }
  }

  fetchCommentary() {
    let sourceId = this.props.parallelContentType == 'bible' ? constants.defaultCommentary.sourceId : this.props.parallelLanguage.sourceId
    let url = "commentaries/" + sourceId + "/" + this.props.bookId + "/" + this.props.chapterNumber + commentaryKey
    this.props.vachanAPIFetch(url)
    this.fetchBookName()
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerTitle: () => <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>{this.props.parallelLanguage && (this.props.parallelContentType == 'bible' ? constants.defaultCommentary.versionCode : this.props.parallelLanguage.versionCode)}</Text>,
      headerRight: () =>
        <View style={{paddingHorizontal:10}}>
          <SelectContent
            navigation={this.props.navigation}
            navStyles={navStyles}
            displayContent="commentary"
          />
        </View>

    })
    this.fetchCommentary()
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(" ", prevProps.parallelLanguage)
    if (prevProps.parallelLanguage.sourceId != this.props.parallelLanguage.sourceId) {
      this.fetchCommentary()
    }
  }

  errorMessage() {
    if (!this.alertPresent) {
      this.alertPresent = true;
      if (this.props.error || this.state.error) {
        Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
        if (this.props.parallelLanguage) {
          this.fetchCommentary()
          // const url = "commentaries/" + this.props.parallelLanguage.sourceId + "/" + this.props.bookId + "/" + this.props.chapterNumber + commentaryKey
          // this.props.vachanAPIFetch(url)
        }
      } else {
        this.alertPresent = false;
      }
    }
  }
  updateData = () => {
    this.errorMessage()
  }
  renderItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        {item.verse &&
          (item.verse == 0 ?
            <Text style={this.styles.commentaryHeading}>Chapter Intro</Text> :
            <Text style={this.styles.commentaryHeading}>Verse Number : {item.verse}</Text>
          )}
        <HTML
          baseFontStyle={this.styles.textString}
          tagsStyles={{ p: this.styles.textString }} html={item.text} />
      </View>
    )
  }
  ListHeaderComponent = () => {
    return (
      <View>
        {this.props.commentaryContent && this.props.commentaryContent.bookIntro ?
          <View style={this.styles.cardItemBackground}>
            <Text style={this.styles.commentaryHeading}>Book Intro</Text>
            <HTML
              baseFontStyle={this.styles.textString}
              tagsStyles={{ p: this.styles.textString }} html={this.props.commentaryContent && this.props.commentaryContent.bookIntro} />
          </View> : null}
      </View>
    )

  }
  renderFooter = () => {
    var metadata = this.props.parallelContentType == 'bible' ? constants.defaultCommentaryMd : this.props.parallelMetaData
    return (
      <View style={{ paddingVertical: 20 }}>
        {
          this.props.commentaryContent && this.props.commentaryContent.commentaries && this.props.parallelMetaData &&
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {metadata?.revision !== null && metadata?.revision !== "" && (
              <Text textBreakStrategy={"simple"} style={{ textAlign: 'center' }}>
                <Text>Copyright:</Text>{" "}
                {metadata?.revision}
              </Text>
            )}
            {metadata?.copyrightHolder !== null && metadata?.copyrightHolder !== "" && (
              <Text textBreakStrategy={"simple"} style={{ textAlign: 'center' }}>
                <Text>License:</Text>{" "}
                {metadata?.copyrightHolder}
              </Text>
            )}
            {metadata?.license !== null && metadata?.license !== "" && (
              <Text textBreakStrategy={"simple"} style={{ textAlign: 'center' }}>
                <Text >
                  Technology partner:
                </Text >{" "}
                {metadata?.license}
              </Text>
            )}
          </View>
        }
      </View>
    );
  };
  render() {
    var bookName = null
    if (this.state.bookNameList) {

      for (var i = 0; i <= this.state.bookNameList.length - 1; i++) {
        let parallelLanguage = this.props.parallelLanguage && (this.props.parallelContentType == 'bible' ? constants.defaultCommentary.languageName.toLocaleLowerCase() : this.props.parallelLanguage.languageName.toLowerCase())
        if (this.state.bookNameList[i].language.name === parallelLanguage) {
          for (var j = 0; j <= this.state.bookNameList[i].bookNames.length - 1; j++) {
            var bId = this.state.bookNameList[i].bookNames[j].book_code
            if (bId == this.props.bookId) {
              bookName = this.state.bookNameList[i].bookNames[j].short
            }
          }
        }
      }
    } else {
      return
    }
    return (
      <View style={this.styles.container}>
        {/* <Header style={{ backgroundColor: Color.Blue_Color, height: 40, borderLeftWidth: 0.5, borderLeftColor: Color.White }} >
          <Body>
            <Title style={{ fontSize: 16 }}>{this.props.parallelLanguage && ( this.props.parallelContentType == 'bible' ?  constants.defaultCommentary.versionCode : this.props.parallelLanguage.versionCode)}</Title>
          </Body>
          <Right>
           
          </Right>
        </Header> */}
        {
          (this.props.error) ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ReloadButton
                styles={this.styles}
                reloadFunction={this.updateData}
                message={null}
              />
            </View>
            : (this.props.parallelLanguage == undefined ? null :
              <View style={{ flex: 1 }}>
                <Text style={[this.styles.commentaryHeading, { margin: 10 }]}>{bookName != null && bookName} { } {this.props.commentaryContent && this.props.commentaryContent.chapter}</Text>
                <FlatList
                  data={this.props.commentaryContent && this.props.commentaryContent.commentaries}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1, margin: 16 }}
                  renderItem={this.renderItem}
                  ListFooterComponent={<View style={{ height: 40, marginBottom: 40 }}></View>}
                  ListHeaderComponent={this.ListHeaderComponent}
                  ListFooterComponent={this.renderFooter}
                />
              </View>
            )}
      </View>
    )
  }
}


const mapStateToProps = state => {
  return {
    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    downloaded: state.updateVersion.downloaded,
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    contentType: state.updateVersion.contentType,
    chapterNumber: state.updateVersion.chapterNumber,
    books: state.versionFetch.versionBooks,
    commentaryContent: state.vachanAPIFetch.apiData,
    error: state.vachanAPIFetch.error,
    baseAPI: state.updateVersion.baseAPI,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
    parallelContentType: state.updateVersion.parallelContentType,
  }

}
const mapDispatchToProps = dispatch => {
  return {
    vachanAPIFetch: (payload) => dispatch(vachanAPIFetch(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
  }
}

const navStyles = StyleSheet.create({
  title: {
    color: "#333333",
    flexDirection: "row",
    height: 40,
    // top:0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.Blue_Color,
    zIndex: 0,
    width: "100%",
    // marginBottom:30
  },

  border: {
    paddingHorizontal: 4,
    paddingVertical: 4,

    borderWidth: 0.2,
    borderColor: Color.White,
  },
  headerRightStyle: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: Color.Blue_Color,
  },
  touchableStyleRight: {
    alignSelf: "center",
  },
  titleTouchable: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightdownload: {
    alignSelf: 'flex-end'
  },
  touchableStyleLeft: {
    flexDirection: "row",
    marginHorizontal: 8,
  },
  headerTextStyle: {
    fontSize: 18,
    color: Color.White,
    textAlign: "center",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(DrawerCommentary)