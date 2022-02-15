import React, { useContext } from "react";
import { View, Dimensions } from "react-native";
import BibleChapter from "./BibleChapter";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomHeader from "./CustomHeader";
import SelectBottomTabBar from "./SelectBottomTabBar";
import ChapterNdAudio from "./ChapterNdAudio";
import ReloadButton from "../ReloadButton";
import Spinner from "react-native-loading-spinner-overlay";
import Color from "../../utils/colorConstants";
import { Header, Button, Title, Toast } from "native-base";
import HighlightColorGrid from "./HighlightColorGrid";
import CustomStatusBar from "../CustomStatusBar";
import Commentary from "../../screens/DrawerScreen/Commentary/index";
import { BibleContext } from "../../screens/Bible";
import AnimatedVerseList from "./AnimatedVerseList";
import { connect } from "react-redux";
const width = Dimensions.get("window").width;
const BibleMainComponent = (props) => {
  const { contentType, bookName, visibleParallelView } = props;
  const [
    {
      currentVisibleChapter,
      styles,
      chapterContent,
      showBottomBar,
      showColorGrid,
      queryBookFromAPI,
      bottomHighlightText,
      unAvailableContent,
      reloadMessage,
      navigateToSelectionTab,
      isLoading,
    },
  ] = useContext(BibleContext);
  return (
    <CustomStatusBar>
      <View style={styles.container}>
        {visibleParallelView ? (
          <View style={styles.headerView}>
            <Header style={{ backgroundColor: Color.Blue_Color, height: 40 }}>
              <Button transparent onPress={() => navigateToSelectionTab(true)}>
                <Title style={{ fontSize: 16 }}>
                  {bookName.length > 10
                    ? bookName.slice(0, 9) + "..."
                    : bookName}{" "}
                  {currentVisibleChapter}
                </Title>
                <Icon name="arrow-drop-down" color={Color.White} size={20} />
              </Button>
            </Header>
          </View>
        ) : (
          <CustomHeader />
        )}
        {isLoading && <Spinner visible={true} textContent={"Loading..."} />}
        {/** Main View for the single or parrallel View */}
        <View style={styles.singleView}>
          {/** Single view with only bible text */}
          <View
            style={[
              styles.innerContainer,
              { width: visibleParallelView ? "50%" : width },
            ]}
          >
            {unAvailableContent && chapterContent.length == 0 ? (
              <View style={styles.reloadButtonCenter}>
                <ReloadButton
                  styles={styles}
                  reloadFunction={() => queryBookFromAPI(null)}
                  message={reloadMessage}
                />
              </View>
            ) : (
              <AnimatedVerseList />
            )}
            {chapterContent.length > 0 && (
              <View style={{ flex: 1 }}>
                <ChapterNdAudio />
                {showColorGrid &&
                  bottomHighlightText &&
                  visibleParallelView == false && <HighlightColorGrid />}
                {visibleParallelView == false && showBottomBar && (
                  <SelectBottomTabBar />
                )}
              </View>
            )}
          </View>
          {/** 2nd view as  parallelView**/}
          {visibleParallelView == true && (
            <View style={styles.parallelView}>
              {contentType == "bible" && <BibleChapter />}
              {contentType == "commentary" && <Commentary />}
            </View>
          )}
        </View>
      </View>
    </CustomStatusBar>
  );
};

const mapStateToProps = (state) => {
  return {
    bookName: state.updateVersion.bookName,
    contentType: state.updateVersion.parallelContentType,
    visibleParallelView: state.selectContent.visibleParallelView,
  };
};

export default connect(mapStateToProps, null)(BibleMainComponent);
