import { StyleSheet, Dimensions } from 'react-native'
const width = Dimensions.get('window').width;
import Color from '../../utils/colorConstants'
import { colorStyle ,sizeStyle  } from '../../utils/dynamicStyle';
export const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorStyle.backgroundColor
        },
        centerContent: {
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center'
        },
        centerEmptySet: {
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        },
        verseWrapperText: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor,
            justifyContent: 'center',

        },
        modalContainer: {
            backgroundColor: colorStyle.backgroundColor,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',

        },
        accordionHeader: {
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colorStyle.backgroundColor,
        },
        accordionHeaderText: {
            color: colorStyle.textColor,
            fontWeight: "600"
        },
        chapterList: {
            margin: 16
        },
        footerComponent: {
            height: 64,
            marginBottom: 4
        },
        bottomBar: {
            position: 'absolute',
            bottom: 0,
            width: width,
            height: 62,
            flexDirection: 'row',
            justifyContent: 'center'

        },
        bottomOption: {
            flexDirection: 'row',
            width: width / 3,
            justifyContent: 'center',
            alignItems: 'center',
        },


        bottomOptionText: {
            textAlign: 'center',
            color: Color.White,
            fontSize: 16

        },
        bottomOptionIcon: {
            alignSelf: 'center',
            fontSize: 16
        },
        bottomOptionSeparator: {
            width: 1,
            backgroundColor: Color.White,
            marginVertical: 8,

        },
        VerseText: {
            fontWeight: '100'
        },

        textString: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor,
            fontWeight: 'normal',
            lineHeight: sizeStyle.lineHeight,
            paddingVertical: 4
        },
        sectionHeading: {
            fontWeight: 'normal',
            lineHeight: sizeStyle.lineHeight,
            fontSize: sizeStyle.textSize + 1,
            color: colorStyle.sectionHeading,
        },
        bottomBarParallelPrevView: {
            position: 'absolute',
            backgroundColor: colorStyle.semiTransparentBackground,
            justifyContent: 'center',
            height: 40,
            width: 40,
            borderRadius: 28,
            bottom: 36,
            left: 4
        },
        bottomBarPrevView: {
            position: 'absolute',
            backgroundColor: colorStyle.semiTransparentBackground,
            justifyContent: 'center',
            height: 56,
            width: 56,
            borderRadius: 32,
            margin: 8,
            bottom: 20,
            left: 0

        },
        bottomBarNextParallelView: {
            position: 'absolute',
            backgroundColor: colorStyle.semiTransparentBackground,
            justifyContent: 'center',
            height: 40,
            width: 40,
            borderRadius: 28,
            bottom: 36,
            right: 4
        },

        bottomBarNextView: {
            height: 56,
            width: 56,
            borderRadius: 32,
            margin: 8,
            bottom: 20,
            right: 0,
            position: 'absolute',
            backgroundColor: colorStyle.semiTransparentBackground,
            justifyContent: 'center'
        },

        bottomBarAudioCenter: {
            borderRadius: 32,
            margin: 8,
            position: 'absolute',
            bottom: 20,
            left: 0,
            backgroundColor: 'rgba(63, 81, 181,0.5)',

            justifyContent: 'center'
        },

        bottomBarChevrontIcon: {
            alignItems: 'center',
            zIndex: 2,
            alignSelf: 'center',
            color: colorStyle.chevronIconColor,
            fontSize: sizeStyle.chevronIconSize
        },
        verseNumber: {
            fontSize: sizeStyle.textSize,
        },
        verseChapterNumber: {
            fontSize: sizeStyle.titleText,
            color: colorStyle.textColor,
            fontWeight: 'bold'
        },

        verseTextSelectedHighlighted: {
            backgroundColor: colorStyle.highlightColor,
            textDecorationLine: 'underline',
        },
        verseTextNotSelectedNotHighlighted: {

        },
        verseTextNotSelectedHighlighted: {
            backgroundColor: colorStyle.highlightColor
        },
        verseTextSelectedNotHighlighted: {
            textDecorationLine: 'underline',
        },
        textListFooter: {
            color: colorStyle.textColor,
            fontSize: sizeStyle.textSize - 2,
            textAlign: 'center',
            paddingVertical: 2
        },
        addToSharefooterComponent: {
            margin: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },

        footerText: {
            fontWeight: 'bold'
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
        reloadButton: {
            height: 40,
            width: 120,
            borderRadius: 4,
            backgroundColor: Color.Blue_Color,
            justifyContent: 'center',
            alignItems: 'center'
        },
        reloadText: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor,
            textAlign: 'center'
        },
        emptyMessageIcon: {
            fontSize: sizeStyle.emptyIconSize,
            margin: 16,
            color: colorStyle.iconColor,
            alignSelf: 'center'
        },
        //bible content
        iconRight:{ position: "absolute", right: 4 },
        
        centerContent:{ flex: 1, justifyContent: "center", alignSelf: "center" },
        headerStyle:{
            backgroundColor: Color.Blue_Color,
            height: 40,
            borderLeftWidth: 0.2,
            borderLeftColor: Color.White,
          },
          //header
          pdfIcon:{ position: "absolute", right: 0, paddingRight: 8 },
          headerText:{ fontSize: 18, color: "#fff" },
          //highlight color 
          highlightView:{
            justifyContent: 'space-between',
            alignItems: 'center',
            bottom: 60, backgroundColor: '#fff', position: 'absolute', width: width
        },
        highlightText:{ marginHorizontal: width/25,marginVertical:8, borderWidth: 1,  borderRadius: 21, height: 42, width: 42},
    })

