import React, {
  Component,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
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
const width = Dimensions.get("window").width;

//OT- old-testment
//NT- new-testment
const SelectBook = (props) => {
  const [activeTab, setActiveTab] = useState(true);
  const [NTSize, setNTSize] = useState(0);
  const [OTSize, setOTSize] = useState(0);
  const prevBooks = useRef(props.books).current;
  // console.log("PREV BOOKS ",prevBooks)
  let viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 100,
    waitForInteraction: true,
  }).current;
  const flatlistRef = useRef();
  const style = styles(props.colorFile, props.sizeFile);
  const toggleButton = (value) => {
    console.log("button toggle ", value);
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
    // console.log("ITEM ",item)
    console.log(items.bookId, items.bookName, items.numOfChapters, "gg");
    props.navigation.navigate("Chapters", {
      selectedBookId: items.bookId,
      selectedBookName: items.bookName,
      totalChapters: items.numOfChapters,
    });
  };
  const getOTSize = () => {
    let count = 0;
    if (props.books) {
      if (props.books.length == 0) {
        setOTSize(0);
      } else {
        for (let i = 0; i < props.books.length; i++) {
          if (props.books[i].bookNumber <= 39) {
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
    if (props.books) {
      if (props.books.length == 0) {
        setNTSize(0);
      } else {
        for (let i = props.books.length - 1; i >= 0; i--) {
          if (props.books[i].bookNumber >= 40) {
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
    if (prevBooks !== props.books) {
      getOTSize();
      getNTSize();
      selectTab();
    }
  }, [prevBooks, props.books, setActiveTab]);
  const selectTab = () => {
    let bookData = null;
    let bookIndex = -1;
    if (props.books.length > 0) {
      for (let i = 0; i < props.books.length; i++) {
        if (props.books[i].bookId == props.route.params.selectedBookId) {
          bookData = props.books[i];
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
  console.log(activeTab, "books data");
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
            data={props.books}
            getItemLayout={(data, index) => getItemLayout(data, index)}
            renderItem={renderItem}
            extraData={style}
            keyExtractor={(item) => item.bookNumber}
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
    books: state.versionFetch.versionBooks,
    isLoading: state.versionFetch.isLoading,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
export default connect(mapStateToProps, null)(SelectBook);
