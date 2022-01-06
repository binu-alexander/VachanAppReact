import React, { useEffect, useRef, useState } from "react";
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
// class OBS extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       languagesList: [],
//       langCode: this.props.languageCode,
//       langCodeObj: {},
//       obsData: null,
//       obsLang: [],
//       defaultLanguage: "",
//       storyList: [],
//       bsIndex: "01",
//     };
//     this.styles = styles(this.props.colorFile, this.props.sizeFile);
//   }

//   componentDidMount() {
//     this.fetchLangList();
//   }
//   async fetchGitData(url) {
//     const data = await fetch(Github_URL + url);
//     const res = await data.json();
//     return res;
//   }
//   async fetchLangList() {
//     let urlLan = "languages.json";
//     this.fetchGitData(urlLan)
//       .then((lan) => {
//         if (lan) {
//           let obslangList = [];
//           let foundLangCode = false;
//           for (var key in lan) {
//             obslangList.push(lan[key]);
//             if (key == this.state.langCode) {
//               foundLangCode = true;
//               this.setState({ langCode: key, defaultLanguage: lan[key] });
//               this.bibleStoryList();
//               this.mdFileFetch();
//             }
//           }
//           if (!foundLangCode) {
//             this.setState(
//               {
//                 langCode: Object.keys(lan)[0],
//                 defaultLanguage: lan[Object.keys(lan)[0]],
//               },
//               () => {
//                 this.bibleStoryList();
//                 this.mdFileFetch();
//               }
//             );
//           }
//           console.log("LAGUAGE DID MOUNT ", lan);
//           this.setState({
//             obsLang: obslangList,
//             languagesList: [...this.state.languagesList, lan],
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error.message, "error");
//       });
//   }
//   async mdFileFetch() {
//     fetch(
//       Github_URL +
//         this.state.langCode +
//         "/content/" +
//         this.state.bsIndex +
//         ".md"
//     )
//       .then((response) => response.text())
//       .then((json) => {
//         this.setState({ obsData: json });
//       })
//       .catch((error) => {
//         console.log(error.message);
//         this.setState({ obsData: null });
//       });
//   }
//   async bibleStoryList() {
//     let url = this.state.langCode + "/manifest.json";
//     this.fetchGitData(url)
//       .then((data) => {
//         let storyList = [];
//         for (var i = 0; i < data.length; i++) {
//           storyList.push(i + 1 + ". " + data[i]);
//         }
//         this.setState({ storyList });
//       })
//       .catch((error) => {
//         console.log(error.message);
//         this.setState({ storyList: [] });
//       });
//   }

//   onSelectLang = (index, lang) => {
//     for (var key in this.state.languagesList[0]) {
//       if (this.state.languagesList[0][key] == lang) {
//         this.setState({ langCode: key }, () => {
//           this.mdFileFetch();
//           this.bibleStoryList();
//           let selectedStoryIndex = this.state.bsIndex.replace(/^0+/, "");
//           this._dropdown_2.select(parseInt(selectedStoryIndex - 1));
//         });
//       }
//     }
//   };

//   onSelectStory = (index) => {
//     let num = index + 1;
//     let bsIndex = ("0" + num).slice(-2);
//     this.setState({ bsIndex }, () => {
//       this.mdFileFetch();
//     });
//   };

