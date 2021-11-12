import {StyleSheet,Dimensions} from 'react-native'
const height = Dimensions.get('window').height
import { colorStyle ,sizeStyle  } from '../../utils/dynamicStyle'
export const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorStyle.backgroundColor,
        padding:8
    },
    videoView:{
        width:'100%',
        fontSize:sizeStyle.fontSize,
    },
    videoText:{
        fontSize:sizeStyle.titleText,
        color:colorStyle.iconColor
    },

    emptyMessageContainer:{
        // flex:1,
        alignItems:'center',
        flexDirection:'column',
        justifyContent:'center'
    },
    messageEmpty:{
        fontSize:sizeStyle.titleText,
        color:colorStyle.textColor,
    },
    emptyMessageIcon:{
        fontSize:sizeStyle.emptyIconSize,
        margin:16,
        color:colorStyle.iconColor,
    },
    centerEmptySet: { 
        justifyContent: 'center', 
        alignItems: 'center',
        height: height ,
        // flexGrow: 1,
    },
    videoStyle:{
        height:height/2,
        width:'100%'
    },
    description:{
        marginHorizontal:8,
        fontSize:sizeStyle.textSize,
        color:colorStyle.textColor
    },
    title:{
        margin:16,
        fontSize:sizeStyle.titleText,
        color:colorStyle.textColor
    },
    cardItemStyle:{
        paddingTop:16,
        paddingBottom:16,
        backgroundColor:colorStyle.backgroundColor
     },

    })
