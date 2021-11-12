import React, { Component } from 'react';
import { FlatList, TouchableOpacity, View, Text, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { styles } from './styles';
import Color from '../../utils/colorConstants'
const width = Dimensions.get('screen').width;

export default class HighlightColorGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false
        }
    }

    render() {
        return (

            <View style={{ flex: 1 }}>
                <View
                    style={styles.highlightView}
                >
                    <FlatList
                        data={["#fffe00", "#5dff79", "#56f3ff", "#ffcaf7", "#ffc66f"]}
                        numColumns={5}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={()=>this.props.doHighlight(item)}>
                            <View style={[{ backgroundColor: item,borderColor: item, },styles.highlightText]}></View>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </View>

        )
    }
}