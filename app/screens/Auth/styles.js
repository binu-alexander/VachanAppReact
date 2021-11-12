import { StyleSheet, Dimensions } from 'react-native'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import { colorStyle, sizeStyle } from '../../utils/dynamicStyle'

import Color from '../../utils/colorConstants'
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorStyle.backgroundColor
  },
  containerMargin: {
    margin: 8,
  },
  textStyle: {
    color: colorStyle.textColor,
    fontSize: sizeStyle.textSize,
    marginLeft: 4,
    lineHeight: sizeStyle.lineHeight
  },
  cardItemStyle: {
    backgroundColor: colorStyle.backgroundColor
  },
  cardStyle: {
    margin: 16,
    padding: 8
  },
  loaderStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    color: "#0000ff"
  },
  iconStyle: {
    margin: 8,
    padding: 8,
    fontSize: sizeStyle.iconSize,
    color: colorStyle.iconColor
  },
  textInputStyle: {
    height: 40,
    borderColor: Color.Gray,
    borderWidth: 1,
    marginVertical: 8
  },
  placeholderColor: {
    color: colorStyle.textColor,
  },
  cardItemIconCustom: {
    marginHorizontal: 4,
    marginVertical: 4,
    color: colorStyle.settingsIconColor,
    fontSize: 32
  },
  //login
  passwordView: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    marginHorizontal: 10
  },
  loginText: {
    color: Color.Blue_Color,
    marginTop: 25,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Color.White
  },
  bcsIconContainer: { padding: 35, flex: 1 },
  alignItem: { alignItems: "center", justifyContent: "center" },
  bcsIcon: { width: 50, height: 50, marginVertical: 16 },
  bcsImage: {
    fontSize: 26,
    color: Color.Blue_Color,
    fontWeight: "bold",
  },
  justifyItem: {
    flexDirection: "column",
    justifyContent: "center",
  },
  deviderView: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",

  },
  //profile
  header: {
    backgroundColor: "#00BFFF",
    height: 200,
  },
  profileform: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: Color.Transparent,
    marginBottom: 10,
    alignSelf: 'center',
  },
  name: {
    fontSize: 22,
    color: Color.White,
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: Color.Gray,
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: Color.Gray,
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },
  cardItemIconCustom: {
    marginHorizontal: 4,
    marginVertical: 4,
    color: colorStyle.settingsIconColor,
    fontSize: 32
  },
  signupText: {
    fontSize: 26, color: Color.Blue_Color, fontWeight: 'bold'
  },
  //reset 
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    color: colorStyle.textColor
  },
  resetView:{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35
  },
  loginText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center'
  },
  eyeIcon: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 10,
    bottom: 30,
    color: colorStyle.textColor,
  },
  headerCloseIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    margin: 12,
    color: colorStyle.textColor
  },
  divider: {
    margin: 4,
    fontSize: 18,
    fontWeight: '700',
    color: colorStyle.textColor
  },
  dividerLine: {
    width: '45%',
    borderBottomColor: colorStyle.textColor,
    borderBottomWidth: 1,
  },
  //profile page 
  cardBgColor: {
    backgroundColor: colorStyle.fedBackgroundColor
  },
  cardStyling: {
    backgroundColor: colorStyle.backgroundColor
  },
  cardItemStyling: {
    backgroundColor: colorStyle.backgroundColor,
    color: colorStyle.textColor
  }
})


