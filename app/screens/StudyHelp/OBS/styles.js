import { StyleSheet, Dimensions } from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export const OBSStyle = (colorFile, sizeFile) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorFile.backgroundColor,
            paddingHorizontal: 8,
            alignItems:'center'
            // justifyContent:'center'
        },
        textStyle: {
            fontSize: sizeFile.contentText,
            color: colorFile.iconColor,
            fontWeight: '400'
        },
        dropdownTextStyle: {
            fontSize: sizeFile.titleText,
            color: colorFile.iconColor
        },
        // modalStye:{
        //     backgroundColor:colorFile.backgroundColor,
        // },
        body: { color: colorFile.textColor, fontSize: sizeFile.contentText,alignItems: "center",justifyContent:'center' },
        heading2: { color: colorFile.textColor },
        code_block: { color: colorFile.textColor, fontSize: sizeFile.contentText },
        // markDownStyle:{
        //     body: {color:colorFile.textColor, fontSize: sizeFile.contentText},
        //     heading2: {color:colorFile.textColor },
        //     code_block: {color:colorFile.textColor, fontSize: sizeFile.contentText}
        //   },
        dropdownStyle: {
            padding: 10,
            width: '60%',
            height: '70%',
            backgroundColor: colorFile.backgroundColor,
        },
        emptyMessageContainer: {
            flex: 1,
            backgroundColor: colorFile.backgroundColor,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
        },
        messageEmpty: {
            fontSize: sizeFile.titleText,
            color: colorFile.textColor,
            textAlign:'center'
        },
        emptyMessageIcon: {
            fontSize: sizeFile.emptyIconSize,
            margin: 16,
            color: colorFile.iconColor,
        },
        centerEmptySet: {
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        },
    })
}