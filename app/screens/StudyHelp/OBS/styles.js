import { StyleSheet, Dimensions } from 'react-native'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import { colorStyle, sizeStyle } from '../../../utils/dynamicStyle';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorStyle.backgroundColor,
    },
    obsdropdownView: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    textStyle: {
        fontSize: sizeStyle.textSize,
        color: colorStyle.textColor,
        fontWeight: '400'
    },
    dropdownText: { fontSize: 18, fontWeight: '400', color: colorStyle.textColor } ,
    
    dropdownView: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colorStyle.iconColor, 
        borderWidth: 0.5
    },
    dropdownTextStyle: {
        fontSize: sizeStyle.titleText,
        color: colorStyle.textColor
    },
    dropdownSize:{ width: "60%", height: height / 2 },
    modalStyle: {
        alignSelf: 'flex-end',
        width: 150,
        marginTop: 32,
        right: 8,
        padding: 10,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: colorStyle.blueText,
    },
    modalStyle2: {
        alignSelf: 'flex-start',
        width: 150,
        marginTop: 32,
        left: 8,
        padding: 10,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: colorStyle.blueText,
    },
    dropdownStyle: {
        padding: 10,
        width: '60%',
        height: '70%',
        backgroundColor: colorStyle.backgroundColor,
    },
    body: { color: colorStyle.textColor, lineHeight: sizeStyle.lineHeight, fontSize: sizeStyle.textSize, alignItems: "center", justifyContent: 'center' },
    text: { color: colorStyle.textColor, lineHeight: sizeStyle.lineHeight, fontSize: sizeStyle.textSize, },
    code_block: { color: colorStyle.textColor, fontSize: sizeStyle.textSize },
    emptyMessageContainer: {
        flex: 1,
        backgroundColor: colorStyle.backgroundColor,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    messageEmpty: {
        fontSize: sizeStyle.titleText,
        color: colorStyle.textColor,
        textAlign: 'center'
    },
    emptyMessageIcon: {
        fontSize: sizeStyle.emptyIconSize,
        margin: 16,
        color: colorStyle.iconColor,
    },
    centerEmptySet: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
})
