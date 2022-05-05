import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Segment, Button } from "native-base";
import { styles } from "./styles.js";
import { connect } from "react-redux";
import Spinner from "react-native-loading-spinner-overlay";
import Color from "../../../utils/colorConstants";
import { MainContext } from "../../../context/MainProvider.js";
const width = Dimensions.get("window").width;

//OT- old-testment
//NT- new-testment
const SelectBook = (props) => {
  const [activeTab, setActiveTab] = useState(true);
  const [NTSize, setNTSize] = useState(0);
  const [OTSize, setOTSize] = useState(0);
  let viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
    waitForInteraction: true,
  }).current;
  const flatlistRef = useRef();
  const { bookList } = useContext(MainContext);
  const style = styles(props.colorFile, props.sizeFile);
  const toggleButton = (value) => {
    setActiveTab(value);
    if (value === false) {
      flatlistRef.current.scrollToIndex({
        index: OTSize,
        viewPosition: 0,
        animated: false,
        viewOffset: 0,
      });
    } else {
      flatlistRef.current.scrollToIndex({
        index: 0,
        viewPosition: 0,
        animated: false,
        viewOffset: 0,
      });
    }
  };
  const getItemLayout = (data, index) => ({
    length: 48,
    offset: 48 * index,
    index,
  });
  const navigateTo = (items) => {
    props.navigation.navigate("Chapters", {
      selectedBookId: items.bookId,
      selectedBookName: items.bookName,
      totalChapters: items.numOfChapters,
    });
  };
  const getOTSize = () => {
    let count = 0;
    if (bookList) {
      if (bookList.length == 0) {
        setOTSize(0);
      } else {
        for (let i = 0; i < bookList.length; i++) {
          if (bookList[i].bookNumber <= 39) {
            count++;
          } else {
            break;
          }
        }
      }
    }
    setOTSize(count);
  };

  const getNTSize = () => {
    let count = 0;
    if (bookList) {
      if (bookList.length == 0) {
        setNTSize(0);
      } else {
        for (let i = bookList.length - 1; i >= 0; i--) {
          if (bookList[i].bookNumber >= 40) {
            count++;
          } else {
            break;
          }
        }
      }
    }
    setNTSize(count);
  };
  useEffect(() => {
    getOTSize();
    getNTSize();
    selectTab();
  }, []);
  useEffect(() => {
    getOTSize();
    getNTSize();
    selectTab();
  }, [setActiveTab]);
  const selectTab = () => {
    let bookData = null;
    let bookIndex = -1;
    if (bookList.length > 0) {
      for (let i = 0; i < bookList.length; i++) {
        if (bookList[i].bookId == props.route.params.selectedBookId) {
          bookData = bookList[i];
          bookIndex = i;
        }
      }
      if (bookData && bookIndex != -1) {
        if (bookData.bookNumber > 40) {
          setActiveTab(false);
        } else {
          setActiveTab(true);
        }
        let wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(() => {
          if (flatlistRef.current) {
            flatlistRef.current.scrollToIndex({
              index: bookIndex,
              viewPosition: 0,
              animated: false,
              viewOffset: 0,
            });
          }
        });
      }
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigateTo(item)}>
        <View style={style.bookList}>
          <Text
            style={[
              style.textStyle,
              {
                fontWeight:
                  item.bookId === props.route.params.selectedBookId
                    ? "bold"
                    : "normal",
                color:
                  item.bookId === props.route.params.selectedBookId
                    ? props.colorFile.blueText
                    : props.colorFile.textColor,
              },
            ]}
          >
            {item.bookName}
          </Text>
          <Icon
            name="chevron-right"
            color={Color.Gray}
            style={style.iconCustom}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const onViewableItemsChanged = useRef((viewableItems) => {
    if (viewableItems.length > 0) {
      if (viewableItems[0].index <= OTSize) {
        // toggel to OT
        setActiveTab(activeTab);
      } else {
        // toggle to NT
        setActiveTab(!activeTab);
      }
    }
  });
  return (
    <View style={style.container}>
      {props.isLoading ? (
        <Spinner visible={true} textContent={"Loading..."} />
      ) : (
        <View style={style.bookNameContainer}>
          <Segment>
            {OTSize > 0 ? (
              <Button
                active={activeTab}
                style={[
                  {
                    width: NTSize == 0 ? width : (width * 1) / 2,
                  },
                  activeTab ? style.activeBgColor : style.inactiveBgColor,
                  style.segmentButton,
                ]}
                onPress={() => toggleButton(true)}
              >
                <Text
                  style={
                    activeTab ? style.inactivetabText : style.activetabText
                  }
                >
                  Old Testament
                </Text>
              </Button>
            ) : null}
            {NTSize > 0 ? (
              <Button
                active={!activeTab}
                style={[
                  {
                    width: OTSize == 0 ? width : (width * 1) / 2,
                  },
                  !activeTab ? style.activeBgColor : style.inactiveBgColor,
                  style.segmentButton,
                ]}
                onPress={() => toggleButton(false)}
              >
                <Text
                  active={!activeTab}
                  style={[
                    !activeTab ? style.inactivetabText : style.activetabText,
                    style.buttonText,
                  ]}
                >
                  New Testament
                </Text>
              </Button>
            ) : null}
          </Segment>
          <FlatList
            ref={flatlistRef}
            data={bookList}
            getItemLayout={(data, index) => getItemLayout(data, index)}
            renderItem={renderItem}
            extraData={style}
            keyExtractor={(item) => item.bookId}
            onViewableItemsChanged={onViewableItemsChanged.current}
            viewabilityConfig={viewabilityConfig}
            contentContainerStyle={{ paddingBottom: 60 }}
            ListFooterComponent={<View style={{ marginBottom: 84 }} />}
          />
        </View>
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    isLoading: state.versionFetch.isLoading,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
export default connect(mapStateToProps, null)(SelectBook);
