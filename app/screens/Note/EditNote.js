import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import FlowLayout from "../../components/FlowLayout";
import { CommonActions } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/stack";
import { styles } from "./styles.js";
import { connect } from "react-redux";
import database from "@react-native-firebase/database";
import Color from "../../utils/colorConstants";
import { getBookChaptersFromMapping } from "../../utils/UtilFunctions";
import { updateVersionBook } from "../../store/action/";
import QuillEditor, { QuillToolbar } from "react-native-cn-quill";

// class EditNote extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       noteIndex: this.props.route.params
//         ? this.props.route.params.noteIndex
//         : null,
//       noteObject: this.props.route.params
//         ? this.props.route.params.notesList
//         : null,
//       bcvRef: this.props.route.params ? this.props.route.params.bcvRef : null,
//       isLoading: false,
//       contentBody: this.props.route.params
//         ? this.props.route.params.contentBody
//         : null,
//       modalVisible: false,
//     };
//     this._editor = React.createRef();
//     this.styles = styles(props.colorFile, props.sizeFile);
//   }
//   saveNote = async () => {
//     var time = Date.now();
//     var firebaseRef = database().ref(
//       "users/" +
//         this.props.uid +
//         "/notes/" +
//         this.props.sourceId +
//         "/" +
//         this.state.bcvRef.bookId
//     );
//     if (this.state.contentBody == "") {
//       alert(" Note should not be empty");
//     } else {
//       var edit = database().ref(
//         "users/" +
//           this.props.uid +
//           "/notes/" +
//           this.props.sourceId +
//           "/" +
//           this.state.bcvRef.bookId +
//           "/" +
//           this.state.bcvRef.chapterNumber
//       );
//       if (this.state.noteIndex != -1) {
//         let updates = {};
//         updates["/" + this.state.noteIndex] = {
//           createdTime: time,
//           modifiedTime: time,
//           body: this.state.contentBody,
//           verses: this.state.bcvRef.verses,
//         };
//         edit.update(updates);
//       } else {
//         var notesArray = this.state.noteObject.concat({
//           createdTime: time,
//           modifiedTime: time,
//           body: this.state.contentBody,
//           verses: this.state.bcvRef.verses,
//         });
//         let updates = {};
//         updates[this.state.bcvRef.chapterNumber] = notesArray;
//         firebaseRef.update(updates);
//       }
//       this.props.route.params.onbackNote();
//       this.props.navigation.pop();
//     }
//   };

//   showAlert() {
//     Alert.alert("Save Changes ? ", "Do you want to save the note ", [
//       {
//         text: "Cancel",
//         onPress: () => {
//           return;
//         },
//       },
//       {
//         text: "No",
//         onPress: () => {
//           this.props.navigation.dispatch(CommonActions.goBack());
//         },
//       },
//       { text: "Yes", onPress: () => this.saveNote() },
//     ]);
//   }

//   onBack = async () => {
//     if (this.state.noteIndex == -1) {
//       if (this.state.contentBody == "") {
//         this.props.navigation.dispatch(CommonActions.goBack());
//         return;
//       }
//       this.showAlert();
//       return;
//     } else {
//       if (
//         this.state.contentBody !== this.props.route.params.contentBody ||
//         this.state.bcvRef.verses.length !==
//           this.props.route.params.bcvRef.verses.length
//       ) {
//         this.showAlert();
//         return;
//       }
//       this.props.navigation.dispatch(CommonActions.goBack());
//     }
//   };
//   componentDidMount() {
//     this.props.navigation.setOptions({
//       headerTitle: () => (
//         <Text
//           style={{
//             fontSize: 16,
//             color: Color.White,
//             fontWeight: "700",
//             marginRight: 12,
//           }}
//         >
//           Note
//         </Text>
//       ),
//       headerLeft: () => (
//         <HeaderBackButton
//           tintColor={Color.White}
//           onPress={() => this.onBack()}
//         />
//       ),
//       headerRight: () => (
//         <TouchableOpacity style={{ margin: 8 }} onPress={() => this.saveNote()}>
//           <Text
//             style={{
//               fontSize: 16,
//               color: Color.White,
//               fontWeight: "700",
//               marginRight: 12,
//             }}
//           >
//             Save
//           </Text>
//         </TouchableOpacity>
//       ),
//     });
//   }

