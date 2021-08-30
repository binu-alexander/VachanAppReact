import { View } from "native-base";
import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import { updateVersionBook, ToggleAudio } from "../../store/action/";
import Icon from "react-native-vector-icons/MaterialIcons";

class Audio extends Component {
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
        <View style={styles.messagContainer}>
          <Icon name="volume-off" size={24} style={styles.icon} />
          <Text style={styles.messageText}>No Audio Available !!!!</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={allAudioBooks}
        keyExtractor={(item) => item && item.bookNumber.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              this.navigateToBible(
                item.bookId,
                item.bookName,
                item.numOfChapters
              )
            }
          >
            <View style={styles.container}>
              <Text style={styles.listItem}>
                {item && item.bookName} {item && item.numOfChapters}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    fontSize: 18,
    fontWeight: "500",
    textTransform: "capitalize",
    letterSpacing: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  messagContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messageText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  icon: {
    marginHorizontal: 5,
  },
});
const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    languageCode: state.updateVersion.languageCode,
    audioList: state.updateVersion.audioList,
    books: state.versionFetch.versionBooks,
    audio: state.audio.audio,
    status: state.audio.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
    ToggleAudio: (value) => dispatch(ToggleAudio(value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Audio);
