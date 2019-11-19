import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const styles =(colorFile, sizeFile) =>{
    return StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorFile.backgroundColor
        
    },
    verseWrapperText:{
        fontSize:sizeFile.contentText,
        color:colorFile.textColor,
        justifyContent:'center'
    },
    chapterList:{
        margin:16
    },
    footerComponent:{
        height:64,
        marginBottom:4
    },
    bottomBar:{
        position:'absolute', 
        bottom:0,
        width: width, 
        height: 62, 
        backgroundColor:'#3F51B5',
        flexDirection:'row',
        justifyContent:'center'

    },
    bottomOption:{
        flexDirection:'row',
        width:width/3,
        justifyContent:'center',
        alignItems:'center',
       
    },
    bottomOptionText:{
        textAlign:'center',
        color:'white',   
        fontSize:sizeFile.bottomBarText 

    },
    bottomOptionIcon:{
        alignSelf:'center',
        fontSize:sizeFile.iconSize 
    },
    bottomOptionSeparator:{
        width: 1,
        backgroundColor:'white',
        marginVertical:8,
        
    },
    VerseText:{
    },
    bottomBarPrevView:{
        borderRadius: 32, 
        margin:8, 
        position:'absolute', 
        bottom:20, 
        left:0,
        width: 56, 
        height: 56, 
        // backgroundColor: colorFile.backgroundColor,
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center'
    },
    bottomBarNextView:{
        borderRadius: 32, 
        margin:8, 
        position:'absolute', 
        bottom:20, 
        right:0,
        width: 56, 
        height: 56, 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center'
    },
    bottomBarChevrontIcon:{ 
        alignItems:'center',
        zIndex:2, 
        alignSelf:'center',
        color:colorFile.chevronIconColor,
        fontSize: sizeFile.chevronIconSize
    },
    verseNumber:{
        fontSize:sizeFile.contentText,
        color:colorFile.textColor
    },
    verseChapterNumber:{
        fontSize:sizeFile.titleText,
        fontWeight:'bold'
    },
    verseTextSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor,
        textDecorationLine: 'underline',
        color:colorFile.textColor
        
    },
    verseTextNotSelectedNotHighlighted:{
        color:colorFile.textColor


    },
    verseTextNotSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor,
        color:colorFile.textColor

    },
    verseTextSelectedNotHighlighted:{
        textDecorationLine: 'underline',
        color:colorFile.textColor

    },
    addToSharefooterComponent:{

    },

    })
}
