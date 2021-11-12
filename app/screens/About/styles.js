import { StyleSheet } from 'react-native'
import Color from '../../utils/colorConstants'
import {colorStyle,sizeStyle} from '../../utils/dynamicStyle'

export const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorStyle.backgroundColor,
        },
        textStyle: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor,
            lineHeight: sizeStyle.lineHeight,
        },
        textContainer: {
            margin: 16,
            padding: 8
        },
        featureList: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor,
            fontWeight: "bold"
        },
        italicText: {
            fontWeight: 'bold', fontStyle: 'italic'
        },
        boldText: {
            fontWeight: "bold"
        },
        linkText: {
            color: Color.Red,
            textDecorationLine: 'underline',
            fontSize: sizeStyle.textSize
        },
        featureView: {
            flexDirection: 'row'
        },
        TitleText: {
            paddingTop: 8,
            fontSize: sizeStyle.titleText,
            color: colorStyle.headingText,
            lineHeight: sizeStyle.lineHeight
        },
        bulletIcon: {
            fontSize: 26,
            color: colorStyle.iconColor,
            lineHeight: sizeStyle.lineHeight,
        },
        releaseNoteText:{
            paddingTop: 8,
            lineHeight: sizeStyle.lineHeight,
            fontSize: sizeStyle.titleText,
            color: colorStyle.textColor,
        }
    })