import { StyleSheet } from 'react-native'
import { colorStyle ,sizeStyle  } from '../../utils/dynamicStyle'
export const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playButton: {
      height: 56,
      width: 56,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    secondaryControl: {
    },
    off: {
      opacity: 0.30,
    },
    iconStyle: {
      color: colorFile.chevronIconColor,
      fontSize: sizeFile.chevronIconSize
    }

  })

