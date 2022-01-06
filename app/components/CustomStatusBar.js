import React, { Component ,Fragment} from 'react';
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from '../utils/colorConstants'
export default class CustomStatusBar extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Fragment>
                {/* <SafeAreaView style={{ flex: 0, backgroundColor:Color.Blue_Color }} /> */}
                <SafeAreaView style={{ flex: 1, backgroundColor:Color.Blue_Color}} >
                {/* <SafeAreaView style={{ flex: 1, backgroundColor:Color.Blue_Color }} >
                <SafeAreaView style={{ flex: 1, backgroundColor:Color.White }} > */}
                <StatusBar barStyle="light-content" />
                {this.props.children}
                </SafeAreaView>
            </Fragment>

        )
    }
}

