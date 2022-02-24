import React, { useState, useEffect, useRef } from "react";
import { Animated, ActivityIndicator } from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Text, View } from "native-base";
import { connect } from "react-redux";
import { styles } from "./styles.js";

const InfographicsImage = (props) => {
  const url = props.route.params.url;
  const fileName = props.route.params.fileName;
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const style = styles(props.colorFile, props.sizeFile);

  /* Pinching */
  let _baseScale = new Animated.Value(1);
  let _pinchScale = new Animated.Value(1);
  let _scale = Animated.multiply(_baseScale, _pinchScale);
  let _lastScale = 1;
  let _onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: _pinchScale } }],
    { useNativeDriver: true }
  );

  /* Rotation */
  let _rotate = new Animated.Value(0);
  let _rotateStr = _rotate.interpolate({
    inputRange: [-100, 100],
    outputRange: ["-100rad", "100rad"],
    extrapolate: "clamp",
  });
  let _lastRotate = 0;
  let _onRotateGestureEvent = Animated.event(
    [{ nativeEvent: { rotation: _rotate } }],
    { useNativeDriver: true }
  );

  /* Tilt */
  let translateX = new Animated.Value(0);
  let translateY = new Animated.Value(0);

  let _onTiltGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY,
          translationX: translateX,
        },
      },
    ],
    { useNativeDriver: true }
  );
  const _onRotateHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      _lastRotate += event.nativeEvent.rotation;
      _rotate.setOffset(_lastRotate);
      _rotate.setValue(0);
    }
  };
  const _onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      _lastScale *= event.nativeEvent.scale;

      _baseScale.setValue(_lastScale);
      _pinchScale.setValue(1);
    }
  };
  const _onTiltGestureStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      translateY.extractOffset();
      translateX.extractOffset();
    }
  };
  const resetSize = () => {
    _baseScale.setValue(1);
    _rotate.setOffset(0);
    translateX.setOffset(0);
    translateY.setOffset(0);
  };
  const infographicsData = () => {
    props.navigation.setOptions({
      headerTitle: () => <Text style={style.headerTitle}>Image</Text>,
      headerRight: () => (
        <TouchableOpacity onPress={resetSize}>
          <Text style={style.headerRight}>Reset Size</Text>
        </TouchableOpacity>
      ),
    });
    setImage(url + fileName);
  }
  useEffect(() => {
    infographicsData()
  }, []);
  let panRef = useRef();
  let rotationRef = useRef();
  let pinchRef = useRef();
  return (
    <View style={styles.wrapper}>
      {isLoading && (
        <View style={styles.loaderPos}>
          <ActivityIndicator animate={true} size={32} />
        </View>
      )}
      {image && (
        <PanGestureHandler
          ref={panRef}
          onGestureEvent={_onTiltGestureEvent}
          onHandlerStateChange={_onTiltGestureStateChange}
          minDist={10}
          minPointers={1}
          maxPointers={2}
          avgTouches
        >
          <Animated.View style={styles.wrapper}>
            <RotationGestureHandler
              ref={rotationRef}
              simultaneousHandlers={pinchRef}
              onGestureEvent={_onRotateGestureEvent}
              onHandlerStateChange={_onRotateHandlerStateChange}
            >
              <Animated.View style={styles.wrapper}>
                <PinchGestureHandler
                  ref={pinchRef}
                  simultaneousHandlers={rotationRef}
                  onGestureEvent={_onPinchGestureEvent}
                  onHandlerStateChange={_onPinchHandlerStateChange}
                >
                  <Animated.View
                    style={style.imagecontainer}
                    collapsable={false}
                  >
                    <Animated.Image
                      style={[
                        style.pinchableImage,
                        {
                          transform: [
                            // { perspective: 200 },
                            { scale: _scale },
                            { translateY: translateY },
                            { translateX: translateX },
                            { rotate: _rotateStr },
                          ],
                        },
                      ]}
                      onLoadStart={() => setIsLoading(true)}
                      onLoadEnd={() => setIsLoading(false)}
                      source={{ uri: image }}
                    />
                  </Animated.View>
                </PinchGestureHandler>
              </Animated.View>
            </RotationGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    languageCode: state.updateVersion.languageCode,
    books: state.versionFetch.versionBooks,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    colorMode: state.updateStyling.colorMode,
  };
};

export default connect(mapStateToProps, null)(InfographicsImage);
