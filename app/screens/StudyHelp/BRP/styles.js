import { StyleSheet, Dimensions } from 'react-native'
import { colorStyle ,sizeStyle} from '../../../utils/dynamicStyle'
import Colors from '../../../utils/colorConstants'

export const styles = StyleSheet.create({
        container: {
            flex:1,
            backgroundColor: colorStyle.backgroundColor,
        },
        agendaBackgroundColor: {
            backgroundColor: colorStyle.backgroundColor,
        },
        textStyle: {
            fontSize: sizeStyle.textSize,
            color: colorStyle.textColor,
            fontWeight: '400',
        },
        dropdownTextStyle: {
            fontSize: sizeStyle.titleText,
            color: colorStyle.iconColor
        },
        centerView:{ flex: 1, justifyContent: "center", alignItems: "center" },
        activityIndicator:{ flex: 1, justifyContent: 'center', alignSelf: 'center' },
        calenderHeader: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 10
        },
        headerStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            paddingTop: 10,
            paddingBottom: 10,
            color: colorStyle.blueText,
            paddingRight: 5,
            marginLeft: 5
        },
        item: {
            backgroundColor: colorStyle.backgroundColor,
            shadowColor: colorStyle.textColor,
            shadowOpacity: 0.26,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 10,
            elevation: 3,
            marginRight: 10,
            marginTop: 32,
            paddingLeft:16,
            justifyContent:'center'
        },
        agendaDate: {
            alignSelf: 'center',
            color: '#fff',
            fontSize: 18,
            paddingVertical: 8,
            // backgroundColor: colorStyle.backgroundColor
        },
        emptyDate: {
            height: 15,
            flex: 1,
            paddingTop: 30,
            backgroundColor: colorStyle.backgroundColor
        },
        dropdownStyle: {
            padding: 10,
            width: '60%',
            height: '70%',
            backgroundColor: colorStyle.backgroundColor,
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
        dropdownView:{ marginRight: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }
    })
