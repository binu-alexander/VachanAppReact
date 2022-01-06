import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "./styles.js";
import { connect } from "react-redux";
import { constantFont } from "../../utils/dimens";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const width = Dimensions.get("window").width;

const Help = (props) => {
  const [Index, setIndex] = useState(null);
  const [iconName, setIconName] = useState([
    {
      icon: "menu",
      pressIcon: "Menu",
      hint: "See all available functionality from left drawer",
      visible: false,
    },
    {
      icon: "volume-up",
      pressIcon: "Audio",
      hint: "Listen to audio Bible",
      visible: false,
    },
    {
      icon: "videocam",
      pressIcon: "Video",
      hint: "Watch Bible videos",
      visible: false,
    },
    {
      icon: "image",
      pressIcon: "Image",
      hint: "Infographic Images",
      visible: false,
    },
    {
      icon: "search",
      pressIcon: "Search",
      hint: "Search for text",
      visible: false,
    },
    {
      icon: "bookmark",
      pressIcon: "Bookmarks",
      hint: "Manage your bookmarks",
      visible: false,
    },
    {
      icon: "history",
      pressIcon: "history",
      hint: "See all your reading history",
      visible: false,
    },
    {
      icon: "note",
      pressIcon: "Notes",
      hint: "Manage your notes",
      visible: false,
    },
    {
      icon: "border-color",
      pressIcon: "Highlights",
      hint: "Manage your highlights",
      visible: false,
    },
    {
      icon: "settings",
      pressIcon: "Settings",
      hint: "Manage app settings",
      visible: false,
    },
    {
      icon: "book",
      pressIcon: "Book",
      hint: "Checkout Dictionary",
      visible: false,
    },
    {
      icon: "info",
      pressIcon: "About",
      hint: "Information about application",
      visible: false,
    },
    {
      icon: "auto-stories",
      pressIcon: "Multi-Content",
      hint: "View content parallelly",
      visible: false,
    },
    {
      icon: "receipt",
      pressIcon: "Bible-Stories",
      hint: "Read Bible stories",
      visible: false,
    },
    {
      icon: "event",
      pressIcon: "Reading-Plans",
      hint: "Access Reading Plan",
      visible: false,
    },
  ]);
  const styleFile = styles(props.colorFile, props.sizeFile);
  var animatedValue = new Animated.Value(0);
  const handlePressIn = (index) => {
    setIndex(index);
    Animated.spring(animatedValue, {
      toValue: 0,
    }).start();
  };
  const showHints = (icon, index) => {
    let visibility = [...iconName];
    visibility[index] = { ...visibility[index], visible: true };
    setIconName(visibility);
  };
  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
    }).start();
  };
  const renderItem = ({ item, index }) => {
    const animatedStyle = {
      transform: [{ scale: animatedValue }],
    };
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <TouchableWithoutFeedback
          style={{
            width: width / 5,
          }}
          onPress={() => showHints(item.pressIcon, index)}
          onPressIn={() => handlePressIn(index)}
          onPressOut={() => handlePressOut()}
        >
          <Animated.View
            style={[
              styleFile.AnimatedViewCustom,
              { alignItems: "center" },
              props.doAnimate == true && index == Index ? animatedStyle : null,
            ]}
          >
            {item.icon == "book-open-variant" ? (
              <MaterialCommunityIcons
                name={item.icon}
                size={constantFont.iconLarge}
                style={styleFile.iconColor}
              />
            ) : (
              <Icon
                name={item.icon}
                size={constantFont.iconLarge}
                style={styleFile.iconColor}
              />
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={[styleFile.textView, { alignItems: "flex-start" }]}>
          <View style={styleFile.textRow}>
            <Text style={styleFile.textStyle}>
              {item.visible ? item.hint : null}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  useEffect(() => {
    animatedValue = new Animated.Value(1);
  }, []);

  return (
    <View style={styleFile.container}>
      <FlatList data={iconName} renderItem={renderItem} />
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(Help);
