
import { TabNavigator } from "react-navigation";

import StudyHelp from './StudyHelp'
import NotePadNav from './NotePadStack'
import Audio from '../../screens/Audio'
import Video from '../../screens/Video'

const BottomTabNav = TabNavigator(
	{
    Audio:{
      screen:Audio
    },
    Video:{
      screen:Video
    },
    StudyHelp:{
      screen:StudyHelp
    },
    NotePadNav:{
      screen:NotePadNav
    }
	},
	{
		backBehavior: "none",
		tabBarPosition: "bottom"  
	}
)
export default BottomTabNav
