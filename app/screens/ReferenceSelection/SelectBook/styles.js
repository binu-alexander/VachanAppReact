import {StyleSheet} from 'react-native'
import colorConstants from '../../../utils/colorConstants'
import Color from '../../../utils/colorConstants'
import {colorStyle,sizeStyle} from '../../../utils/dynamicStyle'


export const styles = StyleSheet.create({
   container:{
    flex:1,
    backgroundColor:colorStyle.backgroundColor,
   },
    textStyle: {
        fontSize:sizeStyle.titleText,
        color:colorStyle.textColor,
        justifyContent:'center'
   },
   headerRightText:{
    color:Color.White,
    margin:16
   },
    sideBarContainer:{
        flexDirection:'column',
        backgroundColor:Color.Black
    },
    sideBarIconCustom:{
        alignSelf:'center',
        padding:16,
        color:colorConstants.White
    },
    bookNameContainer:{
        flexDirection:'column',
        
    },
  
    segmentButton:{
        padding:4,
        height: 45,
        borderLeftWidth:1,
        borderRightWidth:1,
        borderColor:Color.Blue_Color,
        justifyContent:'center'
    },
    buttonText:{
        alignItems:'center'
    },
    bookList:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:"center",
        paddingHorizontal:16, 
        height:48
      },
    iconCustom:{
        color:colorStyle.iconColor,
        fontSize:sizeStyle.iconSize
    },
   cardItemStyle:{
       paddingTop:16,
       paddingBottom:16
    },
    activeBgColor:{
        backgroundColor:Color.Blue_Color
    },
    inactiveBgColor:{
        backgroundColor:colorStyle.backgroundColor
    },
    activetabText:{
    color:colorStyle.blueText
    },
    inactivetabText:{
    color:Color.White
    }
})


