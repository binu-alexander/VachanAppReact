// all of our routes
// import { createStackNavigator, createDrawerNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'
import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import About from "../screens/About/";
import Search from "../screens/Search/";
import Settings from "../screens/Settings";
import Notes from "../screens/Note/index";
import EditNote from "../screens/Note/EditNote";
import Highlights from "../screens/Highlights/";
import History from "../screens/History/";

import Commentary from "../screens/StudyHelp/Commentary/";
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
        component={Bible}
        options={{
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
        options={{}}
      />
      <NavStack.Screen
        name="LanguageList"
        component={LanguageList}
        options={{
          headerTitle: "Languages",
        }}
      />

      <NavStack.Screen
        name="ReferenceSelection"
        component={ReferenceSelection}
        options={{
          headerTitle: null,
          headerStyle: {
            backgroundColor: Color.Blue_Color,
            height: 36,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
      <NavStack.Screen name="Search" component={Search} options={{}} />
      <NavStack.Screen
        name="About"
        component={About}
        options={{
          headerTitle: "About Us",
        }}
      />
      <NavStack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTitle: "Settings",
        }}
      />
      <NavStack.Screen
        name="Notes"
        component={Notes}
        options={{
          headerTitle: "Notes",
        }}
      />
      <NavStack.Screen name="EditNote" component={EditNote} options={{}} />
      <NavStack.Screen
        name="Highlights"
        component={Highlights}
        options={{
          headerTitle: "Highlights",
        }}
      />
      <NavStack.Screen
        name="History"
        component={History}
        options={{
          headerTitle: "History",
        }}
      />
      <NavStack.Screen
        name="Commentary"
        component={Commentary}
        options={{
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="Dictionary"
        component={Dictionary}
        options={{
          headerTitle: "Dictionary",
        }}
      />
      <NavStack.Screen
        name="DictionaryWords"
        component={DictionaryWords}
        options={{
          headerTitle: "Dictionary words",
        }}
      />
      <NavStack.Screen
        name="Infographics"
        component={Infographics}
        options={{
          headerTitle: "Infographics",
        }}
      />
      <NavStack.Screen
        name="InfographicsImage"
        component={InfographicsImage}
        options={{}}
      />
      <NavStack.Screen
        name="Reset"
        component={Reset}
        options={{
          headerTitle: "Forgot Passsword ?",
        }}
      />
      <NavStack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="Auth"
        component={Auth}
        options={{
          headerShown: false,
        }}
      />
      <NavStack.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{
          headerTitle: "Bookmarks",
        }}
      />
      <NavStack.Screen
        name="Audio"
        component={Audio}
        options={{
          headerTitle: "Audio",
        }}
      />
      <NavStack.Screen
        name="Video"
        component={Video}
        options={{
          headerTitle: "Video",
        }}
      />
      <DrawerStack.Screen
        name="BRP"
        component={BRP}
        options={{
          headerTitle: "Reading Plans",
        }}
      />
      <NavStack.Screen
        name="OBS"
        component={OBS}
        options={{
          headerTitle: "Bible Stories ",
        }}
      />
      <NavStack.Screen name="PlayVideo" component={PlayVideo} options={{}} />
      <NavStack.Screen
        name="Help"
        component={Help}
        options={{
          headerTitle: "Help",
        }}
      />
      <NavStack.Screen
        name="Hints"
        component={Hints}
        options={{
          headerTitle: "Hints",
        }}
      />
      <NavStack.Screen
        name="Feedback"
        component={Feedback}
        options={{
          headerTitle: "Feedback",
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