//   openReference = () => {
//     if (
//       this.state.contentBody !== this.props.route.params.contentBody ||
//       this.state.bcvRef.verses.length !==
//         this.props.route.params.bcvRef.verses.length
//     ) {
//       Alert.alert("Save Changes ? ", "Do you want to save the note ", [
//         {
//           text: "Cancel",
//           onPress: () => {
//             return;
//           },
//         },
//         {
//           text: "No",
//           onPress: () => {
//             this.props.updateVersionBook({
//               bookId: this.state.bcvRef.bookId,
//               bookName: this.state.bcvRef.bookName,
//               chapterNumber: this.state.bcvRef.chapterNumber,
//               totalChapters: getBookChaptersFromMapping(
//                 this.state.bcvRef.bookId
//               ),
//             });
//             this.props.navigation.navigate("Bible");
//           },
//         },
//         { text: "Yes", onPress: () => this.saveNote() },
//       ]);
//       return;
//     }
//     this.props.updateVersionBook({
//       bookId: this.state.bcvRef.bookId,
//       bookName: this.state.bcvRef.bookName,
//       chapterNumber: this.state.bcvRef.chapterNumber,
//       totalChapters: getBookChaptersFromMapping(this.state.bcvRef.bookId),
//     });
//     this.props.navigation.navigate("Bible");
//   };

//   handleGetHtml = () => {
//     this._editor.current?.getHtml().then((res) => {
//       console.log("Html :", res);
//     });
//   };

//   onHtmlChange = (html) => {
//     console.log("html ", html);
//     this.setState({ contentBody: html.html });
//   };

