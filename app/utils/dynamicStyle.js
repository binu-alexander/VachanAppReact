import store from '../store'
const state = store.getState()
const sizeFile = state.updateStyling.sizeFile
const colorFile = state.updateStyling.colorFile
export const colorStyle = {
        backgroundColor:  colorFile.backgroundColor,
        textColor:  colorFile.textColor,
        iconColor: colorFile.iconColor,
        borderColor:  colorFile.borderColor,
        borderBottomColor: colorFile.borderColor,
        fedColor:colorFile.fedBackgroundColor,
        headingText: colorFile.blueText
    }
export const sizeStyle = {
        textSize:sizeFile.contentText,
        iconSize:  sizeFile.chevronIconSize,
        titleText: sizeFile.titleText,
        lineHeight: sizeFile.lineHeight,
        emptyIconSize:sizeFile.emptyIconSize,
        sectionHeading:sizeFile.contentText
    }


