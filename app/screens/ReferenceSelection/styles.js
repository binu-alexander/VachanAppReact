import {StyleSheet} from 'react-native'
import { colorStyle, sizeStyle} from '../../utils/dynamicStyle'
export const styles = StyleSheet.create({
        emptyMessageIcon:{
            fontSize:sizeStyle.emptyIconSize,
            margin:16,
            color:colorStyle.iconColor,
            alignSelf:'center'
        },
        tabLabel:{
            fontSize: 16, 
            margin: 0, 
            padding: 0, 
            color: colorStyle.blueText
        },
        tabBarOptions:{
            borderBottomWidth: 1,
            borderColor: colorStyle.blueText,
            backgroundColor: colorStyle.backgroundColor,
            height: 36
        },
        indicatorStyle:{
            backgroundColor: colorStyle.blueText,
        },
        mainContainerReloadButton:{
            flex:1,
            backgroundColor: colorStyle.backgroundColor,
            justifyContent:'center',
            alignItems:'center'
        },
        reloadText: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor,
            textAlign: 'center'
        },

    })