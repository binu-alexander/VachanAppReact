
import { combineReducers } from 'redux'

import updateVersionReducer from './updateVersionReducer';
import updateStylingReducer from './updateStylingReducer';
import fetchVersionReducer from './apiFetchReducer/fetchVersionReducer'
import fetchCommentaryReducer from './apiFetchReducer/fetchCommentaryReducer'
import fetchDictionaryReducer from './apiFetchReducer/fetchDictionaryReducer'
import fetchAudioReducer from './apiFetchReducer/fetchAudioReducer'
import fetchContentReducer from './apiFetchReducer/fetchContentReducer'
import parallelBibleReducer from './apiFetchReducer/parallelBibleReducer'
import userInfo from './UserInfoReducer'

const rootReducer = combineReducers({
    updateVersion: updateVersionReducer,
    updateStyling: updateStylingReducer,
    versionFetch: fetchVersionReducer,
    commentaryFetch: fetchCommentaryReducer,
    dictionaryFetch: fetchDictionaryReducer,
    audioFetch: fetchAudioReducer,
    contents: fetchContentReducer,
    parallel: parallelBibleReducer,
    userInfo: userInfo
})

export default rootReducer