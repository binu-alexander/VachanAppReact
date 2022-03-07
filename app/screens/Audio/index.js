import { Card, CardItem, View } from "native-base";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { updateVersionBook, ToggleAudio } from "../../store/action/";
import { style } from "./style";
import ListContainer from "../../components/Common/FlatList";

const Audio = (props) => {
  const styles = style(props.colorFile, props.sizeFile);
  const [allAudioBooks, setAllAudioBooks] = useState([]);
  const [message, setMessage] = useState("");
  const navigateToBible = (bId, bookName, chapterNum) => {
    props.updateVersionBook({
      bookId: bId,
      bookName: bookName,
      chapterNumber: chapterNum,
    });
    props.ToggleAudio({ audio: true, status: true });
    props.navigation.navigate("Bible");
  };
  const emptyMessageNavigation = () => {
    props.navigation.navigate("Bible");
  };
  const renderItem = ({ item }) => {
    console.log(item);
    return (
      <Card>
        <CardItem style={styles.cardItemStyle}>
          <TouchableOpacity
            style={styles.audioView}
            onPress={() =>
              navigateToBible(item.bookId, item.bookName, item.numOfChapters)
            }
          >
            <Text style={styles.audioText}>
              {item && item.bookName} {item && item.numOfChapters}
            </Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
    );
  };
  useEffect(() => {
    const books = props.books;
    const audioBooks = props.audioList && props.audioList[0].books;
    const arrayBooks = audioBooks && Object.keys(audioBooks);
    const allBooks = books.map((code) => code);
    let allAudioBook = [];
    if (arrayBooks != undefined) {
      for (var i = 0; i < arrayBooks.length; i++) {
        let temp = allBooks.find((item) => item.bookId === arrayBooks[i]);
        allAudioBook.push(temp);
      }
      console.log(allAudioBooks);
      if (allAudioBook.length === 0) {
        setMessage(`Audio for ${props.language} not available`);
      } else {
        setAllAudioBooks(allAudioBook);
        setMessage("");
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <ListContainer
        listData={allAudioBooks}
        listStyle={styles.centerEmptySet}
        renderItem={renderItem}
        icon="volume-up"
        iconStyle={styles.emptyMessageIcon}
        containerStyle={styles.emptyMessageContainer}
        textStyle={styles.messageEmpty}
        message={message}
        onPress={emptyMessageNavigation}
      />
    </View>
  );
};
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
