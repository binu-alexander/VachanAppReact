import {StyleSheet,Dimensions} from 'react-native'
const width = Dimensions.get('window').width;
import Color from '../../utils/colorConstants'
import { colorStyle , sizeStyle} from '../../utils/dynamicStyle';

export const styles = StyleSheet.create({
    MainContainer :{
    flex:1,
    backgroundColor:colorStyle.backgroundColor,
    // paddingBottom:20
    },
    container:{
        backgroundColor:colorStyle.backgroundColor
    },
    rowViewContainer: {
      fontSize: 17,
      padding: 4
     },
     emptyMessageIcon:{
      fontSize:sizeStyle.emptyIconSize,
      margin:16,
      color:colorStyle.iconColor,
      alignSelf:'center'
    },
    headerContainer:{
      flexDirection: "row",
      padding: 10,
      justifyContent: "space-between",
      alignItems: "center",
    },
    centerItem:{
      flex: 1, justifyContent: 'center', alignItems: 'center'
     },
     contentView:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 8 },
    
     TextInputStyleClass:{
      position:'absolute',
      top:0,
      textAlign: 'center',
      height: 40,

      borderWidth: 1,
      borderColor: '#009688',
      borderRadius: 7 ,
      backgroundColor :Color.White
           
      },
      overlay:{
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor:Color.Black,
        width: width , 
        height: 360
      },
      header: {
        flexDirection:"row",
        padding: 6,
        paddingHorizontal:10,
        justifyContent:'space-between',
        backgroundColor:colorStyle.backgroundColor
      },
      iconStyleSelection:{
        color:colorStyle.iconColor
      },
      headerText: {
        fontSize: 16,
        color:colorStyle.textColor
      },
      iconStyle:{
        fontSize:sizeStyle.iconSize,
        color:colorStyle.iconColor
      },
      separator: {
        height: 0.5,
        backgroundColor: Color.Gray,
        width: '95%',
        marginLeft: 16,
        marginRight: 16,
      },
      text: {
        fontSize: 16,
        color: colorStyle.textColor,
      },
      reloadText: {
        fontSize: sizeStyle.textSize,
        color: colorStyle.textColor,
        textAlign: 'center'
    },
      content: {
        paddingHorizontal:20,
        paddingVertical:10,
        flexDirection:"row",
        justifyContent:'space-between',
        backgroundColor:colorStyle.backgroundColor
      },

      //selectioncontent 
      modalContainer:{
        backgroundColor:colorStyle.backgroundColor,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
            
    },
    accordionHeader:{
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center" ,
        backgroundColor:colorStyle.backgroundColor,
        },
        accordionHeaderText:{
            color:colorStyle.textColor,
            fontWeight: "600" 
        },
        headerInner:{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center" ,
          backgroundColor:colorStyle.backgroundColor
           },
        selectionHeaderModal:{
          color:colorStyle.textColor,
          fontWeight:'600'
        },
        selectionInnerContent:{
          padding: 10,
          backgroundColor:colorStyle.backgroundColor,
        }
   })