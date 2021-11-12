import {StyleSheet} from 'react-native'
import Color from '../../../utils/colorConstants'
import { colorStyle, sizeStyle} from '../../../utils/dynamicStyle'

export const styles =StyleSheet.create({
        container:{
        flex:1,
        backgroundColor:colorStyle.backgroundColor,
        },
        iconStyle:{
            fontSize:28,
            color:colorStyle.textColor,
            fontSize:sizeStyle.textSize
        },
        headerText:{
            fontWeight: "600" ,
            color:colorStyle.textColor,
            fontSize:sizeStyle.textSize
        },
        headerStyle:{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            color:colorStyle.textColor,
            fontSize:sizeStyle.textSize
        },
        dictionaryModal:{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        dictionaryModalView:{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
       
        cardStyle:{
            backgroundColor:colorStyle.backgroundColor
        },
        textStyle:{
            color:colorStyle.textColor,
            fontSize:sizeStyle.textSize,
        },
        textString:{
            fontSize:sizeStyle.textSize,
            color:colorStyle.textColor,
            fontWeight:'normal',
            lineHeight:sizeStyle.lineHeight
        },
        scrollViewModal:{
            margin:12,
            padding:12,
            flex:1,
            borderColor:Color.Blue_Color,
            borderWidth:1,
            backgroundColor:colorStyle.backgroundColor,
            
        },
        dictionScrollModal:{
            margin:12,
            padding:12,
            flex:1,
            borderWidth:1,
            backgroundColor:colorStyle.backgroundColor
        },
        textDescription:{
            color:colorStyle.textColor,
            fontSize:sizeStyle.textSize,
        },
        reloadButton:{
            height:40,width:120,borderRadius:4,
            backgroundColor:Color.Blue_Color,
            justifyContent:'center',alignItems:'center'
          },
        reloadText: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor,
            textAlign: 'center'
        },
        emptyMessageIcon:{
            fontSize:sizeStyle.emptyIconSize,
            margin:16,
            color:colorStyle.iconColor,
            alignSelf:'center'
        },
        centerEmptySet: { 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100%',
            flexGrow: 1,
        },
        emptyMessageContainer:{
            flex:1,
            alignItems:'center',
            flexDirection:'column',
            justifyContent:'center'
        },
        emptyMessageIcon:{
            fontSize:sizeStyle.emptyIconSize,
            margin:16,
            color:colorStyle.iconColor,
        },
        messageEmpty:{
            fontSize:sizeStyle.titleText,
            color:colorStyle.textColor,
        },
        cardItemStyle:{
            paddingTop:16,
            paddingBottom:16,
            backgroundColor:colorStyle.backgroundColor
         },
         dictionaryText:{
            fontSize:sizeStyle.titleText,
            color:colorStyle.iconColor
        },
        iconPosition:
            { position: 'absolute', right: 0, zIndex: 1 },
            dictionaryModalPosition:{ width: '80%', position: 'absolute', zIndex: 0}
        
    })
