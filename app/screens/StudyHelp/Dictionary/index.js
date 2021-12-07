import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card, CardItem } from "native-base";
import { connect } from "react-redux";
import { styles } from "./styles.js";
import vApi from "../../../utils/APIFetch";
import Colors from "../../../utils/colorConstants";
import ListContainer from "../../../components/Common/FlatList.js";

class Infographics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dictionaries: [],
      isLoading: false,
    };
    this.styles = styles(this.props.colorFile, this.props.sizeFile);
  }
  componentDidMount() {
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        try {
          const apiData = await vApi.get("dictionaries");
          if (apiData) {
            for (var i = 0; i < apiData.length; i++) {
              if (
                apiData[i].language.toLowerCase() ===
                this.props.languageName.toLowerCase()
              ) {
                this.setState({ dictionaries: apiData[i].dictionaries });
              }
            }
          }
        } catch (error) {
          console.log(error.message);
        }
        this.setState({
          isLoading: false,
        });
      }
    );
  }
  emptyMessageNavigation = () => {
    this.props.navigation.navigate("Bible");
  };
  gotoDicionary = (sourceId) => {
    this.props.navigation.navigate("DictionaryWords", {
      dictionarySourceId: sourceId,
      metadata: this.state.dictionaries,
    });
  };
  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={this.styles.infoView}
          onPress={() => this.gotoDicionary(item.sourceId)}
        >
          <Card>
            <CardItem style={this.styles.cardItemStyle}>
              <Text style={this.styles.dictionaryText}>{item.name}</Text>
            </CardItem>
          </Card>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    "dictionaries ", this.state.dictionaries;
    return (
      <View style={[this.styles.container, { padding: 8 }]}>
        {this.state.isLoading ? (
          <ActivityIndicator
            size="small"
            color={Colors.Blue_Color}
            animate={true}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          />
        ) : (
          <ListContainer
            listData={this.state.dictionaries}
            listStyle={this.styles.centerEmptySet}
            renderItem={this.renderItem}
            icon="book"
            iconStyle={this.styles.emptyMessageIcon}
            containerStyle={this.styles.emptyMessageContainer}
            textStyle={this.styles.messageEmpty}
            message={`No Dictionary for ${this.props.languageName}`}
            onPress={this.emptyMessageNavigation}
          />
        )}
      </View>
    );
  }
}

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
