import id_name_map from "../assets/mappings.json";
const Constants = require("./constants");
import {PermissionsAndroid} from 'react-native'

export function getHeading(contents) {
  if (contents) {
    let data = contents.find((item) => Array.isArray(item));
    if (data) {
      for (let section of data) {
        if (Object.keys(section)[0].startsWith('s') && typeof section[Object.keys(section)[0]][0] === 'string') {
          return section[Object.keys(section)[0]][0];
        }
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}
export async function AndroidPermission(permissionName){
  // We need to ask permission for Android only
  if (Platform.OS === 'android') {
    // Calling the permission function
    const alertPermission = permissionName.replace(/\_/g,' ').toLowerCase()
    console.log("alert permission ",alertPermission)
    // PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE, PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]).then((result) => {
    //   console.log('result', result);
    // })
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS[permissionName],
      {
        title: "VachanGo needs "+ alertPermission +" permission",
        message: 'VachanGo needs access to your '+alertPermission,
      },
    );
    console.log("GRANTED ",granted,PermissionsAndroid.RESULTS.GRANTED)
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Permission Granted
      return true
    } else {
      // Permission Denied
      return false
      // alert('CAMERA Permission Denied');
    }
  } else {
    return true
    // proceed();
  }
};
export function getBookNameFromMapping(id) {
  var obj = id_name_map.id_name_map;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      const bookId = id.toUpperCase();
      if (key == bookId) {
        var val = obj[key];
        return val.book_name;
      }
    }
  }
  return null;
}

export function getBookNumberFromMapping(id) {
  var obj = id_name_map.id_name_map;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var bookId = id.toUpperCase();

      if (key == bookId) {
        var val = obj[key];
        return val.number;
      }
    }
  }
  return null;
}

export function getBookChaptersFromMapping(id) {
  var obj = id_name_map.id_name_map;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var bookId = id.toUpperCase();
      if (key == bookId) {
        var val = obj[key];
        return val.total_chapters;
      }
    }
  }
  return null;
}
export function getBookSectionFromMapping(id) {
  var obj = id_name_map.id_name_map;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var bookId = id.toUpperCase();
      if (key == bookId) {
        var val = obj[key];
        return val.section;
      }
    }
  }
  return null;
}

export function getResultText(text) {
  if (text == null) {
    return "";
  }
  var initString = text;
  var temp = initString.split(" ");
  var footNote = false;
  var tempRes = [];
  for (var i = 0; i < temp.length; i++) {
    switch (temp[i]) {
      case Constants.MarkerConstants.MARKER_NEW_PARAGRAPH: {
        tempRes.push("\n");
        break;
      }
      case Constants.StylingConstants.MARKER_Q: {
        tempRes.push("\n    ");
        break;
      }
      default: {
        if (temp[i].startsWith(Constants.StylingConstants.MARKER_Q)) {
          var str = temp[i];
          var intString = str.replace(/[^0-9]/g, "");
          var number = intString == "" ? 1 : intString;
          tempRes.push("\n");
          for (var o = 0; o < parseInt(number, 10); o++) {
            tempRes.push(Constants.StylingConstants.TAB_SPACE);
          }
        } else if (
          temp[i].startsWith(Constants.StylingConstants.REGEX_ESCAPE)
        ) {
          break;
        } else if (temp[i].startsWith(Constants.StylingConstants.FOOT_NOTE)) {
          footNote = true;
          tempRes.push(Constants.StylingConstants.OPEN_FOOT_NOTE);
        } else if (temp[i] == "\\b") {
          break;
        } else {
          tempRes.push(temp[i] + " ");
        }
        break;
      }
    }
  }
  if (footNote) {
    tempRes.push(Constants.StylingConstants.CLOSE_FOOT_NOTE + " ");
  }
  return tempRes.join("");
}
