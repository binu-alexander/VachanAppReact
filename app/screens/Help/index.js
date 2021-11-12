
import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import { Card, CardItem } from 'native-base';
import { styles } from './styles.js';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'

class Help extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <View style={[styles.container,{padding:8}]}>
        <Card style={styles.Card}>
          <TouchableOpacity style={[{ flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('Hints')}>
            <CardItem style={styles.Card}>
              <Icon name='lightbulb-outline' style={styles.cardItemIconCustom} />
              <Text style={styles.textStyle}>Hints</Text>
            </CardItem>
          </TouchableOpacity>
        </Card>
        <Card style={styles.Card}>
          <TouchableOpacity style={[{ flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('Feedback')}>
            <CardItem style={styles.Card}>
              <Icon name='feedback' style={styles.cardItemIconCustom} />
              <Text style={styles.textStyle}>Feedback</Text>
            </CardItem>
          </TouchableOpacity>
        </Card>
      </View>
    );
  }
};
const mapStateToProps = state => {
  return {
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}

export default connect(mapStateToProps, null)(Help)