import { TOGGLE_AUDIO } from "../action/actionsType";

const initialState = {
  audio: false,
  status: false,
};
function audioReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_AUDIO:
      return {
        ...state,
        audio: action.payload.audio,
        status: action.payload.status,
      };
    default:
      return state;
  }
}

export default audioReducer;
