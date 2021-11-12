import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
} from 'react-native';
import { connect } from 'react-redux'
import { Card, CardItem, Header, Left, Button, Body, Title } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { userInfo,userLogedIn } from '../../store/action'
import auth from '@react-native-firebase/auth';
import { styles } from './styles.js'
import Color from '../../utils/colorConstants'
import {
  GoogleSignin,
} from '@react-native-community/google-signin';
class ProfilePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: this.props.photo,
      userData: '',
      isLoading: false
    }
  }
 
  logOut = async () => {
    try {
      if (this.props.pasLogedIn){
        auth().signOut()
      } else if(this.props.googleLogIn){
        auth().signOut()
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      this.props.userLogedIn({ pasLogedIn: false,googleLogIn:false })
      this.props.userInfo({ email: null, uid: null, userName: '', phoneNumber: null, photo: null })
      this.setState({ user: null })
      this.props.navigation.navigate("Bible")
    } catch (error) {
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header style={{ backgroundColor: Color.Blue_Color }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("Bible")}>
              <Icon size={24} color={Color.White} name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
        </Header>
        <View style={styles.cardBgColor}>
          <Card style={styles.cardStyling}>
            <CardItem style={styles.cardItemStyling}>
              <View style={styles.profileform}>
                <Image style={styles.avatar} source={this.props.photo != null ? { uri: this.props.photo } : require('../../assets/account.png')} />
                <View>
                  <Text style={[styles.textStyle, { paddingRight: 8 }]}>{this.props.email}</Text>
                  <Text style={[styles.textStyle, { paddingRight: 8 }]}>{this.props.userName}</Text>
                </View>
              </View>
            </CardItem>
          </Card>
          <View></View>
          <Card style={styles.cardStyling}>
            <CardItem header button style={[styles.cardItemStyling, { flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('Settings')}>
              <Icon name='settings' style={styles.cardItemIconCustom} />
              <Text style={styles.textStyle}>Settings</Text>
            </CardItem>
            <CardItem header button style={[styles.cardItemStyling, { flexDirection: 'row' }]} onPress={() => this.props.navigation.navigate('About')}>
              <Icon name='info' style={styles.cardItemIconCustom} />
              <Text style={styles.textStyle}>About</Text>
            </CardItem>
          </Card>
          <Card style={styles.cardStyling}>
            <CardItem header button onPress={this.logOut} style={[styles.cardItemStyling,styles.alignItem]}>
              <Text style={styles.textStyle}>LOG OUT</Text>
            </CardItem>
          </Card>
        </View>
      </View>
    );
  }
}


const mapStateToProps = state => {
  return {
    email: state.userInfo.email,
    uid: state.userInfo.uid,
    photo: state.userInfo.photo,
    userName: state.userInfo.userName,
    pasLogedIn: state.userInfo.pasLogedIn,
    googleLogIn: state.userInfo.googleLogIn,
    sizeFile: state.updateStyling.sizeFile,
    colorFile: state.updateStyling.colorFile,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    userInfo: (payload) => dispatch(userInfo(payload)),
    userLogedIn: (payload) => dispatch(userLogedIn(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
