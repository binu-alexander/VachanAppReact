// all of our routes
// import { createStackNavigator, createDrawerNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'
import React, { Component } from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import About from "../screens/About/";
import Search from "../screens/Search/";
import Settings from "../screens/Settings";
import Notes from "../screens/Note/index";
import EditNote from "../screens/Note/EditNote";
import Highlights from "../screens/Highlights/";
import History from "../screens/History/";
import BibleWrapper from "../screens/Bible/BibleWrapper";

import Commentary from "../screens/StudyHelp/Commentary/";
import DrawerCommentary from "../screens/DrawerScreen/Commentary/";

import Dictionary from "../screens/StudyHelp/Dictionary/";
import DictionaryWords from "../screens/StudyHelp/Dictionary/DictionaryWords";
import Infographics from "../screens/StudyHelp/InfoGraphics/";
import InfographicsImage from "../screens/StudyHelp/InfoGraphics/InfographicsImage";

import Reset from "../screens/Auth/Reset";
import Register from "../screens/Auth/Register";
import Login from "../screens/Auth/Login";
import ProfilePage from "../screens/Auth/ProfilePage";
import Auth from "../screens/Auth/";

import DrawerScreen from "../screens/DrawerScreen";
import Bible from "../screens/Bible";
import LanguageList from "../screens/LanguageList";

import ReferenceSelection from "../screens/ReferenceSelection/";
import Bookmarks from "../screens/Bookmarks/";
import Video from "../screens/Video";
import PlayVideo from "../screens/Video/PlayVideo";
import Help from "../screens/Help";
import Feedback from "../screens/Help/Feedback";
import Hints from "../screens/Help/Hints";
import OBS from "../screens/StudyHelp/OBS/";
import BRP from "../screens/StudyHelp/BRP/";

import Color from "../utils/colorConstants";
import Audio from "../screens/Audio";

const DrawerStack = createDrawerNavigator();
const NavStack = createStackNavigator();

