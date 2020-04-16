import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Alert,TextInput,Text,TouchableOpacity,Button } from 'react-native';
// import { Button, Input, Icon } from 'react-native-elements';
// import {Button} from 'native-base'
// import auth from '@react-native-firebase/auth';
import firebase from 'react-native-firebase'



export default class Reset extends Component {

    constructor(props){
        super(props)
        this.state ={
            email:'',
            showLoading:''
        }
    }

    reset = async() => {
        this.setState({showLoading:true})
        try {
            await firebase.auth().sendPasswordResetEmail(this.state.email);
            this.setState({showLoading:false})

        } catch (e) {
            this.setState({showLoading:false})

            Alert.alert(
                e.message
            );
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ fontSize: 28, height: 50  }}>Reset Password!</Text>
                    </View>
                    <View style={styles.subContainer}>
                    <TextInput
                        style={styles.textInputStyle}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        placeholder='Email'
                        autoCapitalize='none'
                    />
                    </View>
                    <View style={styles.subContainer}>
                    <Button
                        onPress={() => this.reset}
                        style={styles.textInput}
                        title="Reset"
                        color="#841584"
                        // accessibilityLabel="Learn more about this purple button"
                    />
                    {/* <TouchableOpacity success 
                    onPress={() => reset()}
                    >
                    <Text>Reset</Text>
                    </TouchableOpacity> */}
                    </View>
                    <View style={styles.subContainer}>
                    <Button
                        onPress={() => this.props.navigation.navigate('Login')}
                        style={styles.textInput}
                        title="Back to Login"
                        color="#841584"
                        // accessibilityLabel="Learn more about this purple button"
                    />
                    {/* <TouchableOpacity  
                    onPress={() => this.props.navigation.navigate('Login')}
                    >
                        <Text>Back to Login</Text>
                    </TouchableOpacity> */}
                    </View>
                    {/* {this.state.showLoading &&
                        <View style={styles.activity}>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    } */}
                </View>
            </View>
        )
    }
    
}

// Reset.navigationOptions = ({ navigation }) => ({
//     title: 'Reset',
//     headerShown: false,
// });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        height: 400,
        padding: 20
    },
    subContainer: {
        marginBottom: 10,
        // padding: 5,
    },
    activity: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        fontSize: 18,
        margin: 5,
        width: 200
    },
    textInputStyle:{
        height: 40,
        width:300, 
        borderColor: 'gray', 
        borderWidth: 1,
        // marginVertical:
    },
})