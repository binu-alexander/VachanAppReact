/* eslint-disable no-prototype-builtins */
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  Modal,
  Text,
  Alert,
  View,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { connect } from "react-redux";
import { Accordion } from "native-base";
import { vachanAPIFetch } from "../../../store/action/index";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import Color from "../../../utils/colorConstants";
import ReloadButton from "../../../components/ReloadButton";
import vApi from "../../../utils/APIFetch";

const DictionaryWords = (props) => {
  const { dictionaryContent, route, colorFile, sizeFile } = props
  console.log(" params ", route.params)
  const dictionarySourceId = route.params
    ? route.params.dictionarySourceId
    : null;
  const dicMetaData = route.params
    ? route.params.metadata[0].metadata
    : null;
  const [modalVisibleDictionary, setModalVisibleDictionary] = useState(false);
  const [wordDescription, setWordDescription] = useState([]);
  const [metadataVisible, setMetadataVisible] = useState(false);
  const isLoading = false;
  const style = styles(colorFile, sizeFile);
  let alertPresent = false;
  const fetchWord = async (word) => {
    try {
      var wordDescription = await vApi.get(
        "dictionaries/" + dictionarySourceId + "/" + word.wordId
      );
      setWordDescription(wordDescription.meaning);
      setModalVisibleDictionary(true);
    } catch (error) {
      setWordDescription([]);
      setModalVisibleDictionary(false);
    }
  };
  const _renderHeader = (item, expanded) => {
    return (
      <View style={style.headerStyle}>
        <Text style={style.headerText}> {item.letter}</Text>
        <Icon
          style={style.iconStyle}
          name={expanded ? "keyboard-arrow-down" : "keyboard-arrow-up"}
          size={24}
        />
      </View>
    );
  };
  const _renderContent = (item) => {
    return item.words.map((w, i) => (
      <TouchableOpacity
        key={i}
        style={{
          padding: 20,
        }}
        onPress={() => fetchWord(w)}
      >
        <Text style={style.textDescription}>{w.word}</Text>
      </TouchableOpacity>
    ));
  };
  const errorMessage = () => {
    if (!alertPresent) {
      alertPresent = true;
      if (props.dictionaryContent.length === 0) {
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

        props.vachanAPIFetch("dictionaries/" + props.dictionarySourceId);
      } else {
        alertPresent = false;
      }
    }
  };
  const updateData = () => {
    if (props.error) {
      errorMessage();
    } else {
      return;
    }
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ margin: 8 }}
          onPress={() => setMetadataVisible(!metadataVisible)}
        >
          <Icon name="info" size={20} color="#fff" />
        </TouchableOpacity>
      ),
    });
    props.vachanAPIFetch("dictionaries/" + dictionarySourceId);
  }, []);
  return (
    <View style={style.container}>
      {isLoading && <Spinner visible={true} textContent={"Loading..."} />}
      {props.error ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ReloadButton
            styles={style}
            reloadFunction={updateData}
            message={null}
          />
        </View>
      ) : (
        <View>
          <Accordion
            dataArray={dictionaryContent}
            animation={true}
            expanded={[0]}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
          />
          <Modal
            animated={true}
            transparent={true}
            visible={modalVisibleDictionary}
          >
            <View style={style.dictionaryModalView}>
              <View style={style.dicModalPos}>
                <Icon
                  name="cancel"
                  onPress={() => setModalVisibleDictionary(false)}
                  size={28}
                  color={Color.Blue_Color}
                  style={style.cancelIcon}
                />
                <ScrollView style={style.scrollViewModal}>
                  <Text style={style.textString}>
                    Description: {wordDescription.definition}
                  </Text>
                  <Text style={style.textString}>
                    Keyword: {wordDescription.keyword}
                  </Text>
                  {wordDescription.seeAlso != "" && (
                    <Text style={style.textString}>
                      See Also: {wordDescription.seeAlso}
                    </Text>
                  )}
                  <View style={{ marginBottom: 8 }} />
                </ScrollView>
              </View>
            </View>
          </Modal>
          <Modal animated={true} transparent={true} visible={metadataVisible}>
            <View
              style={[
                style.dictionaryModalView,
                { backgroundColor: "rgba(250,250,250,0.3)" },
              ]}
            >
              <View style={style.dic}>
                <Icon
                  name="cancel"
                  onPress={() => setMetadataVisible(false)}
                  size={28}
                  style={style.cancelIcon}
                />
                <ScrollView style={style.dictionScrollModal}>
                  <Text style={style.textString}>
                    {dicMetaData.hasOwnProperty("Description\u00a0")
                      ? (
                        <Text style={{ fontWeight: "900" }}>
                          Description :
                        </Text>
                      ) + dicMetaData["Description\u00a0"]
                      : null}
                  </Text>
                  <Text style={style.textString}>
                    {dicMetaData.hasOwnProperty("Technology Partner") ? (
                      <Text>
                        <Text style={{ fontWeight: "bold" }}>
                          {" "}
                          Technology Partner:
                        </Text>
                        <Text>{dicMetaData["Technology Partner"]}</Text>
                      </Text>
                    ) : null}
                  </Text>
                  <Text style={style.textString}>
                    {dicMetaData.hasOwnProperty("License") ? (
                      <Text>
                        <Text style={{ fontWeight: "bold" }}>License:</Text>
                        <Text>{dicMetaData["License"]}</Text>
                      </Text>
                    ) : null}
                  </Text>
                  <Text style={style.textString}>
                    {dicMetaData.hasOwnProperty("Revision (Name & Year)") ? (
                      <Text>
                        <Text style={{ fontWeight: "bold" }}>Revision:</Text>
                        <Text>{dicMetaData["License"]}</Text>
                      </Text>
                    ) : null}
                  </Text>
                  <Text style={style.textString}>
                    {dicMetaData.hasOwnProperty("Copyright Holder") ? (
                      <Text>
                        <Text style={{ fontWeight: "bold" }}>
                          Copyright Holder:
                        </Text>
                        <Text>{dicMetaData["Copyright Holder"]}</Text>
                      </Text>
                    ) : null}
                  </Text>
                  <View style={{ marginBottom: 8 }} />
                </ScrollView>
              </View>
            </View>
          </Modal>
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
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    dictionaryContent: state.vachanAPIFetch.apiData,
    contentLanguages: state.contents.contentLanguages,
    error: state.vachanAPIFetch.error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    vachanAPIFetch: (url) => dispatch(vachanAPIFetch(url)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DictionaryWords);