function NavStackScreen() {
  return (
    <NavStack.Navigator
      initialRouteName="Bible"
      screenOptions={{
        headerStyle: {
          backgroundColor: Color.Blue_Color,
          elevation: 0,
          shadowOpacity: 0,
          // fontWeight: "bold",
        },
        headerTintColor: Color.White,
        headerTitleStyle: {
          fontWeight: "bold",
          color: Color.White,
        },
      }}
    >
      <NavStack.Screen
        name="Bible"
        component={BibleWrapper}
        options={{
          headerBackTitleVisible: false,
          headerShown: false,
          headerTintColor: Color.White,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <NavStack.Screen
        name="DrawerScreen"
        component={DrawerScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <NavStack.Screen
        name="LanguageList"
        component={LanguageList}
        options={{
          headerTitle: "Languages",
          headerBackTitle: "Languages",
        }}
      />

      <NavStack.Screen
        name="ReferenceSelection"
        component={ReferenceSelection}
        options={{
          headerBackTitleVisible: false,
          headerTitle: null,
          headerStyle: {
            backgroundColor: Color.Blue_Color,
            height: 36,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <NavStack.Screen
        name="Search"
        component={Search}
        options={{ headerBackTitleVisible: false }}
      />
      <NavStack.Screen
        name="About"
        component={About}
        options={{
          headerBackTitle: "About Us",
          headerTitle: Platform.OS === "android" ? "About Us" : null,
        }}
      />
      <NavStack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerBackTitle: "Settings",
          headerTitle: Platform.OS === "android" ? "Settings" : null,
        }}
      />
      <NavStack.Screen
        name="Notes"
        component={Notes}
        options={{
          headerBackTitle: "Notes",
          headerTitle: Platform.OS === "android" ? "Notes" : null,
        }}
      />
      <NavStack.Screen name="EditNote" component={EditNote} options={{}} />
      <NavStack.Screen
        name="Highlights"
        component={Highlights}
        options={{
          headerBackTitle: "Highlights",
          headerTitle: Platform.OS === "android" ? "Highlights" : null,
        }}
      />
      <NavStack.Screen
        name="History"
        component={History}
        options={{
          headerBackTitle: "History",
          headerTitle: Platform.OS === "android" ? "History" : null,
        }}
      />
      <NavStack.Screen
        name="Commentary"
        component={Commentary}
        options={{
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="Dictionary"
        component={Dictionary}
        options={{
          headerBackTitle: "Dictionary",
          headerTitle: Platform.OS === "android" ? "Dictionary" : null,
        }}
      />
      <NavStack.Screen
        name="DictionaryWords"
        component={DictionaryWords}
        options={{
          headerBackTitle: "Dictionary words",
          headerTitle: Platform.OS === "android" ? "Dictionary words" : null,
        }}
      />
      <NavStack.Screen
        name="Infographics"
        component={Infographics}
        options={{
          headerBackTitle: "Infographics",
          headerTitle: Platform.OS === "android" ? "Infographics" : null,
        }}
      />
      <NavStack.Screen
        name="InfographicsImage"
        component={InfographicsImage}
        options={{ headerBackTitleVisible: false }}
      />
      <NavStack.Screen
        name="Reset"
        component={Reset}
        options={{
          headerBackTitle: "Forgot Passsword ?",
          headerTitle: Platform.OS === "android" ? "Forgot Passsword ?" : null,
        }}
      />
      <NavStack.Screen
        name="Register"
        component={Register}
        options={{
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="Login"
        component={Login}
        options={{
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="ProfilePage"
        component={ProfilePage}
        // options={{
        //   // headerBackTitle: "Profile",
        //   // headerTitle:Platform.OS === 'android' ? "Profile" : null,
        // }}
        options={{
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="Auth"
        component={Auth}
        options={{
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{
          headerBackTitle: "Bookmarks",
          headerTitle: Platform.OS === "android" ? "Bookmarks" : null,
        }}
      />
      <NavStack.Screen
        name="Audio"
        component={Audio}
        options={{
          headerBackTitle: "Audios",
          headerTitle: Platform.OS === "android" ? "Audios" : null,
        }}
      />
      <NavStack.Screen
        name="Video"
        component={Video}
        options={{
          headerBackTitle: "Videos",
          headerTitle: Platform.OS === "android" ? "Videos" : null,
        }}
      />
      <DrawerStack.Screen
        name="BRP"
        component={BRP}
        options={{
          headerBackTitle: "Reading Plans",
          headerTitle: Platform.OS === "android" ? "Reading Plans" : null,
        }}
      />
      <DrawerStack.Screen
        name="DrawerCommentary"
        component={DrawerCommentary}
        options={{
          headerBackTitle: "Commentary",
          headerTitle: Platform.OS === "android" ? "Commentary" : null,
        }}
      />

      <NavStack.Screen
        name="OBS"
        component={OBS}
        options={{
          headerBackTitle: "Bible Stories ",
          headerTitle: Platform.OS === "android" ? "Bible Stories" : null,
        }}
      />
      <NavStack.Screen name="PlayVideo" component={PlayVideo} options={{}} />
      <NavStack.Screen
        name="Help"
        component={Help}
        options={{
          headerBackTitle: "Help",
          headerTitle: Platform.OS === "android" ? "Help" : null,
        }}
      />
      <NavStack.Screen
        name="Hints"
        component={Hints}
        options={{
          headerBackTitle: "Hints",
          headerTitle: Platform.OS === "android" ? "Hints" : null,
        }}
      />
      <NavStack.Screen
        name="Feedback"
        component={Feedback}
        options={{
          headerBackTitle: "Feedback",
          headerTitle: Platform.OS === "android" ? "Feedback" : null,
        }}
      />
    </NavStack.Navigator>
  );
}

function DrawerStackScreen() {
  return (
    <DrawerStack.Navigator
      drawerContent={(props) => <DrawerScreen {...props} />}
    >
      <DrawerStack.Screen name="stack" component={NavStackScreen} />
    </DrawerStack.Navigator>
  );
}
export default class AppNavigator extends Component {
  render() {
    return <DrawerStackScreen />;
  }
}
