import { Card, CardItem, View } from "native-base";
import React, { Component } from "react";
import { Text, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import { updateVersionBook, ToggleAudio } from "../../store/action/";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AudioListStyle } from "./style";

class Audio extends Component {
  constructor(props) {
    super(props);
    this.styles = AudioListStyle(this.props.colorFile, this.props.sizeFile);
  }
  navigateToBible = (bId, bookName, chapterNum) => {
    this.props.updateVersionBook({
      bookId: bId,
      bookName: bookName,
      chapterNumber: chapterNum,
    });
    this.props.ToggleAudio({ audio: true, status: true });
    this.props.navigation.navigate("Bible");
  };

  render() {
    const books = this.props.books;
    const audioBooks = this.props.audioList && this.props.audioList[0].books;
    const arrayBooks = audioBooks && Object.keys(audioBooks);
    const allBooks = books.map((code) => code);
    let allAudioBooks = [];
    if (arrayBooks != undefined) {
      for (var i = 0; i < arrayBooks.length; i++) {
        let temp = allBooks.find((item) => item.bookId === arrayBooks[i]);
        allAudioBooks.push(temp);
      }
    } else {
      return (
        <View style={this.styles.messagContainer}>
          <Icon
            name="volume-off"
            size={24}
            style={this.styles.emptyMessageIcon}
          />
          <Text style={this.styles.audioText}>No Audio Available !!!!</Text>
        </View>
      );
    }

    return (
      <View style={this.styles.container}>
        <FlatList
          data={allAudioBooks}
          keyExtractor={(item) => item && item.bookNumber.toString()}
          renderItem={({ item }) => (
            <Card>
              <CardItem style={this.styles.cardItemStyle}>
                <TouchableOpacity
                  style={this.styles.audioView}
                  onPress={() =>
                    this.navigateToBible(
                      item.bookId,
                      item.bookName,
                      item.numOfChapters
                    )
                  }
                >
                  <Text style={this.styles.audioText}>
                    {item && item.bookName} {item && item.numOfChapters}
                  </Text>
                </TouchableOpacity>
              </CardItem>
            </Card>
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    audioList: state.updateVersion.audioList,
    books: state.versionFetch.versionBooks,
    audio: state.audio.audio,
    status: state.audio.status,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
    ToggleAudio: (value) => dispatch(ToggleAudio(value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Audio);
