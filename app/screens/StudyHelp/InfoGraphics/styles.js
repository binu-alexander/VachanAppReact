import { StyleSheet, Dimensions } from 'react-native'
import { colorStyle, sizeStyle } from '../../../utils/dynamicStyle'
export const styles = StyleSheet.create({
    imagecontainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        resizeMode: 'contain',
        justifyContent: 'center',
    },
    pinchableImage: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    wrapper: {
        flex: 1,
        backgroundColor: colorStyle.backgroundColor,
    },
    container: {
        flex: 1,
        backgroundColor: colorStyle.backgroundColor,
        padding: 8
    },
    infoView: {
        width: '100%',
        fontSize: sizeStyle.fontSize,
    },
    infoText: {
        fontSize: sizeStyle.titleText,
        color: colorStyle.iconColor
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
    centerEmptySet: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    infoStyle: {
        height: '50%',
        width: '100%'
    },
    description: {
        marginHorizontal: 8,
        fontSize: sizeStyle.textSize,
        color: colorStyle.textColor
    },
    title: {
        margin: 16,
        fontSize: sizeStyle.titleText,
        color: colorStyle.textColor
    },
    cardItemStyle: {
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: colorStyle.backgroundColor
    },
    activityIndicator: { flex:1,justifyContent: 'center', alignSelf: 'center' }
})
