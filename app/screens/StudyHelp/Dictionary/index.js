

import React from 'react';
import { View, Text, FlatList, TouchableOpacity ,ActivityIndicator} from 'react-native';
import { Card, CardItem } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'
import { styles } from './styles.js'
import vApi from '../../../utils/APIFetch';
import  Colors  from '../../../utils/colorConstants';

class Infographics extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dictionaries: [],
      isLoading: false
    }
    this.styles = styles(this.props.colorFile, this.props.sizeFile);

  }
  componentDidMount() {
    this.setState({
      isLoading: true
    },async()=>{
      try{
        const apiData = await vApi.get("dictionaries")
        if (apiData){
          for (var i = 0; i < apiData.length; i++) {
            if (apiData[i].language.toLowerCase() === this.props.languageName.toLowerCase()) {
                this.setState({dictionaries:apiData[i].dictionaries})
            }
          }
        }
      }catch(error){
      }
      this.setState({
        isLoading: false
      })
    })
  }
  gotoDicionary = (sourceId) => {
    this.props.navigation.navigate("DictionaryWords",{dictionarySourceId:sourceId} )
  }
  renderItem = ({ item }) => {
    return (
      <View>
        <Card>
        <CardItem style={this.styles.cardItemStyle}>
          <TouchableOpacity style={this.styles.infoView} onPress={() => this.gotoDicionary(item.sourceId)}>
            <Text style={this.styles.dictionaryText}>{item.name}</Text>
          </TouchableOpacity>
        </CardItem>
      </Card>
      </View>
    )
  }
  render() {
    ("dictionaries ",this.state.dictionaries)
    return (
      <View style={[this.styles.container,{padding:8}]}>
        {
          this.state.isLoading ?
            <ActivityIndicator size="small" color={Colors.Blue_Color} animate={true} style={{ flex:1,justifyContent: 'center', alignItems: 'center' }} /> :
            <FlatList
              data={this.state.dictionaries}
              contentContainerStyle={this.state.dictionaries.length === 0 && this.styles.centerEmptySet}
              renderItem={this.renderItem}
              ListEmptyComponent={
                <View style={this.styles.emptyMessageContainer}>
                  <Icon name="book" style={this.styles.emptyMessageIcon} />
                  <Text style={this.styles.messageEmpty}>
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


