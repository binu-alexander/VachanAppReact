import { StyleSheet, Dimensions } from 'react-native'
import Color from '../../../utils/colorConstants'
import { colorStyle, sizeStyle } from '../../../utils/dynamicStyle'
const height = Dimensions.get('window').height

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorStyle.backgroundColor
    },
    commentaryHeading: {
        fontSize: sizeStyle.textSize,
        color: colorStyle.textColor,
        fontWeight: 'bold'
    },
    verseWrapperText: {
        fontSize: sizeStyle.textSize,
        color: colorStyle.textColor,
        justifyContent: 'center',

    },
    cardItemBackground: {
        backgroundColor: colorStyle.backgroundColor,
        padding: 10
    },
    commentaryText: {
        fontSize: sizeStyle.textSize,
        color: colorStyle.textColor,
    },
    chapterList: {
        margin: 16
    },
    footerComponent: {
        height: 64,
        marginBottom: 4
    },

    VerseText: {
        fontWeight: '100'
    },
    textString: {
        fontSize: sizeStyle.textSize,
        color: colorStyle.textColor,
        fontWeight: 'normal',
        lineHeight: sizeStyle.lineHeight
    },
    metaData: {
        textAlign: 'center',
        color: colorStyle.textColor
    },
    IconFloatingStyle: {
        position: 'absolute',
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        padding: 8,
        top: 10,
    },
    reloadText: {
        fontSize: sizeStyle.textSize,
        color: colorStyle.textColor,
        textAlign: 'center'
    },
    reloadButton: {
        height: 40, width: 120,
        borderRadius: 4, backgroundColor: Color.Blue_Color,
        justifyContent: 'center', alignItems: 'center'
    },
    emptyMessageIcon: {
        fontSize: sizeStyle.emptyIconSize,
        margin: 16,
        color: colorStyle.iconColor,
        alignSelf: 'center'
    },
    centerAlignment: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    alignStart: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    dropdownView: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        width: 150,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderColor: colorStyle.iconColor,
        borderWidth: 0.5,
    },
    textStyle:{
        fontSize: 18,
        fontWeight: "400",
        color: colorStyle.textColor,
    },
    dropdownSize:{
         width: "60%", height: height / 2 
    },
    listFooter:{
         height: 40, marginBottom: 40 
    }
   
})
