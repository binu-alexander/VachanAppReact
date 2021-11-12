import { StyleSheet, Dimensions } from 'react-native'
import Color from '../../../utils/colorConstants'
import { colorStyle , sizeStyle } from '../../../utils/dynamicStyle'
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
        metadataStyle:{ textAlign: "center" ,color:colorStyle.textColor},
        cardItemBackground: {
            backgroundColor: colorStyle.backgroundColor,
            padding: 10
        },
        centerView:{ justifyContent: "center", alignItems: "center" },
        centerButton:{ flex: 1, justifyContent: "center", alignItems: "center" },
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

    })