//   render() {
//     console.log("PARAM ", this.props.route.params);
//     return (
//       <View style={this.styles.containerEditNote}>
//         <View style={this.styles.subContainer}>
//           {this.state.bcvRef && (
//             <FlowLayout
//               style={this.styles.tapButton}
//               dataValue={this.state.bcvRef}
//               openReference={(index) => this.openReference(index)}
//               styles={this.styles}
//             />
//           )}
//         </View>
//         <QuillEditor
//           // container={CustomContainer} // not required just to show how to pass cusom container
//           style={this.styles.editorInput}
//           ref={this._editor}
//           onSelectionChange={this.handleSelectionChange}
//           onTextChange={this.handleTextChange}
//           onHtmlChange={this.onHtmlChange}
//           quill={{
//             placeholder: "Enter your note here",
//             modules: {
//               toolbar: false,
//             },
//             theme: "bubble",
//           }}
//           theme={{
//             background: this.props.colorFile.fedBackgroundColor,
//             color: this.props.colorFile.textColor,
//           }}
//           import3rdParties="cdn"
//           initialHtml={this.state.contentBody}
//         />
//         <QuillToolbar
//           editor={this._editor}
//           theme="light"
//           options={[
//             ["bold", "italic", "underline"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ align: [] }],
//             [{ size: ["small", false, "large", "huge"] }],
//             [{ color: [] }, { background: [] }],
//           ]}
//         />
//       </View>
//     );
//   }
// }
const EditNote = (props) => {
  const noteIndex = props.route.params ? props.route.params.noteIndex : null;
  const noteObject = props.route.params ? props.route.params.notesList : null;
  const bcvRef = props.route.params ? props.route.params.bcvRef : null;
  const [contentBody, setContentBody] = useState(
    props.route.params ? props.route.params.contentBody : null
  );
  const _editor = React.createRef();
  const style = styles(props.colorFile, props.sizeFile);

  const saveNote = async () => {
    var time = Date.now();
    var firebaseRef = database().ref(
      "users/" + props.uid + "/notes/" + props.sourceId + "/" + bcvRef.bookId
    );
    if (contentBody == "") {
      alert(" Note should not be empty");
    } else {
      var edit = database().ref(
        "users/" +
          props.uid +
          "/notes/" +
          props.sourceId +
          "/" +
          bcvRef.bookId +
          "/" +
          bcvRef.chapterNumber
      );
      if (noteIndex != -1) {
        let updates = {};
        updates["/" + noteIndex] = {
          createdTime: time,
          modifiedTime: time,
          body: contentBody,
          verses: bcvRef.verses,
        };
        edit.update(updates);
      } else {
        var notesArray = noteObject.concat({
          createdTime: time,
          modifiedTime: time,
          body: contentBody,
          verses: bcvRef.verses,
        });
        let updates = {};
        updates[bcvRef.chapterNumber] = notesArray;
        firebaseRef.update(updates);
      }
      props.route.params.onbackNote();
      props.navigation.pop();
    }
  };
  const showAlert = () => {
    Alert.alert("Save Changes ? ", "Do you want to save the note ", [
      {
        text: "Cancel",
        onPress: () => {
          return;
        },
      },
      {
        text: "No",
        onPress: () => {
          props.navigation.dispatch(CommonActions.goBack());
        },
      },
      { text: "Yes", onPress: () => saveNote() },
    ]);
  };
  const onBack = async () => {
    if (noteIndex == -1) {
      if (contentBody == "") {
        props.navigation.dispatch(CommonActions.goBack());
        return;
      }
      showAlert();
      return;
    } else {
      if (
        contentBody !== props.route.params.contentBody ||
        bcvRef.verses.length !== props.route.params.bcvRef.verses.length
      ) {
        showAlert();
        return;
      }
      props.navigation.dispatch(CommonActions.goBack());
    }
  };
  const openReference = () => {
    if (
      contentBody !== props.route.params.contentBody ||
      bcvRef.verses.length !== props.route.params.bcvRef.verses.length
    ) {
      Alert.alert("Save Changes ? ", "Do you want to save the note ", [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
        },
        {
          text: "No",
          onPress: () => {
            props.updateVersionBook({
              bookId: bcvRef.bookId,
              bookName: bcvRef.bookName,
              chapterNumber: bcvRef.chapterNumber,
              totalChapters: getBookChaptersFromMapping(bcvRef.bookId),
            });
            props.navigation.navigate("Bible");
          },
        },
        { text: "Yes", onPress: () => saveNote() },
      ]);
      return;
    }
    props.updateVersionBook({
      bookId: bcvRef.bookId,
      bookName: bcvRef.bookName,
      chapterNumber: bcvRef.chapterNumber,
      totalChapters: getBookChaptersFromMapping(bcvRef.bookId),
    });
    props.navigation.navigate("Bible");
  };

  const handleGetHtml = () => {
    _editor.current?.getHtml().then((res) => {
      console.log("Html :", res);
    });
  };

  const onHtmlChange = (html) => {
    console.log("html ", html);
    setContentBody(html.html);
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => (
        <Text
          style={{
            fontSize: 16,
            color: Color.White,
            fontWeight: "700",
            marginRight: 12,
          }}
        >
          Note
        </Text>
      ),
      headerLeft: () => (
        <HeaderBackButton tintColor={Color.White} onPress={() => onBack()} />
      ),
      headerRight: () => (
        <TouchableOpacity style={{ margin: 8 }} onPress={() => saveNote()}>
          <Text
            style={{
              fontSize: 16,
              color: Color.White,
              fontWeight: "700",
              marginRight: 12,
            }}
          >
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);
  return (
    <View style={style.containerEditNote}>
      <View style={style.subContainer}>
        {bcvRef && (
          <FlowLayout
            style={style.tapButton}
            dataValue={bcvRef}
            openReference={(index) => openReference(index)}
            styles={style}
          />
        )}
      </View>
      <QuillEditor
        // container={CustomContainer} // not required just to show how to pass cusom container
        style={style.editorInput}
        ref={_editor}
        // onSelectionChange={handleSelectionChange}
        // onTextChange={handleTextChange}
        onHtmlChange={onHtmlChange}
        quill={{
          placeholder: "Enter your note here",
          modules: {
            toolbar: false,
          },
          theme: "bubble",
        }}
        theme={{
          background: props.colorFile.fedBackgroundColor,
          color: props.colorFile.textColor,
        }}
        import3rdParties="cdn"
        initialHtml={contentBody}
      />
      <QuillToolbar
        editor={_editor}
        theme="light"
        options={[
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ color: [] }, { background: [] }],
        ]}
      />
    </View>
  );
};

const mapStateToProps = (state) => {
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditNote);
