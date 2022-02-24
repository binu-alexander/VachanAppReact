import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card, CardItem } from "native-base";
import { connect } from "react-redux";
import { styles } from "./styles.js";
import vApi from "../../../utils/APIFetch";
import Colors from "../../../utils/colorConstants";
import ListContainer from "../../../components/Common/FlatList.js";

const Infographics = (props) => {
  const { colorFile, sizeFile, languageName } = props
  const [dictionaries, setDictionaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const style = styles(colorFile, sizeFile);
  const dictionaryData = async () => {
    setIsLoading(true);
    try {
      const apiData = await vApi.get("dictionaries");
      if (apiData) {
        for (var i = 0; i < apiData.length; i++) {
          if (
            apiData[i].language.toLowerCase() ===
            languageName.toLowerCase()
          ) {
            setDictionaries(apiData[i].dictionaries);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    dictionaryData()
  }, []);
  const emptyMessageNavigation = () => {
    props.navigation.navigate("Bible");
  };
  const gotoDicionary = (sourceId) => {
    props.navigation.navigate("DictionaryWords", {
      dictionarySourceId: sourceId,
      metadata: dictionaries,
    });
  };
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={style.infoView}
          onPress={() => gotoDicionary(item.sourceId)}
        >
          <Card>
            <CardItem style={style.cardItemStyle}>
              <Text style={style.dictionaryText}>{item.name}</Text>
            </CardItem>
          </Card>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={[style.container, { padding: 8 }]}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={Colors.Blue_Color}
          animate={true}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <ListContainer
          listData={dictionaries}
          listStyle={style.centerEmptySet}
          renderItem={renderItem}
          icon="book"
          iconStyle={style.emptyMessageIcon}
          containerStyle={style.emptyMessageContainer}
          textStyle={style.messageEmpty}
          message={`No Dictionary for ${props.languageName}`}
          onPress={emptyMessageNavigation}
        />
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    books: state.versionFetch.versionBooks,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  };
};

export default connect(mapStateToProps, null)(Infographics);
