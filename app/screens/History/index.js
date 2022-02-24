import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import DbQueries from "../../utils/dbQueries";
import { View } from "native-base";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Accordion } from "native-base";
import {
  updateVersion,
  updateVersionBook,
  fetchVersionBooks,
  updateMetadata,
} from "../../store/action/";
import { getBookChaptersFromMapping } from "../../utils/UtilFunctions";
import { styles } from "./styles.js";
import { connect } from "react-redux";

var moment = require("moment");

const History = (props) => {
  const [historyLists, setHistoryLists] = useState([
    { time: "Today", list: [] },
    { time: "Yesterday", list: [] },
    { time: "1 week ago", list: [] },
    { time: "1 month ago", list: [] },
    { time: "2 months ago", list: [] },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const style = styles(props.colorFile, props.sizeFile);
  const _renderHeader = (data, index, isActive) => {
    return (
      <View>
        <View style={style.historyHeader}>
          <Text style={style.accordionHeaderText}>{data.time}</Text>
          <Icon
            name={isActive ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            style={style.iconCustom}
          />
        </View>
      </View>
    );
  };
  const goToContent = async (item) => {
    props.updateVersion({
      language: item.languageName,
      languageCode: item.languageCode,
      versionCode: item.versionCode,
      sourceId: item.sourceId,
      downloaded: item.downloaded,
    });
    props.updateVersionBook({
      bookId: item.bookId,
      bookName: item.bookName,
      chapterNumber: item.chapterNumber,
      totalChapters: getBookChaptersFromMapping(item.bookId),
    });
    props.fetchVersionBooks({
      language: item.languageName,
      versionCode: item.versionCode,
      downloaded: item.downloaded,
      sourceId: item.sourceId,
    });
    var getVersionMetaData = await DbQueries.getVersionMetaData(
      item.languageName,
      item.versionCode,
      item.sourceId
    );
    if (getVersionMetaData && getVersionMetaData.length > 0) {
      props.updateMetadata({
        copyrightHolder: getVersionMetaData[0].copyrightHolder,
        description: getVersionMetaData[0].description,
        license: getVersionMetaData[0].license,
        source: getVersionMetaData[0].source,
        technologyPartner: getVersionMetaData[0].technologyPartner,
        revision: getVersionMetaData[0].revision,
        versionNameGL: getVersionMetaData[0].versionNameGL,
      });
    } else {
      props.updateMetadata({
        copyrightHolder: null,
        description: null,
        license: null,
        source: null,
        technologyPartner: null,
        revision: null,
        versionNameGL: null,
      });
    }
    props.navigation.navigate("Bible");
  };
  const _renderContent = (data) => {
    return (
      <View>
        {isLoading ? (
          <ActivityIndicator animate={true} />
        ) : (
          data.list.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                goToContent(item);
              }}
            >
              <Text style={style.contentText}>
                {" "}
                {item.languageName} {item.versionCode} {item.bookName}{" "}
                {item.chapterNumber}{" "}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };
  const fetchHighlightedData = async () => {
    setIsLoading(true);
    let historyData = await DbQueries.queryHistory();
    console.log(historyData, "data");
    if (historyData) {
      console.log(historyLists, "list");
      let historyList = [...historyLists];
      var date = new Date();
      var cur = moment(date).format("D");
      for (var i = 0; i < historyData.length; i++) {
        var end = moment(historyData[i].time).format("D");
        var timeDiff = Math.floor(cur - end);
        if (timeDiff == 0) {
          historyList[0].list.push(historyData[i]);
        }
        if (timeDiff == 1) {
          historyList[1].list.push(historyData[i]);
        }
        if (timeDiff >= 2 && timeDiff <= 7) {
          historyList[2].list.push(historyData[i]);
        }
        if (timeDiff > 7 && timeDiff <= 30) {
          historyList[3].list.push(historyData[i]);
        }
        if (timeDiff > 30) {
          historyList[4].list.push(historyData[i]);
        }
      }

      for (var j = 0; j < historyList.length; j++) {
        if (historyList[j].list.length == 0) {
          historyList.splice(j, 1);
          j--;
        }
      }
      setHistoryLists(historyList);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchHighlightedData()
  }, []);
  return (
    <View style={style.container}>
      {historyLists.length == 0 ? (
        <View style={style.emptyMessageContainer}>
          <Icon
            onPress={() => {
              props.navigation.navigate("Bible");
            }}
            name="import-contacts"
            style={style.emptyMessageIcon}
          />
          <Text style={style.messageEmpty}>Start reading</Text>
        </View>
      ) : (
        <Accordion
          dataArray={historyLists}
          expanded={[0]}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
        />
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    languageName: state.updateVersion.language,

    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateVersion: (value) => dispatch(updateVersion(value)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    updateMetadata: (payload) => dispatch(updateMetadata(payload)),
    updateVersionBook: (value) => dispatch(updateVersionBook(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(History);
