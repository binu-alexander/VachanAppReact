import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  StatusBar
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
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import {
  SelectionChangeData,
  TextChangeData,
} from 'react-native-cn-quill';
const clockIcon = require('../../assets/clock.png');

class EditNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteIndex: this.props.route.params ? this.props.route.params.noteIndex : null,
      noteObject: this.props.route.params ? this.props.route.params.notesList : null,
      bcvRef: this.props.route.params ? this.props.route.params.bcvRef : null,
      isLoading: false,
      contentBody: this.props.route.params ? this.props.route.params.contentBody : null,
      modalVisible: false,
    }
    this._editor = React.createRef();
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
      headerTitle: () => <Text style={{ fontSize: 16, color: Color.White, fontWeight: '700', marginRight: 12 }}>Note</Text>,
      headerLeft: () => <HeaderBackButton tintColor={Color.White} onPress={() => this.onBack()} />,
      headerRight: () =>
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
  setRichEditorApi(api) {
    console.log("API ", api)
    this.setState({ richEditorApi: api })
  }
  getCurrentDate() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  handleGetHtml = () => {
    this._editor.current?.getHtml().then((res) => {
      console.log('Html :', res);
    });
  };

  // handleSelectionChange = async (data: SelectionChangeData) => {
  //   const { range } = data;
  //   if (range) {
  //     if (range.length === 0) {
  //       console.log('User cursor is on', range.index);
  //     } else {
  //       var text = await this._editor.current?.getText(
  //         range.index,
  //         range.length
  //       );
  //       console.log('User has highlighted', text);
  //     }
  //   } else {
  //     console.log('Cursor not in the editor');
  //   }
  // }
  onHtmlChange = (html) => {
    console.log("HTML TEXT ", html)
    this.setState({contentBody:html.html})
  }
  // handleTextChange = (data: TextChangeData) => {
  //  console.log("DATA HANDLE TEXT CHANGE ",data)
  // };
  // customHandler = (name: string, value: any) => {
  //   if (name === 'image') {
  //     this._editor.current?.insertEmbed(
  //       0,
  //       'image',
  //       'https://picsum.photos/200/300'
  //     );
  //   } else if (name === 'clock') {
  //     this._editor.current?.insertText(0, `Today is ${this.getCurrentDate()}`, {
  //       bold: true,
  //       color: 'red',
  //     });
  //   } else {
  //     console.log(`${name} clicked with value: ${value}`);
  //   }
  // }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* <ScrollView style={this.styles.containerEditNote}> */}
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
          {/* <TextInput
            style={this.styles.inputStyle}
            placeholder='Enter your note here'
            placeholderTextColor={this.styles.placeholderColor.color}
            value={this.state.contentBody}
            onChangeText={(text) => this.setState({ contentBody: text })}
            multiline={true}
          /> */}
        {/* </ScrollView> */}
        <QuillEditor
          // container={CustomContainer} // not required just to show how to pass cusom container
          style={[styles.input, styles.editor]}
          ref={this._editor}
          onSelectionChange={this.handleSelectionChange}
          onTextChange={this.handleTextChange}
          onHtmlChange={this.onHtmlChange}
          quill={{
            // not required just for to show how to pass this props
            placeholder: 'Enter your note here',
            modules: {
              toolbar: false, // this is default value
            },
            theme: 'bubble', // this is default value
          }}
          // defaultFontFamily={customFonts[0].name}
          // customFonts={customFonts}
          import3rdParties="cdn" // default value is 'local'
          initialHtml={this.state.contentBody}
        />
        <QuillToolbar
          editor={this._editor}
          theme="light"
          options={[
            ['bold', 'italic', 'underline'],
            [{ header: 1 }, { header: 2 }],
            [{ align: [] }],
            [
              { color: ['#000000', '#e60000', '#ff9900', 'yellow'] },
              { background: [] },
            ]
          ]}
          // custom={{
          //   handler: this.customHandler,
          //   actions: ['image', 'clock'],
          //   icons: {
          //     clock: clockIcon,
          //   },
          // }}
        />
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


var styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#eaeaea',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: 'white',
  },
  textbox: {
    height: 40,
    paddingHorizontal: 20,
  },
  editor: {
    flex: 1,
    padding: 0,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 10,
    margin: 3,
  },
});