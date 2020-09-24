
import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import { Card, CardItem } from 'native-base';
import { HintStyle } from './styles.js';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux'

class Help extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.styles = HintStyle(this.props.colorFile, this.props.sizeFile);
  }

  render() {
    return (
      <View>
        <Card>
          <CardItem>
            <TouchableOpacity style={[{ flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('Hints')}>
              <Icon name='lightbulb-outline' style={this.styles.cardItemIconCustom} />
              <Text style={this.styles.textStyle}>Hints</Text>
            </TouchableOpacity>
          </CardItem>
          <CardItem>
            <TouchableOpacity style={[{ flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('Feedback')}>
              <Icon name='feedback' style={this.styles.cardItemIconCustom} />
              <Text style={this.styles.textStyle}>Feedback</Text>
            </TouchableOpacity>
          </CardItem>
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