import { StyleSheet } from "react-native";
import {colorStyle,sizeStyle} from '../../utils/dynamicStyle'

export const styles =  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorStyle.backgroundColor,
      padding: 8,
    },
    audioView: {
      width: "100%",
      fontSize: sizeStyle.textSize,
    },
    audioText: {
      fontSize: sizeStyle.titleText,
      color: colorStyle.iconColor,
    },
    cardItemStyle: {
      paddingTop: 16,
      paddingBottom: 16,
      backgroundColor: colorStyle.backgroundColor,
    },
    centerEmptySet: { 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100%' 
  },
    messagContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    messageEmpty:{
      fontSize:sizeStyle.titleText,
      color:colorStyle.textColor,
  },
    emptyMessageIcon: {
      paddingBottom:20,
      alignSelf:'center',
      fontSize: sizeStyle.emptyIconSize,
      color: colorStyle.iconColor,
    },
  });

