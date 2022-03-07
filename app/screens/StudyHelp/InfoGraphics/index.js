import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card, CardItem } from "native-base";
import { connect } from "react-redux";
import { styles } from "./styles.js";
import { Toast } from "native-base";
import vApi from "../../../utils/APIFetch";
import ListContainer from "../../../components/Common/FlatList.js";

const Infographics = (props) => {
  const bookId = props.route.params ? props.route.params.bookId : null;
  const bookName = props.route.params ? props.route.params.bookName : null;
  const [infographics, setInfographics] = useState([]);
  const [url, setUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const prevBooks = useRef(props.books).current;
  const style = styles(props.colorFile, props.sizeFile);
  const fetchInfographics = async () => {
    const apiData = await vApi.get("infographics/" + props.languageCode);
    let infographicsBook = [];
    if (apiData.books) {
      let found = false;
      for (var i = 0; i < apiData.books.length; i++) {
        if (bookId) {
          if (apiData.books[i].bookCode == bookId) {
            found = true;
            infographicsBook.push(apiData.books[i]);
          }
        }
      }

      if (found) {
        setInfographics(infographicsBook);
        setMessage("");

        setUrl(apiData.url);
      } else {
        if (bookId) {
          Toast.show({
            text:
              "Infographics for " +
              bookName +
              " is unavailable. You can check other books",
            duration: 8000,
            position: "top",
          });
        }
        setInfographics(apiData.books);
        setUrl(apiData.url);
      }
    } else {
      setMessage("No Infographics for" + props.languageName);
    }
  };
  const gotoImage = (item) => {
    props.navigation.navigate("InfographicsImage", {
      url: url,
      fileName: item.fileName,
    });
  };
  const emptyMessageNavigation = () => {
    props.navigation.navigate("Bible");
  };
  const renderItem = ({ item }) => {
    var bookName = null;
    if (props.books) {
      for (var i = 0; i <= props.books.length - 1; i++) {
        var bId = props.books[i].bookId;
        if (bId == item.bookCode) {
          bookName = props.books[i].bookName;
        }
      }
    } else {
      setInfographics(infographics);
      return;
    }
    var value = item.infographics.map((e, i) => (
      <Card key={i}>
        <CardItem style={style.cardItemStyle}>
          <TouchableOpacity style={style.infoView} onPress={() => gotoImage(e)}>
            <Text style={style.infoText}>
              {bookName}: {e.title}
            </Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
    ));
    return <View>{bookName && value}</View>;
  };

  useEffect(() => {
    fetchInfographics();
    if (prevBooks.length != props.books.length) {
      fetchInfographics();
    }
  }, [prevBooks, props.books, infographics]);
  console.log(isLoading);
  return (
    <View style={style.container}>
      {isLoading ? (
        // eslint-disable-next-line react/jsx-no-undef
        <ActivityIndicator // it is showing undefined
          animate={true}
          style={{ justifyContent: "center", alignSelf: "center" }}
        />
      ) : (
        <ListContainer
          listData={infographics}
          listStyle={style.centerEmptySet}
          renderItem={renderItem}
          containerStyle={style.emptyMessageContainer}
          icon="image"
          iconStyle={style.emptyMessageIcon}
          textStyle={style.messageEmpty}
          message={message}
          onPress={emptyMessageNavigation}
        />
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    books: state.versionFetch.versionBooks,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(Infographics);
