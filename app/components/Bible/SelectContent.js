import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialIcons";
import { Card, Accordion } from "native-base";
import {
  updateContentType,
  parallelVisibleView,
  fetchAllContent,
  fetchVersionBooks,
  parallelMetadta,
  selectContent,
} from "../../store/action/";
import { styles } from "../../screens/LanguageList/styles";
import { connect } from "react-redux";
import Color from "../../utils/colorConstants";

var contentType = "";

const SelectContent = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  let alertPresent = false;
  let style = styles(props.colorFile, props.sizeFile);
  
  const innerContent = (item,v,parallel)=>{
    setModalVisible(false)
    props.parallelVisibleView({
      modalVisible: false,
      visibleParallelView: modalVisible == true && parallel
    })
    props.selectContent({
      parallelLanguage: {
        languageName: item.languageName,
        versionCode: v.versionCode,
        sourceId: v.sourceId,
      },
      parallelMetaData: v.metaData[0],
    })
    props.updateContentType({
      parallelContentType: contentType,
    })
  }
  const _renderHeader = (item, expanded) => {
    var value = expanded && item.contentType;
    if (value) {
      contentType = value;
    }

    return (
      <View>
        {props.displayContent == "commentary" ? (
          item.contentType == props.displayContent && (
            <View style={style.accordionHeader}>
              <Text style={style.accordionHeaderText}>
                {" "}
                {item.contentType == props.displayContent &&
                  item.contentType.charAt(0).toUpperCase() +
                    item.contentType.slice(1)}
              </Text>
              <Icon
                style={style.iconStyleSelection}
                name="keyboard-arrow-down"
                size={24}
              />
            </View>
          )
        ) : (
          <View style={style.accordionHeader}>
            <Text style={style.accordionHeaderText}>
              {" "}
              {item.contentType.charAt(0).toUpperCase() +
                item.contentType.slice(1)}
            </Text>
            <Icon
              style={style.iconStyleSelection}
              name="keyboard-arrow-down"
              size={24}
            />
          </View>
        )}
      </View>
    );
  };

  const _renderHeaderInner = (item) => {
    return (
      <View>
        {props.displayContent == "commentary" ? (
          contentType == props.displayContent && (
            <View style={style.headerInner}>
              <Text style={style.selectionHeaderModal}>
                {" "}
                {item.languageName}
              </Text>
              <Icon
                style={style.iconStyleSelection}
                name="keyboard-arrow-down"
                size={24}
              />
            </View>
          )
        ) : (
          <View style={style.headerInner}>
            <Text style={style.selectionHeaderModal}> {item.languageName}</Text>
            <Icon
              style={style.iconStyleSelection}
              name="keyboard-arrow-down"
              size={24}
            />
          </View>
        )}
      </View>
    );
  };

  const _renderContentInner = (item) => {
    return item.versionModels.map((v) =>
      props.displayContent == "commentary" ? (
        contentType == props.displayContent && (
          <TouchableOpacity
            style={style.selectionInnerContent}
            onPress={()=>innerContent(item,v,false)}
          >
            <Text style={style.selectionHeaderModal}>{v.versionName}</Text>
            <Text style={style.selectionHeaderModal}>{v.versionCode}</Text>
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity
          style={style.selectionInnerContent}
          onPress={()=>innerContent(item,v,true)}
        >
          <Text style={style.selectionHeaderModal}>{v.versionName}</Text>
          <Text style={style.selectionHeaderModal}>{v.versionCode}</Text>
        </TouchableOpacity>
      )
    );
  };

  const _renderContent = (item) => {
    return (
      <Accordion
        dataArray={item.content}
        animation={true}
        expanded={[0]}
        renderHeader={_renderHeaderInner}
        renderContent={_renderContentInner}
      />
    );
  };

  const errorMessage = () => {
    // if(this.props.netConnection){
    if (!alertPresent) {
      alertPresent = true;
      if (
        props.error ||
        props.availableContents.length == 0 ||
        props.availableContents.length == 0
      ) {
        setModalVisible(false);
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
        props.fetchAllContent();
      } else {
        setModalVisible(!modalVisible);
        alertPresent = false;
      }
    }
    // }else{
    //   Alert.alert("", "Check your internet connection", [{ text: 'OK', onPress: () => { this.alertPresent = false } }], { cancelable: false });
    // }
  };
  const onPressModal = () => {
    errorMessage();
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onPress={() => setModalVisible(!modalVisible)}
      >
        <View>
          <TouchableWithoutFeedback
            style={style.modalContainer}
            onPressOut={() =>  setModalVisible(false)}
          >
            <View
              style={{ height: "80%", width: "70%", alignSelf: "flex-end" }}
            >
              <Card style={{ marginTop: 40 }}>
                {props.availableContents.length > 0 && (
                  <Accordion
                    dataArray={props.availableContents}
                    animation={true}
                    expanded={[0]}
                    renderHeader={_renderHeader}
                    renderContent={_renderContent}
                  />
                )}
              </Card>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={onPressModal}
        style={props.navStyles.touchableStyleRight}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {props.title ? (
            <Text
              style={{
                color: Color.White,
                fontSize: 18,
                fontWeight: "normal",
              }}
            >
              {props.title}
            </Text>
          ) : null}
          {props.iconName ? (
            <MaterialCommunityIcons
              name={props.iconName}
              color={Color.White}
              size={26}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    availableContents: state.contents.contentLanguages,
    error: state.contents.error,
    contentType: state.updateVersion.parallelContentType,
    baseAPI: state.updateVersion.baseAPI,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
    netConnection: state.updateStyling.netConnection,
    modalVisible: state.selectContent.modalVisible,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateContentType: (content) => dispatch(updateContentType(content)),
    fetchAllContent: (value) => dispatch(fetchAllContent(value)),
    fetchVersionBooks: (payload) => dispatch(fetchVersionBooks(payload)),
    parallelMetadta: (payload) => dispatch(parallelMetadta(payload)),
    selectContent: (payload) => dispatch(selectContent(payload)),
    parallelVisibleView: (payload) => dispatch(parallelVisibleView(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectContent);