//   componentDidUpdate(prevState) {
//     if (prevState.storyList != this.state.storyList) {
//       let selectedStoryIndex = this.state.bsIndex.replace(/^0+/, "");
//       this._dropdown_2.select(parseInt(selectedStoryIndex - 1));
//     }
//   }
//   render() {
//     return (
//       <View style={this.styles.container}>
//         <View style={this.styles.dropdownView}>
//           <TouchableOpacity
//             onPress={() => {
//               this._dropdown_1 && this._dropdown_1.show();
//             }}
//             style={this.styles.dropdownPos}
//           >
//             <ModalDropdown
//               ref={(el) => (this._dropdown_1 = el)}
//               options={this.state.obsLang}
//               onSelect={this.onSelectLang}
//               defaultValue={this.state.defaultLanguage}
//               isFullWidth={true}
//               dropdownStyle={this.styles.dropdownSize}
//               dropdownTextStyle={{ fontSize: 18 }}
//               textStyle={this.styles.dropdownText}
//             />
//             <Icon
//               name="arrow-drop-down"
//               color={this.props.colorFile.iconColor}
//               size={20}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               this._dropdown_2 && this._dropdown_2.show();
//             }}
//             style={this.styles.dropdownPos}
//           >
//             <ModalDropdown
//               ref={(el) => (this._dropdown_2 = el)}
//               options={this.state.storyList}
//               onSelect={this.onSelectStory}
//               style={{ paddingRight: 20 }}
//               defaultValue={
//                 this.state.storyList.length > 0 ? this.state.storyList[0] : ""
//               }
//               isFullWidth={true}
//               dropdownStyle={this.styles.dropdownSize}
//               dropdownTextStyle={{ fontSize: 18 }}
//               textStyle={this.styles.dropdownText}
//             />
//             <Icon
//               name="arrow-drop-down"
//               color={this.props.colorFile.iconColor}
//               size={20}
//             />
//           </TouchableOpacity>
//         </View>
//         {this.state.obsData ? (
//           <ScrollView
//             // contentInsetAdjustmentBehavior="automatic"
//             style={this.styles.scrollView}
//             // contentContainerStyle={{paddingTop:20}}
//           >
//             <Markdown style={this.styles}>{this.state.obsData}</Markdown>
//           </ScrollView>
//         ) : (
//           <ActivityIndicator
//             animate={true}
//             size="small"
//             color={Colors.Blue_Color}
//             style={this.styles.loaderPos}
//           />
//         )}
//       </View>
//     );
//   }
// }
const OBS = (props) => {
  const [languagesList, setLanguagesList] = useState([]);
  const [langCode, setLangCode] = useState(props.languageCode);
  const [obsData, setObsData] = useState(null);
  const [obsLang, setObsLang] = useState([]);
  const [defaultLanguage, setDefaultLanguage] = useState("");
  const [storyList, setStoryList] = useState([]);
  const [bsIndex, setBsIndex] = useState("01");
  const prevStory = useRef(storyList).current;
  const style = styles(props.colorFile, props.sizeFile);
  let _dropdown_1;
  let _dropdown_2;
  const fetchGitData = async (url) => {
    const data = await fetch(Github_URL + url);
    const res = await data.json();
    return res;
  };
  const mdFileFetch = async () => {
    fetch(Github_URL + langCode + "/content/" + bsIndex + ".md")
      .then((response) => response.text())
      .then((json) => {
        setObsData(json);
      })
      .catch((error) => {
        console.log(error.message);
        setObsData(null);
      });
  };
  const onSelectLang = (index, lang) => {
    for (var key in languagesList[0]) {
      if (languagesList[0][key] == lang) {
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

  const bibleStoryList = async () => {
    let url = langCode + "/manifest.json";
    fetchGitData(url)
      .then((data) => {
        let storyLists = [];
        for (var i = 0; i < data.length; i++) {
          storyLists.push(i + 1 + ". " + data[i]);
        }
        setStoryList(storyLists);
      })
      .catch((error) => {
        console.log(error.message);
        setStoryList([]);
      });
  };

  const fetchLangList = async () => {
    let urlLan = "languages.json";
    fetchGitData(urlLan)
      .then((lan) => {
        if (lan) {
          let obslangList = [];
          let foundLangCode = false;
          for (var key in lan) {
            obslangList.push(lan[key]);
            if (key == langCode) {
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
      .catch((error) => {
        console.log(error.message, "error");
      });
  };

  useEffect(async () => {
    fetchLangList();
    if (prevStory != storyList) {
      let selectedStoryIndex = bsIndex.replace(/^0+/, "");
      _dropdown_2.select(parseInt(selectedStoryIndex - 1));
    }
  }, [languagesList, storyList, obsData]);
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
            dropdownTextStyle={{ fontSize: 18 }}
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
            defaultValue={storyList.length > 0 ? storyList[0] : ""}
            isFullWidth={true}
            dropdownStyle={style.dropdownSize}
            dropdownTextStyle={{ fontSize: 18 }}
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
