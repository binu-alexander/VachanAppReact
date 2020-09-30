import {StyleSheet,Dimensions} from 'react-native'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export const HelpStyle = (colorFile, sizeFile) =>{
    return StyleSheet.create({
        container:{
            flex:1,
            // flexDirection:'row',
            backgroundColor:colorFile.backgroundColor
        },
        textView: {
            // padding:20,
            width: width*4/5,
            backgroundColor: colorFile.backgroundColor,
            // flexDirection:'column',
            textAlign:'left'
        },
        textRow: {
            justifyContent:'center',
            height:64
        },
        textStyle:{
            color:colorFile.textColor,
            fontSize: sizeFile.contentText,
            marginHorizontal:8
        },
        iconColor:{
            color:colorFile.iconColor

        },
        textStyle: {
            color: colorFile.textColor,   
            fontSize:16,
            marginLeft:4,
            alignSelf:'center'
        },
        cardItemIconCustom:{
            marginHorizontal:4,
            marginVertical:4,
            color:colorFile.settingsIconColor,
            fontSize:32   
        },
        // container:{
        //     backgroundColor:"#000",
        //         // width: width/5,
        //         // flexDirection:'column',
        // },
        AnimatedViewCustom:{
            backgroundColor: 'transparent',
            alignItems: "center",
            justifyContent: "center",
            // padding:20
            // margin:12
        },
        Card:{
            backgroundColor: colorFile.backgroundColor,
        },
        iconColor:{
            color:colorFile.settingsIconColor,
            padding:16,
        }
})
}