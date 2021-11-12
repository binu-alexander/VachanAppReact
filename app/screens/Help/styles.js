import {StyleSheet,Dimensions} from 'react-native'
const width = Dimensions.get('window').width;
import {colorStyle,sizeStyle} from '../../utils/dynamicStyle'

export const styles =StyleSheet.create({
        container:{
            flex:1,
            backgroundColor:colorStyle.backgroundColor
        },
        itemContainer:{ flexDirection: "row", justifyContent: "center" },
        textView: {
            width: width*4/5,
            backgroundColor: colorStyle.backgroundColor,
            textAlign:'left'
        },
        textRow: {
            justifyContent:'center',
            height:64
        },
        textStyle:{
            color:colorStyle.textColor,
            fontSize: sizeStyle.textSize,
            marginHorizontal:8
        },
        iconColor:{
            color:colorStyle.iconColor
        },
        textStyle: {
            color: colorStyle.textColor,   
            fontSize:16,
            marginLeft:4,
            alignSelf:'center'
        },
        cardItemIconCustom:{
            marginHorizontal:4,
            marginVertical:4,
            color:colorStyle.iconColor,
            fontSize:32   
        },
       
        AnimatedViewCustom:{
            backgroundColor: 'transparent',
            alignItems: "center",
            justifyContent: "center",
        },
        Card:{
            backgroundColor: colorStyle.backgroundColor,
        },
        iconColor:{
            color:colorStyle.settingsIconColor,
            padding:16,
        }
})
