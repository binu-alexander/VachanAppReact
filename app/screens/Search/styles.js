import {StyleSheet,Dimensions} from 'react-native'
import Color  from '../../utils/colorConstants';
const width = Dimensions.get('window').width;
import { colorStyle,sizeStyle  } from '../../utils/dynamicStyle';
export const styles = StyleSheet.create({
        container:{
            backgroundColor:colorStyle.backgroundColor,
            flex:1
        },
        activityCenter:{ alignItems: 'center', justifyContent: 'center', },
        ListEmptyContainer:{
            justifyContent:'center',
            alignItems:'center',

        },
        searchedDataContainer:{
            margin:8,
            backgroundColor:colorStyle.backgroundColor
        },
        headerStyle:{
            paddingLeft:16,
            fontSize:sizeStyle.titleText,
            color:colorStyle.textColor
        },
        text:{
            fontSize:sizeStyle.textSize,
            color:'#fff'
        },
        toggleBible:{
            fontSize:sizeStyle.titleText,
            paddingRight:16,
            color:'#3740FE'
        },
        toggleBibleTouchable:{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            paddingVertical:12,
            margin:8,
        },
        searchedData:{
            padding:4,
            borderBottomColor: Color.Gray,
            borderBottomWidth: 0.5,
            margin:4,
            fontSize:sizeStyle.titleText,
            color:colorStyle.textColor
          },
        textStyle:{
            margin:8,
            fontSize:sizeStyle.textSize,
            color : colorStyle.textColor
        },
        textLength:{
            alignSelf:"center",
            color:colorStyle.textColor,
            fontSize:sizeStyle.textSize,
        },
        headerText:{
            width:width,
            color:colorStyle.textColor
        },
        placeholderColor:{
            color:colorStyle.textColor
        }
    })
