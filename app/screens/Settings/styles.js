import {StyleSheet,Dimensions} from 'react-native'
const width = Dimensions.get('window').width;
import { colorStyle  } from '../../utils/dynamicStyle';
export const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorStyle.backgroundColor 
    },
    containerMargin:{
        flex:1,
        margin:8
    },
    textStyle: {
            color: colorStyle.textColor,   
            fontSize:16,
            marginLeft:4,
            alignSelf:'center'
    },
    
    cardItemStyle:{
       paddingTop:8,
       paddingBottom:8,
       backgroundColor:colorStyle.backgroundColor
    },
    switchButtonCard:{
        paddingTop:16,
        paddingBottom:16,
        backgroundColor:colorStyle.backgroundColor,
        justifyContent:'space-between',
    },
    cardItemColumn:{
        flexDirection:'column',
    },
    cardItemRow:{
        flexDirection:'row',
        marginVertical:4
    },
    modeTextCustom:{
        color:colorStyle.textColor,
        fontSize:16,
        position: 'absolute', 
        right: 50,
    },

    cardItemAlignRight:{
        alignItems:'flex-start'
    },
    segmentCustom:{
        width:width-50, 
        height: 30, 
        borderRadius: 50,
    },
    cardItemIconCustom:{
        marginHorizontal:4,
        marginVertical:4,
        color:colorStyle.iconColor,
        fontSize:32   
    },
    
    modeIconCustom:{
        fontSize:32,
        textAlign:'center'  
    },
    nightModeIconColor:{
        color:colorStyle.accentColor
    },
    dayModeIconColor:{
        color:colorStyle.accentColor
    },
    switchIcon:{
        color:colorStyle.iconColor,
    }
})


