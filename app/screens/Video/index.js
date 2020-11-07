import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux'
import APIFetch from '../../utils/APIFetch'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { bookStyle } from './styles.js'
import { Card, CardItem } from 'native-base'
import {Toast } from 'native-base'
import vApi from '../../utils/APIFetch';


class Video extends Component {
  static navigationOptions = {
    headerTitle: 'Video',
  };

  constructor(props) {
    super(props);
    this.state = {
      bookId: this.props.navigation.state.params ? this.props.navigation.state.params.bookId : null,
      bookName: this.props.navigation.state.params ? this.props.navigation.state.params.bookName : null,
      videos: [],
      isLoading: false
    }
    this.styles = bookStyle(this.props.colorFile, this.props.sizeFile);
  }
  async fetchVideo() {
    const videos = await vApi.get('videos?language='+this.props.languageCode)
    let videoBook = []
    let videoAll = []
    let found = false
    for (var key in videos[0].books) {
      if (this.state.bookId != null){
        if(key == this.state.bookId){
          found = true
          videoBook.push({ bookId: key, details: videos[0].books[key] })
        }
      } else {
        videoAll.push({ bookId: key, details: videos[0].books[key] })
      }
    }
    if (found) {
      this.setState({ videos: videoBook })
    } else {
      if(this.state.bookId){
      Toast.show({
        text: 'Video for '+this.state.bookName+' is unavaialble. You can checkout other books',
        duration: 2000
      })
      }
        this.setState({ videos: videoAll })
    }

  }
  playVideo(val) {
    const videoId = val.url.replace("https://youtu.be/", "");
    this.props.navigation.navigate("PlayVideo", { url: videoId, title: val.title, description: val.description, theme: val.theme })
  }
  componentDidMount() {
    this.fetchVideo()
  }
  renderItem = ({ item }) => {
    var bookName = null
    if (this.props.books) {
      for (var i = 0; i <= this.props.books.length - 1; i++) {
        var bId = this.props.books[i].bookId
        if (bId == item.bookId) {
          bookName = this.props.books[i].bookName
        }
      }
    } else {
      this.setState({ bookmarksList: [] })
      return
    }
    var value = item.details.map(e =>
      <Card >
        <CardItem style={this.styles.cardItemStyle} > 
          <TouchableOpacity style={this.styles.videoView} onPress={() => this.playVideo(e)}>
            <Text style={this.styles.videoText}>{bookName} : {e.title}</Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
    )
    return (
      <View>
        {bookName && value}
      </View>
    )
  }
  render() {

    return (
      <View style={this.styles.container}>
        {
          this.state.isLoading ?
            <ActivityIndicator animate={true} style={{ justifyContent: 'center', alignSelf: 'center' }} /> :
            <FlatList
              data={this.state.videos}
              contentContainerStyle={this.state.videos.length === 0 && this.styles.centerEmptySet}
              renderItem={this.renderItem}
              ListEmptyComponent={
                <View style={this.styles.emptyMessageContainer}>
                  <Icon name="video-library" style={this.styles.emptyMessageIcon} />
                  <Text
                    style={this.styles.messageEmpty}>
                    No Video for {this.props.languageName}
                  </Text>
                </View>
              }
            />
        }
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    books: state.versionFetch.data,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}


export default connect(mapStateToProps, null)(Video)


