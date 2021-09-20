import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

class TextEditorTool extends Component {
  static propTypes = {
    richEditorApi: PropTypes.object.isRequired,
  };
  bold = () => {
    if (typeof this.props.richEditorApi !== 'undefined') {
      this.props.richEditorApi.bold();
    }
  };
  italic = () => {
    if (typeof this.props.richEditorApi !== 'undefined') {
      this.props.richEditorApi.italic();
    }
  };
  underline = () => {
    if (typeof this.props.richEditorApi !== 'undefined') {
      this.props.richEditorApi.underline();
    }
  };

  orderedList = () => {
    if (typeof this.props.richEditorApi !== 'undefined') {
      this.props.richEditorApi.orderedList();
    }
  }
  unOrderedList = () => {
    if (typeof this.props.richEditorApi !== 'undefined') {
      this.props.richEditorApi.unOrderedList();
    }
  }
  strikethrough =() => {
    if (typeof this.props.richEditorApi !== 'undefined') {
      this.props.richEditorApi.strikethrough();
    }
  }
  indent =() => {
    if (typeof this.props.richEditorApi !== 'undefined') {
      this.props.richEditorApi.indent();
    }
  }
  outdent =() => {
    if (typeof this.props.richEditorApi !== 'undefined') {
      this.props.richEditorApi.outdent();
    }
  }
 
  render() {
    return (
      <View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.touchableBorder} onPress={this.bold}>
          <Icon name="format-bold" size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableBorder} onPress={this.italic}>
          <Icon name="format-italic" size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableBorder} onPress={this.underline}>
          <Icon name="format-underline" size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableBorder} onPress={this.strikethrough}>
         <Icon name="format-strikethrough-variant" size={32} />
       </TouchableOpacity>
       
      </View>
       <View style={styles.row}>
       <TouchableOpacity style={styles.touchableBorder} onPress={this.unOrderedList}>
          <Icon name="format-list-bulleted" size={32} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableBorder} onPress={this.orderedList}>
          <Icon name="format-list-numbered" size={32} />
        </TouchableOpacity>
       <TouchableOpacity style={styles.touchableBorder} onPress={this.indent}>
         <Icon name="format-indent-increase" size={32} />
       </TouchableOpacity>
       <TouchableOpacity style={styles.touchableBorder} onPress={this.outdent}>
         <Icon name="format-indent-decrease" size={32} />
       </TouchableOpacity>
     </View>
     </View>
    );
  }
}

const styles = StyleSheet.create({
  touchableBorder: { paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#fff', borderWidth: 5, borderColor: '#fcfaf5' },
  row: { flexDirection: 'row', justifyContent: 'space-around', borderColor: "#d9d4cc", borderWidth: 1, marginHorizontal: 4, padding: 4 }
});

export default TextEditorTool;