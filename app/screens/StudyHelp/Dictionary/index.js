

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, CardItem } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'
import { styles } from './styles.js'
import vApi from '../../../utils/APIFetch';
import Colors from '../../../utils/colorConstants';

class Infographics extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dictionaries: [],
      isLoading: false
    }
  }
  componentDidMount() {

    this.setState({
      isLoading: true
    }, async () => {
      try {
        const apiData = await vApi.get("dictionaries")
        if (apiData) {
          for (var i = 0; i < apiData.length; i++) {
            if (apiData[i].language.toLowerCase() === this.props.languageName.toLowerCase()) {
              this.setState({ dictionaries: apiData[i].dictionaries })
            }
          }
        }
      } catch (error) {
      }
      this.setState({
        isLoading: false
      })
    })
  }
  gotoDicionary = (sourceId) => {
    this.props.navigation.navigate("DictionaryWords", { dictionarySourceId: sourceId, metadata: this.state.dictionaries })
  }
  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.infoView} onPress={() => this.gotoDicionary(item.sourceId)}>
          <Card>
            <CardItem style={styles.cardItemStyle}>
              <Text style={styles.dictionaryText}>{item.name}</Text>
            </CardItem>
          </Card>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    ("dictionaries ", this.state.dictionaries)
    return (
      <View style={[styles.container, { padding: 8 }]}>
        {
          this.state.isLoading ?
            <ActivityIndicator size="small" color={Colors.Blue_Color} animate={true} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} /> :
            <FlatList
              data={this.state.dictionaries}
              contentContainerStyle={this.state.dictionaries.length === 0 && styles.centerEmptySet}
              renderItem={this.renderItem}
              ListEmptyComponent={
                <View style={styles.emptyMessageContainer}>
                  <Icon name="book" style={styles.emptyMessageIcon} />
                  <Text style={styles.messageEmpty}>
                    No Dictionary for {this.props.languageName}
                  </Text>
                </View>
              }
            />
        }
      </View>
    )
  }
}


const mapStateToProps = state => {
  return {
    languageCode: state.updateVersion.languageCode,
    languageName: state.updateVersion.language,
    books: state.versionFetch.versionBooks,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}

export default connect(mapStateToProps, null)(Infographics)


