import React, { Component } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { bookStyle } from "./styles.js";
import { Card, CardItem } from "native-base";
import { Toast } from "native-base";
import vApi from "../../utils/APIFetch";
class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookId: this.props.route.params ? this.props.route.params.bookId : null,
      bookName: this.props.route.params
        ? this.props.route.params.bookName
        : null,
      videos: [],
      isLoading: false,
      duplicateValue: [],
    };
    this.styles = bookStyle(this.props.colorFile, this.props.sizeFile);
  }

  async fetchVideo() {
    this.setState({ isLoading: true });
    const videos = await vApi.get("videos?language=" + this.props.languageCode);
    let videoBook = [];
    let videoAll = [];
    let found = false;
    if (videos) {
      for (var key in videos[0].books) {
        if (this.state.bookId != null) {
          if (key == this.state.bookId) {
            for (var i = 0; i < videos[0].books[key].length; i++) {
              videoBook.push({
                title: videos[0].books[key][i].title,
                url: videos[0].books[key][i].url,
                description: videos[0].books[key][i].description,
                theme: videos[0].books[key][i].theme,
              });
              found = true;
            }
          }
        } else {
          for (var j = 0; j < videos[0].books[key].length; j++) {
            videoAll.push({
              title: videos[0].books[key][j].title,
              url: videos[0].books[key][j].url,
              description: videos[0].books[key][j].description,
              theme: videos[0].books[key][j].theme,
            });
          }
        }
      }

      if (found) {
        this.setState({ videos: videoBook, isLoading: false });
      } else {
        if (this.state.bookId) {
          // ToastAndroid.showWithGravityAndOffset(
          //   'Video for ' + this.state.bookName + ' is unavailable. You can check other books',
          //   ToastAndroid.LONG,
          //   ToastAndroid.CENTER,
          //   25,
          //   50
          // );
          Toast.show({
            text:
              "Video for " +
              this.state.bookName +
              " is unavailable. You can check other books",
            duration: 8000,
            position: "top",
          });
        }
        var elements = videoAll.reduce(function (previous, current) {
          var object = previous.filter(
            (object) => object.title === current.title
          );
          if (object.length == 0) {
            previous.push(current);
          }
          return previous;
        }, []);
        this.setState({ videos: elements, isLoading: false });
      }
    }
  }
  playVideo(val) {
    const videoId = val.url.replace("https://youtu.be/", "");
    this.props.navigation.navigate("PlayVideo", {
      url: videoId,
      title: val.title,
      description: val.description,
      theme: val.theme,
    });
  }
  componentDidMount() {
    this.fetchVideo();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.books.length != this.props.books.length) {
      this.fetchVideo();
    }
  }
  // renderItem = ({ item }) => {
  //   return (
  //     <Card>
  //       <CardItem style={this.styles.cardItemStyle}>
  //         <TouchableOpacity
  //           style={this.styles.videoView}
  //           onPress={() => this.playVideo(item)}
  //         >
  //           <Text style={this.styles.videoText}>{item.title}</Text>
  //         </TouchableOpacity>
  //       </CardItem>
  //     </Card>
  //   );
  // };
  render() {
    return (
      <View style={this.styles.container}>
        <FlatList
          data={this.state.videos}
          contentContainerStyle={
            this.state.videos.length === 0 && this.styles.centerEmptySet
          }
          renderItem={({ item }) => (
            <Card>
              <CardItem style={this.styles.cardItemStyle}>
                <TouchableOpacity
                  style={this.styles.videoView}
                  onPress={() => this.playVideo(item)}
                >
                  <Text style={this.styles.videoText}>{item.title}</Text>
                </TouchableOpacity>
              </CardItem>
            </Card>
          )}
          extraData={this.state}
          ListEmptyComponent={
            <View style={this.styles.emptyMessageContainer}>
              <Icon name="video-library" style={this.styles.emptyMessageIcon} />
              <Text style={this.styles.messageEmpty}>
                No Video for {this.props.languageName}
              </Text>
            </View>
          }
        />
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

export default connect(mapStateToProps, null)(Video);
