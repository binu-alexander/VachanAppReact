import React, { Component } from 'react';
import Player from './Player';
import {Text} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

export const TRACKS = [
  {
    title: 'Genesis 1',
    // artist: 'Twenty One Pilots',
    albumArtUrl: "http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg",
    audioUrl: "http://russprince.com/hobbies/files/13%20Beethoven%20-%20Fur%20Elise.mp3",
  },
]

export default class Audio extends Component {
    constructor(props){
        super(props)
        console.log("PROPS ON NOTEPAD "+JSON.stringify(props))
        this.state ={
            close:this.props.screenProps.close
        }
    }
    componentDidMount(){
        console.log("DID MOUNT OF NOTEPAD")
        this.props.navigation.setParams({ 
            closeOnPress: this.props.screenProps.closeSplitScreen,
        })
    }
    static navigationOptions = ({navigation}) =>{
        const { params = {} } = navigation.state;
            return{
                headerTitle:(<Text style={{fontSize:14,color:"white",marginLeft:10}}>Audio</Text>),
                headerRight:(
                    <Icon name="close"  style={{fontSize:20,marginRight:10,color:"#fff"}} onPress={() => {params.closeOnPress()}} />
                ),
                tabBarIcon: (<Icon name="library-music" size={20} style={{color:'#fff'}}/>)
            }
        }
  render() {
    return <Player tracks={TRACKS} />
  }
}