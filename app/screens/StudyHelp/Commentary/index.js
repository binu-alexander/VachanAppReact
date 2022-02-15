import React, { useEffect, useRef, useState, useContext } from "react";
import { FlatList, Alert, Text, View } from "react-native";
import { connect } from "react-redux";
import { Body, Header, Right, Title, Button } from "native-base";
import {
  vachanAPIFetch,
  fetchVersionBooks,
  parallelVisibleView,
} from "../../../store/action/index";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import Color from "../../../utils/colorConstants";
import ReloadButton from "../../../components/ReloadButton";
import HTML from "react-native-render-html";
import vApi from "../../../utils/APIFetch";
import securityVaraibles from "../../../../securityVaraibles";
import { BibleContext } from "../../Bible";
// import fetchCommentaryReducer from "../../../store/reducer/apiFetchReducer/vachanAPIFetch";
// import { cos } from "react-native-reanimated";

const commentaryKey = securityVaraibles.COMMENTARY_KEY
  ? "?key=" + securityVaraibles.COMMENTARY_KEY
  : "";

const Commentary = (props) => {
  const [{ currentVisibleChapter }] = useContext(BibleContext);
  const [error, setError] = useState(null);
  const [bookNameList, setBookNameList] = useState([]);
  const [bookName, setBookName] = useState(props.bookName);

  const style = styles(props.colorFile, props.sizeFile);
  let alertPresent = false;
  const fetchBookName = async () => {
    try {
      let response = await vApi.get("booknames");
      setBookNameList(response);
    } catch (error) {
      setError(error);
      setBookNameList([]);
    }
  };
  const errorMessage = () => {
    if (!alertPresent) {
      alertPresent = true;
      if (props.error || error) {
        Alert.alert(
          "",
          "Check your internet connection",
          [
            {
              text: "OK",
              onPress: () => {
                alertPresent = false;
              },
            },
          ],
          { cancelable: false }
        );
        if (props.parallelLanguage) {
          const url =
            "commentaries/" +
            props.parallelLanguage.sourceId +
            "/" +
            props.bookId +
            "/" +
            currentVisibleChapter +
            commentaryKey;
          props.vachanAPIFetch(url);
        }
      } else {
        alertPresent = false;
      }
    }
  };
  const updateData = () => {
    errorMessage();
  };
  const renderItem = ({ item }) => {
    return (
      <View style={{ padding: 10 }}>
        {item.verse &&
          (item.verse == 0 ? (
            <Text style={style.commentaryHeading}>Chapter Intro</Text>
          ) : (
            <Text style={style.commentaryHeading}>
              Verse Number : {item.verse}
            </Text>
          ))}
        <HTML
          baseFontStyle={style.textString}
          tagsStyles={{ p: style.textString }}
          html={item.text}
        />
      </View>
    );
  };
  const ListHeaderComponent = () => {
    return (
      <View>
        {props.commentaryContent &&
          props.commentaryContent.bookIntro == "" ? null : (
          <View style={style.cardItemBackground}>
            <Text style={style.commentaryHeading}>Book Intro</Text>
            <HTML
              baseFontStyle={style.textString}
              tagsStyles={{ p: style.textString }}
              html={
                props.commentaryContent && props.commentaryContent.bookIntro
              }
            />
          </View>
        )}
      </View>
    );
  };
  const renderFooter = () => {
    return (
      <View style={{ paddingVertical: 20 }}>
        {props.commentaryContent && props.commentaryContent.commentaries && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {props.parallelMetaData?.revision !== null &&
              props.parallelMetaData?.revision !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metadataText}>
                  <Text>Copyright:</Text> {props.parallelMetaData?.revision}
                </Text>
              )}
            {props.parallelMetaData?.copyrightHolder !== null &&
              props.parallelMetaData?.copyrightHolder !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metadataText}>
                  <Text>License:</Text>{" "}
                  {props.parallelMetaData?.copyrightHolder}
                </Text>
              )}
            {props.parallelMetaData?.license !== null &&
              props.parallelMetaData?.license !== "" && (
                <Text textBreakStrategy={"simple"} style={style.metadataText}>
                  <Text>Technology partner:</Text>{" "}
                  {props.parallelMetaData?.license}
                </Text>
              )}
          </View>
        )}
      </View>
    );
  };
  const fetchCommentary = () => {
    if (props.parallelLanguage) {
      let url =
        "commentaries/" +
        props.parallelLanguage.sourceId +
        "/" +
        props.bookId +
        "/" +
        currentVisibleChapter +
        commentaryKey;
      console.log("URL UPDATE ", url);
      props.vachanAPIFetch(url);
      fetchBookName();
      updateBookName();
    }
  };
  useEffect(() => {
    fetchCommentary();
  }, []);
  useEffect(() => {
    fetchCommentary();
  }, [props.bookId, currentVisibleChapter]);
  const updateBookName = () => {
    if (bookNameList) {
      for (var i = 0; i <= bookNameList.length - 1; i++) {
        let parallelLanguage =
          props.parallelLanguage &&
          props.parallelLanguage.languageName.toLowerCase();
        if (bookNameList[i].language.name === parallelLanguage) {
          for (var j = 0; j <= bookNameList[i].bookNames.length - 1; j++) {
            var bId = bookNameList[i].bookNames[j].book_code;
            if (bId == props.bookId) {
              let bookName = bookNameList[i].bookNames[j].short;
              setBookName(bookName);
            }
          }
        }
      }
    } else {
      return;
    }
  };
  const closeParallelView = (value) => {
    props.parallelVisibleView({
      modalVisible: false,
      visibleParallelView: value,
    });
  };
  return (
    <View style={style.container}>
      <Header
        style={{
          backgroundColor: Color.Blue_Color,
          height: 40,
          borderLeftWidth: 0.5,
          borderLeftColor: Color.White,
        }}
      >
        <Body>
          <Title style={{ fontSize: 16 }}>
            {props.parallelLanguage && props.parallelLanguage.versionCode}
          </Title>
        </Body>
        <Right>
          <Button transparent onPress={() => closeParallelView(false)}>
            <Icon name="cancel" color={Color.White} size={20} />
          </Button>
        </Right>
      </Header>

      {props.error ? (
        <View style={style.reloadButtonPos}>
          <ReloadButton
            style={style}
            reloadFunction={updateData}
            message={null}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={[style.commentaryHeading, { margin: 10 }]}>
            {bookName != null && bookName} { }{" "}
            {props.commentaryContent && props.commentaryContent.chapter}
          </Text>
          <FlatList
            data={
              props.commentaryContent && props.commentaryContent.commentaries
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, margin: 16 }}
            renderItem={renderItem}
            ListFooterComponent={<View style={style.listFooter}></View>}
            ListHeaderComponent={ListHeaderComponent}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            ListFooterComponent={renderFooter}
          />
        </View>
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.updateVersion.language,
    versionCode: state.updateVersion.versionCode,
    sourceId: state.updateVersion.sourceId,
    bookId: state.updateVersion.bookId,
    bookName: state.updateVersion.bookName,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    books: state.versionFetch.versionBooks,
    commentaryContent: state.vachanAPIFetch.apiData,
    error: state.vachanAPIFetch.error,
    parallelLanguage: state.selectContent.parallelLanguage,
    parallelMetaData: state.selectContent.parallelMetaData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    vachanAPIFetch: (payload) => dispatch(vachanAPIFetch(payload)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    parallelVisibleView: (payload) => dispatch(parallelVisibleView(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Commentary);
