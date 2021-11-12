import {StyleSheet} from 'react-native'
import {colorStyle,sizeStyle} from '../../utils/dynamicStyle'

export const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorStyle.backgroundColor,
    },
    historyHeader:{
        flexDirection:"row",
        justifyContent:"space-between",
        margin:8
    },
    accordionHeaderText:{
        fontSize:sizeStyle.titleText,
        color:colorStyle.textColor
    },
    contentText:{
        marginHorizontal:16,
        marginVertical:4,
        fontSize:sizeStyle.textSize,
        color:colorStyle.textColor
    },
    emptyMessageContainer:{
        flex:1,
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
    iconCustom:{
        fontSize:sizeStyle.iconSize,
        color:colorStyle.iconColor
    }

    })

