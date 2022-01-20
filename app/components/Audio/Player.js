import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Controls from "./Controls";
import Video from "react-native-video";
import { connect } from "react-redux";
import { ToggleAudio } from "../../store/action";

const Player = (props) => {
  const [paused, setPaused] = useState(true);
  const [totalLength, setTotalLength] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [repeatOn, setRepeatOn] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(false);
  const refs = useRef();
  const adioRef = useRef();
  let loadStart;
  let onEnd;
  let videoError;

  const setDuration = (data) => {
    setTotalLength(Math.floor(data.duration));
  };

  const setTime = (data) => {
    setCurrentPosition(Math.floor(data.currentTime));
  };

  const onBack = () => {
    refs.audioElement.seek(currentPosition - 5);
  };

  const onForward = () => {
    refs.audioElement.seek(currentPosition + 5);
  };

  useEffect(() => {
    setPaused(!props.audio);
  }, []);

  const audiourl =
    props.audioURL +
    props.bookId +
    "/" +
    props.chapter +
    "." +
    props.audioFormat;

  console.log(audiourl, props.audioURL, "hhh");
  return (
    <View style={{ flex: 1 }}>
      {props.audioURL && (
        <View style={props.styles.audiocontainer}>
          <Controls
            styles={props.styles}
            onPressRepeat={() => setRepeatOn(!repeatOn)}
            repeatOn={repeatOn}
            onPressShuffle={() => setShuffleOn(!shuffleOn)}
            onPressPlay={() => setPaused(false)}
            onPressPause={() => setPaused(true)}
            onBack={onBack}
            onForward={onForward}
            paused={paused}
          />
          <Video
            source={{ uri: audiourl }} // Can be a URL or a local file.
            ref={adioRef}
            paused={paused} // Pauses playback entirely.
            resizeMode="cover" // Fill the whole screen at aspect ratio.
            repeat={false} // Repeat forever.
            onLoadStart={loadStart} // Callback when video starts to load
            onLoad={setDuration} // Callback when video loads
            onProgress={setTime} // Callback every ~250ms with currentTime
            onEnd={onEnd} // Callback when playback finishes
            onError={videoError} // Callback when video cannot be loaded
          />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    audioURL: state.updateVersion.audioURL,
    audioFormat: state.updateVersion.audioFormat,
    audio: state.audio.audio,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    ToggleAudio: (value) => dispatch(ToggleAudio(value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Player);
