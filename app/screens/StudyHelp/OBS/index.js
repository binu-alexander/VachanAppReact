import React, { createRef, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Markdown from "react-native-markdown-display";
import ModalDropdown from "react-native-modal-dropdown";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles.js";
import Colors from "../../../utils/colorConstants";

const Github_URL =
  "https://raw.githubusercontent.com/Bridgeconn/vachancontentrepository/master/obs/";

const OBS = (props) => {
  const [languagesList, setLanguagesList] = useState([]);
  const [langCode, setLangCode] = useState(props.languageCode);
  const [obsData, setObsData] = useState(null);
  const [obsLang, setObsLang] = useState([]);
  const [defaultLanguage, setDefaultLanguage] = useState(props.languageName);
  const [defaultStory, setDefaultStory] = useState(storyList);
  const [storyList, setStoryList] = useState([]);
  const [bsIndex, setBsIndex] = useState("01");
  let _dropdown_1 = createRef();
  let _dropdown_2 = createRef();
  const style = styles(props.colorFile, props.sizeFile);

  const fetchGitData = async (url) => {
    const data = await fetch(Github_URL + url);
    const res = await data.json();
    return res;
  };

  const fetchLangList = async () => {
    let urlLan = "languages.json";
    fetchGitData(urlLan)
      .then((lan) => {
        if (lan) {
          let obslangList = [];
          let foundLangCode = false;
          for (let key in lan) {
            obslangList.push(lan[key]);
            if (key === langCode) {
              foundLangCode = true;
              setLangCode(key);
              setDefaultLanguage(lan[key]);
              bibleStoryList();
              mdFileFetch();
            }
          }
          if (!foundLangCode) {
            setLangCode(Object.keys(lan)[0]);
            setDefaultLanguage(lan[Object.keys(lan)[0]]);
            bibleStoryList();
            mdFileFetch();
          }
          setObsLang(obslangList);
          setLanguagesList([...languagesList, lan]);
        }
      })
      .catch((error) => {});
  };
  const mdFileFetch = async () => {
    fetch(Github_URL + langCode + "/content/" + bsIndex + ".md")
      .then((response) => response.text())
      .then((json) => {
        setObsData(json);
      })
      .catch((error) => {
        setObsData(null);
      });
  };
  const bibleStoryList = async () => {
    let url = langCode + "/manifest.json";
    fetchGitData(url)
      .then((data) => {
        let storyLists = [];
        for (var i = 0; i < data.length; i++) {
          storyLists.push(i + 1 + ". " + data[i]);
        }
        setStoryList(storyLists);
        setDefaultStory(storyLists[0]);
      })
      .catch((error) => {
        console.log(error.message);
        setStoryList([storyList]);
      });
  };

  const onSelectLang = (index, lang) => {
    for (var key in languagesList[0]) {
      if (languagesList[0][key] === lang) {
        console.log(key, "onlan");
        setLangCode(key);
        mdFileFetch();
        bibleStoryList();
        let selectedStoryIndex = bsIndex.replace(/^0+/, "");
        _dropdown_2.select(parseInt(selectedStoryIndex - 1));
      }
    }
  };

  const onSelectStory = (index) => {
    let num = index + 1;
    let bsIndexs = ("0" + num).slice(-2);
    setBsIndex(bsIndexs);
    mdFileFetch();
  };
  useEffect(() => {
    let selectedStoryIndex = bsIndex.replace(/^0+/, "");
    _dropdown_2.select(parseInt(selectedStoryIndex - 1));
  }, [...storyList, defaultStory]);
  useEffect(() => {
    fetchLangList();
  }, []);
  useEffect(() => {
    bibleStoryList();
    mdFileFetch();
  }, [langCode, defaultLanguage, bsIndex]);
  return (
    <View style={style.container}>
      <View style={style.dropdownView}>
        <TouchableOpacity
          onPress={() => {
            _dropdown_1 && _dropdown_1.show();
          }}
          style={style.dropdownPos}
        >
          <ModalDropdown
            ref={(el) => (_dropdown_1 = el)}
            options={obsLang}
            onSelect={onSelectLang}
            defaultValue={defaultLanguage}
            isFullWidth={true}
            dropdownStyle={style.dropdownSize}
            dropdownTextStyle={style.dropdownTextStyleModal}
            textStyle={style.dropdownText}
          />
          <Icon
            name="arrow-drop-down"
            color={props.colorFile.iconColor}
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            _dropdown_2 && _dropdown_2.show();
          }}
          style={style.dropdownPos}
        >
          <ModalDropdown
            ref={(el) => (_dropdown_2 = el)}
            options={storyList}
            onSelect={onSelectStory}
            style={{ paddingRight: 20 }}
            defaultValue={defaultStory}
            isFullWidth={true}
            dropdownStyle={style.dropdownSize}
            dropdownTextStyle={style.dropdownTextStyleModal}
            textStyle={style.dropdownText}
          />
          <Icon
            name="arrow-drop-down"
            color={props.colorFile.iconColor}
            size={20}
          />
        </TouchableOpacity>
      </View>
      {obsData ? (
        <ScrollView
          // contentInsetAdjustmentBehavior="automatic"
          style={style.scrollView}
          // contentContainerStyle={{paddingTop:20}}
        >
          <Markdown style={style}>{obsData}</Markdown>
        </ScrollView>
      ) : (
        <ActivityIndicator
          animate={true}
          size="small"
          color={Colors.Blue_Color}
          style={style.loaderPos}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(OBS);
