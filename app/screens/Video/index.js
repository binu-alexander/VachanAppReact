import React, { useEffect, useRef, useState, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { styles } from "./styles.js";
import { Card, CardItem } from "native-base";
import { Toast } from "native-base";
import vApi from "../../utils/APIFetch";
import ListContainer from "../../components/Common/FlatList.js";
import { MainContext } from "../../context/MainProvider.js";
const Video = (props) => {
  const bookId = props.route.params ? props.route.params.bookId : null;
  const bookName = props.route.params ? props.route.params.bookName : null;
  const { bookList } = useContext(MainContext);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const style = styles(props.colorFile, props.sizeFile);

  const [message, setMessage] = useState("");
  const fetchVideo = async () => {
    setIsLoading(true);
    const videosRes = await vApi.get("videos?language=" + props.languageCode);
    let videoBook = [];
    let videoAll = [];
    let found = false;
    if (videosRes.length > 0) {
      console.log(videosRes, "res");
      for (let key in videosRes[0].books) {
        if (key === bookId) {
          console.log(videosRes[0].books, key, "video");

          for (var i = 0; i < videosRes[0].books[key].length; i++) {
            videoBook.push({
              title: videosRes[0].books[key][i].title,
              url: videosRes[0].books[key][i].url,
              description: videosRes[0].books[key][i].description,
              theme: videosRes[0].books[key][i].theme,
            });
            found = true;
          }
        } else {
          for (var j = 0; j < videosRes[0].books[key].length; j++) {
            videoAll.push({
              title: videosRes[0].books[key][j].title,
              url: videosRes[0].books[key][j].url,
              description: videosRes[0].books[key][j].description,
              theme: videosRes[0].books[key][j].theme,
            });
          }
        }
      }
      if (found) {
        setVideos(videoBook);
        setMessage("");
        setIsLoading(false);
      } else {
        if (bookId) {
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
              bookName +
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
        setVideos(elements);
        setMessage("No Video for " + props.languageName);
        setIsLoading(false);
      }
    } else {
      setMessage("No Video for " + props.languageName);
    }
  };
  const playVideo = (val) => {
    const videoId = val.url.replace("https://youtu.be/", "");
    props.navigation.navigate("PlayVideo", {
      url: videoId,
      title: val.title,
      description: val.description,
      theme: val.theme,
    });
  };
  const emptyMessageNavigation = () => {
    props.navigation.navigate("Bible");
  };
  const renderItem = ({ item }) => {
    return (
      <Card>
        <CardItem style={style.cardItemStyle}>
          <TouchableOpacity
            style={style.videoView}
            onPress={() => playVideo(item)}
          >
            <Text style={style.videoText}>{item.title}</Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
    );
  };

  useEffect(() => {
    fetchVideo();
  }, [bookList, videos]);
  return (
    <View style={style.container}>
      <ListContainer
        listData={videos}
        listStyle={style.centerEmptySet}
        renderItem={renderItem}
        containerStyle={style.emptyMessageContainer}
        icon="video-library"
        iconStyle={style.emptyMessageIcon}
        textStyle={style.messageEmpty}
        message={message}
        onPress={emptyMessageNavigation}
      />
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(Video);
