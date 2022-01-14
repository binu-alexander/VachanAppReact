import React, { useEffect, useRef, useState } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import { styles } from "./styles.js";
import { View, Text, ActivityIndicator, AppState } from "react-native";
import { connect } from "react-redux";

const PlayVideo = (props) => {
  const url = props.route.params ? props.route.params.url : null;
  const title = props.route.params ? props.route.params.title : null;
  const description = props.route.params
    ? props.route.params.description
    : null;
  const theme = props.route.params ? props.route.params.theme : null;
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const style = styles(props.colorFile, props.sizeFile);
  const textRef = useRef("playerRef");
  const onError = () => alert("Oh! ");
  const onReady = () => {
    setPlaying(playing);
  };
  const onChangeState = (event) => {
    if (event === undefined) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };
  const handleYoutubePlay = (currentAppState) => {
    if (currentAppState == "background") {
      setPlaying(false);
    }
    if (currentAppState == "inactive") {
      setPlaying(false);
    }
    if (currentAppState == "active") {
      setPlaying(true);
    }
  };

  useEffect(() => {
    onChangeState();
    props.navigation.setOptions({
      headerTitle: theme,
    });
    setPlaying(true);
    AppState.addEventListener("change", handleYoutubePlay);
    return () => {
      AppState.removeEventListener("change", handleYoutubePlay);
    };
  }, []);
  return (
    <View style={style.container}>
      <Text style={style.title}>{title}</Text>
      {isLoading ? (
        <View style={style.loaderPos}>
          <ActivityIndicator animate={true} size={32} />
        </View>
      ) : null}
      <YoutubePlayer
        ref={textRef}
        height={"36%"}
        width={"100%"}
        videoId={url}
        play={playing}
        onChangeState={(event) => onChangeState(event)}
        onReady={() => onReady}
        onError={onError}
        volume={50}
        playbackRate={1}
      />
      <Text style={style.description}>{description}</Text>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    languageCode: state.updateVersion.languageCode,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(PlayVideo);
