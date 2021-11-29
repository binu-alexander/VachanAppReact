import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Card, CardItem } from "native-base";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { styles } from "./styles.js";
import { Toast } from "native-base";
import vApi from "../../../utils/APIFetch";

class Infographics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: this.props.route.params ? this.props.route.params.bookId : null,
      bookName: this.props.route.params
        ? this.props.route.params.bookName
        : null,
      infographics: [],
      url: null,
      isLoading: false,
    };
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
  }
  async fetchInfographics() {
    const apiData = await vApi.get("infographics/" + this.props.languageCode);
    let infographicsBook = [];
    if (apiData) {
      let found = false;
      for (var i = 0; i < apiData.books.length; i++) {
        if (this.state.bookId) {
          if (apiData.books[i].bookCode == this.state.bookId) {
            found = true;
            infographicsBook.push(apiData.books[i]);
          }
        }
      }
      if (found) {
        this.setState({ infographics: infographicsBook, url: apiData.url });
      } else {
        if (this.state.bookId) {
          Toast.show({
            text:
              "Infographics for " +
              this.state.bookName +
              " is unavailable. You can check other books",
            duration: 8000,
            position: "top",
          });
        }
        this.setState({ infographics: apiData.books, url: apiData.url });
      }
    }
  }
  componentDidMount() {
    this.fetchInfographics();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.books.length != this.props.books.length) {
      this.fetchInfographics();
    }
  }
  gotoImage = (item) => {
    this.props.navigation.navigate("InfographicsImage", {
      url: this.state.url,
      fileName: item.fileName,
    });
  };
  renderItem = ({ item }) => {
    var bookName = null;
    if (this.props.books) {
      for (var i = 0; i <= this.props.books.length - 1; i++) {
        var bId = this.props.books[i].bookId;
        if (bId == item.bookCode) {
          bookName = this.props.books[i].bookName;
        }
      }
    } else {
      this.setState({ infographics: [] });
      return;
    }
    var value = item.infographics.map((e, i) => (
      <Card key={i}>
        <CardItem style={this.styles.cardItemStyle}>
          <TouchableOpacity
            style={this.styles.infoView}
            onPress={() => this.gotoImage(e)}
          >
            <Text style={this.styles.infoText}>
              {bookName}: {e.title}
            </Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
    ));
    return <View>{bookName && value}</View>;
  };
  render() {
    return (
      <View style={this.styles.container}>
        {this.state.isLoading ? (
          // eslint-disable-next-line react/jsx-no-undef
          <ActivityIndicator // it is showing undefined
            animate={true}
            style={this.styles.loaderCenter}
          />
        ) : (
          <FlatList
            data={this.state.infographics}
            contentContainerStyle={
              this.state.infographics.length === 0 && this.styles.centerEmptySet
            }
            renderItem={this.renderItem}
            ListEmptyComponent={
              <View style={this.styles.emptyMessageContainer}>
                <Icon name="image" style={this.styles.emptyMessageIcon} />
                <Text style={this.styles.messageEmpty}>
                  No Infographics for {this.props.languageName}
                </Text>
              </View>
            }
          />
        )}
      </View>
    );
  }
}

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
