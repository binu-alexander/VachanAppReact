import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import FlowLayout from '../../components/FlowLayout';
import { CommonActions } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/stack';
import { noteStyle } from './styles.js';
import { connect } from 'react-redux';
import database from '@react-native-firebase/database';
import Color from '../../utils/colorConstants';
import { getBookChaptersFromMapping } from '../../utils/UtilFunctions';
import { updateVersionBook } from '../../store/action/';

class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteIndex: this.props.route.params.noteIndex,
      noteObject: this.props.route.params.notesList,
      bcvRef: this.props.route.params.bcvRef,
      isLoading: false,
      contentBody: tthis.props.route.params.contentBody,
      modalVisible: false,
    }
    this.styles = noteStyle(props.colorFile, props.sizeFile);
  }
  saveNote = async () => {
    var time = Date.now()

    var firebaseRef = database().ref("users/" + this.props.uid + "/notes/" + this.props.sourceId + "/" + this.state.bcvRef.bookId)

    if (this.state.contentBody == '') {
      alert(" Note should not be empty")
    }
    else {
      var edit = database().ref("users/" + this.props.uid + "/notes/" + this.props.sourceId + "/" + this.state.bcvRef.bookId + "/" + this.state.bcvRef.chapterNumber)
      if (this.state.noteIndex != -1) {
        var updates = {}
        updates["/" + this.state.noteIndex] = {
          createdTime: time,
          modifiedTime: time,
          body: this.state.contentBody,
          verses: this.state.bcvRef.verses
        }
        edit.update(updates)
      }
      else {
        var notesArray = this.state.noteObject.concat({
          createdTime: time,
          modifiedTime: time,
          body: this.state.contentBody,
          verses: this.state.bcvRef.verses
        })
        var updates = {}
        updates[this.state.bcvRef.chapterNumber] = notesArray
        firebaseRef.update(updates)
      }
      this.props.route.params.onbackNote()
      this.props.navigation.pop()
    }
  }

  showAlert() {
    Alert.alert(
      'Save Changes ? ',
      'Do you want to save the note ',
      [
        { text: 'Cancel', onPress: () => { return } },
        { text: 'No', onPress: () => { this.props.navigation.dispatch(NavigationActions.back()) } },
        { text: 'Yes', onPress: () => this.saveNote() },
      ],
    )
  }

  onBack = async () => {
    if (this.state.noteIndex == -1) {
      if (this.state.contentBody == '') {
      }
      this.showAlert();
      return
    }
    else {
      if (this.state.contentBody !== this.props.route.params.contentBody
        || this.state.bcvRef.verses.length !== this.props.route.params.bcvRef.verses.length
      ) {
        this.showAlert();
        return
      }
      this.props.navigation.dispatch(CommonActions.goBack());
    }

  }
  componentDidMount() {
    this.props.navigation.setOptions({
      headerTitle: ()=><Text style={{ fontSize: 16, color: Color.White, fontWeight: '700', marginRight: 12 }}>Note</Text>,
      headerLeft: ()=><HeaderBackButton tintColor={Color.White} onPress={() =>this.onBack()} />,
      headerRight: ()=>
        <TouchableOpacity style={{ margin: 8 }} onPress={() => this.saveNote()}>
          <Text style={{ fontSize: 16, color: Color.White, fontWeight: '700', marginRight: 12 }}>Save</Text>
        </TouchableOpacity>,
    })
  }

  openReference = (index, value) => {
    if (this.state.contentBody !== this.props.route.params.contentBody
      || this.state.bcvRef.verses.length !== this.props.route.params.bcvRef.verses.length
    ) {
      Alert.alert(
        'Save Changes ? ',
        'Do you want to save the note ',
        [
          { text: 'Cancel', onPress: () => { return } },
          {
            text: 'No', onPress: () => {
              this.props.updateVersionBook({
                bookId: this.state.bcvRef.bookId,
                bookName: this.state.bcvRef.bookName,
                chapterNumber: this.state.bcvRef.chapterNumber,
                totalChapters: getBookChaptersFromMapping(this.state.bcvRef.bookId),
              })
              this.props.navigation.navigate("Bible")
            }
          },
          { text: 'Yes', onPress: () => this.saveNote() },
        ],
      )
      return
    }
    this.props.updateVersionBook({
      bookId: this.state.bcvRef.bookId,
      bookName: this.state.bcvRef.bookName,
      chapterNumber: this.state.bcvRef.chapterNumber,
      totalChapters: getBookChaptersFromMapping(this.state.bcvRef.bookId),
    })
    this.props.navigation.navigate('Bible')
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={this.styles.containerEditNote}>
          <View style={this.styles.subContainer}>

            {this.state.bcvRef
              &&
              <FlowLayout style={this.styles.tapButton}
                dataValue={this.state.bcvRef}
                openReference={(index) => this.openReference(index)}
                styles={this.styles}
              />
            }
          </View>
          <TextInput
            style={this.styles.inputStyle}
            placeholder='Enter your note here'
            placeholderTextColor={this.styles.placeholderColor.color}
            value={this.state.contentBody}
            onChangeText={(text) => this.setState({ contentBody: text })}
            multiline={true}
          />
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,

    email: state.userInfo.email,
    uid: state.userInfo.uid,

    chapterNumber: state.updateVersion.chapterNumber,
    totalChapters: state.updateVersion.totalChapters,
    bookId: state.updateVersion.bookId,
    downloaded: state.updateVersion.downloaded,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditNote)
