import {StyleSheet} from 'react-native'
import Color from '../../utils/colorConstants'
import {colorStyle,sizeStyle} from '../../utils/dynamicStyle'

export const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorStyle.backgroundColor 
    },
    headerContainer: {
        height: 150,
    },
    drawerItem:{
        flex:1,
        flexDirection:"row",
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:8,
        paddingVertical:12,
        borderWidth: 0.3,
        borderColor: Color.Gray,
        backgroundColor:colorStyle.backgroundColor 
    },headerImage:{ flex: 1, width: 280 },
    bcsImage:{ position: "absolute", bottom: 0, margin: 8 },
    logoIcon:{
        padding: 4, width: 136, height: 30 
    },
    headerText: {
    color: Color.White,
    },
    customText:{
    fontSize: 18,
    textAlign: 'center',
    color:Color.Black

    },
    versionText:{
        color: colorStyle.textColor,   
        fontSize:16,
        alignSelf:'center',
        paddingVertical:10
    },
    textStyle: {
        color: colorStyle.textColor,   
        fontSize:16,
        marginLeft:4,
        alignSelf:'center'
    },
   
    iconStyle:{
        color:colorStyle.iconColor
    },
    iconStyleDrawer:{
        paddingRight:16,
        color:colorStyle.iconColor
    },
    imageStyle:{width: 64,height: 64,alignSelf:'center',padding:8}
})



