import { combineReducers } from "redux";

import updateVersionReducer from "./updateVersionReducer";
import audioReducer from "./audioReducer";
import updateStylingReducer from "./updateStylingReducer";
import fetchVersionReducer from "./apiFetchReducer/fetchVersionReducer";
import vachanAPIFetch from "./apiFetchReducer/vachanAPIFetch";
import fetchContentReducer from "./apiFetchReducer/fetchContentReducer";
import userInfo from "./UserInfoReducer";
import selectContent from "./selectContent";

const rootReducer = combineReducers({
  updateVersion: updateVersionReducer,
  audio: audioReducer,
  updateStyling: updateStylingReducer,
  versionFetch: fetchVersionReducer,
  vachanAPIFetch: vachanAPIFetch,
  contents: fetchContentReducer,
  userInfo: userInfo,
  selectContent: selectContent,
});

export default rootReducer;
