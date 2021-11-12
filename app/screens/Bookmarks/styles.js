import {StyleSheet,Dimensions} from 'react-native'
import {colorStyle,sizeStyle} from '../../utils/dynamicStyle'

export const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorStyle.backgroundColor,
    },
    bookmarksView:{
        flexDirection:'row',
        justifyContent: 'space-between',
        margin:16,
        fontSize:sizeStyle.textSize
    },
    bookmarksText:{
        fontSize:sizeStyle.titleText,
        color:colorStyle.iconColor
    },
    iconCustom:{
        color:colorStyle.textColor,
        fontSize:sizeStyle.iconSize
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
    centerEmptySet: { 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%' 
    },
    activityStyle:{
        flex: 1, justifyContent: "center", alignSelf: "center" 
    }
    })
