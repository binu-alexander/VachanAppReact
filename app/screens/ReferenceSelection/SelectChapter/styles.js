import {StyleSheet,Dimensions} from 'react-native'
const width = Dimensions.get('window').width;
import { colorStyle,sizeStyle } from  '../../../utils/dynamicStyle';
export const styles = StyleSheet.create({
   container:{
        flex:1,
        flexDirection:'row'
   },
    chapterSelectionContainer:{
        flex:1,
        backgroundColor:colorStyle.backgroundColor        
    },
   tabContainer:{
        flex:1,
        backgroundColor:colorStyle.backgroundColor
   },
   textStyle: {
        fontSize:sizeStyle.textSize
   },
    sideBarContainer:{
        flexDirection:'column',
        width:width/5,
    },
    sideBarIconCustom:{
        alignSelf:'center',
        padding:16,
        color:colorStyle.sidebarIconColor
    },
    bookNameContainer:{
        flexDirection:'column',
        width:width*4/5
    },
    segmentCustom:{
        borderColor:'#3F51B5',
        borderBottomWidth:1
    },
    segmentButton:{
        padding: 0,
        height: 45,
        width:width*2/5
    },
    BookList:{
        flexDirection:'row',
        justifyContent:'space-between', 
        paddingHorizontal:16, 
        paddingVertical:12
      },
   IconCustom:{
    color:colorStyle.iconColor
   },
   chapterSelectionTouchable:{
        flex:0.25,
        height:width/4, 
        backgroundColor:colorStyle.backgroundColor,
        justifyContent:"center"
    },
    chapterNum:{
        fontSize:sizeStyle.titleText,
        textAlign:"center",
        alignItems:"center", 
        color:colorStyle.textColor
    },
   cardItemStyle:{
       paddingTop:16,
       paddingBottom:16
    },
    //SELECT BOOK STYLE
    selectBookTouchable:{
        flex:1, 
        borderColor:'black', 
        borderRightWidth:1,
        borderBottomWidth:1, 
        borderLeftWidth:1, 
        justifyContent:"center", 
    },
    bookName:{
        textAlign:"center",
        alignItems:"center",
        color:colorStyle.textColor,
        margin:8,
        fontSize:sizeStyle.textSize
    },
    
    //SelectChapter
    selectGridNum:{
        flex:0.25,
        borderColor:colorStyle.gridBorderColor,
        borderRightWidth:1, 
        borderBottomWidth:1,
        height:width/4,
        justifyContent:"center"
    },
    selectText:{
        textAlign:"center",
        alignItems:"center", 
        color:colorStyle.textColor,
        fontSize:sizeStyle.textSize
    },
    iconBack:{
        position: "absolute",
        bottom: 0,
        right: 0,
        paddingRight: 20,
        paddingBottom: 10,
        color: "rgba(62, 64, 149, 0.8)",
        fontSize: 40,
      }
    
})
