import { StyleSheet, Dimensions } from 'react-native'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {colorStyle,sizeStyle} from '../../utils/dynamicStyle'

export const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorStyle.backgroundColor
        },
        noteCardItem: {
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            flexDirection: 'row'

        },
        chapterSelectionContainer: {
            flex: 1,
            backgroundColor: colorStyle.backgroundColor
        },
        selectGridNum: {
            flex: 0.25,
            borderColor: colorStyle.borderColor,
            height: width / 4,
            justifyContent: "center"
        },
        modalText: {
            textAlign: 'left',
            fontSize: sizeStyle.titleText,
            color: colorStyle.textColor
        },
        modalMainView: {
            flex: 1, justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colorStyle.semiTransparentBackground
        },
        modalView: {
            width: '80%', height: '80%', position: 'absolute', zIndex: 0, top: 80
        },
        modalCloseIcon: {
            position: 'absolute', right: -20, top: -20, zIndex: 1
        },
        chapterNum: {
            fontSize: sizeStyle.titleText,
            textAlign: "center",
            alignItems: "center",
            color: colorStyle.textColor
        },
        cardItemStyle: {
            paddingTop: 16,
            paddingBottom: 16,
            backgroundColor: colorStyle.backgroundColor
        },
        notesContentView: {
            flex: 1,
            backgroundColor: colorStyle.backgroundColor
        },
        noteContent: {
            flex: 1,
            backgroundColor: colorStyle.backgroundColor,
        },
        centerEmptySet: {
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        },
        noteFontCustom: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor
        },
        noteText: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor
        },
        deleteIon: {
            fontSize: sizeStyle.iconSize,
            color: colorStyle.textColor
        },
        noteFlatlistCustom: {
            backgroundColor: colorStyle.backgroundColor,
            margin: 8
        },
        placeholderColor: {
            color: colorStyle.textColor,
        },
        inputStyle: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor,
            margin: 8
        },
        NoteAddButton: {
            flex: 8
        },
        noteTextSize: {
            fontSize: sizeStyle.textSize,
        },
        FlowLayoutCustom: {
            flex: 8
        },
        addIconCustom: {
            flex: 1,
            fontSize: sizeStyle.iconSize,
            color: colorStyle.iconColor
        },
        noteTextView:
        {
            height: 2,
            backgroundColor: 'gray',
            marginHorizontal: 8
        },
        containerEditNote: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: colorStyle.backgroundColor,
        },
        editorInput: {
            flex: 1,
            borderColor: 'gray',
            color: colorStyle.textColor,
            borderWidth: 1,
            marginHorizontal: 30,
            marginVertical: 5,
            backgroundColor: colorStyle.backgroundColor
        },
        customStyles:{
            color: colorStyle.textColor,
        },
        editorText:{
            color: colorStyle.textColor,
            backgroundColor: colorStyle.backgroundColor
        },
        subContainer: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 8,
            marginHorizontal: 8,
            marginVertical: 16
        },
        noteReferenceViewCustom: {
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 8
        },
        tapButton: {
            flex: 8,
            color: colorStyle.textColor,
            fontSize: sizeStyle.titleText
        },
        emptyMessageContainer: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
        },
        messageEmpty: {
            fontSize: sizeStyle.titleText,
            color: colorStyle.textColor,
        },
        emptyMessageIcon: {
            fontSize: sizeStyle.emptyIconSize,
            margin: 16,
            color: colorStyle.iconColor,
        },
        textEditorView: {
            flexDirection: 'column-reverse'
        },
        richTextEditor: {
            height: height,
            color: colorStyle.textColor,
            fontSize: sizeStyle.textSize,
            backgroundColor: colorStyle.backgroundColor
        },
        iconCustom: {
            margin: 8,
            padding: 8,
        },
        textStyle: {
            color: colorStyle.textColor,
            fontSize: sizeStyle.textSize
        },
        iconReferClose: {
            color: colorStyle.textColor,
            fontSize: sizeStyle.textSize
        }

    })


