import { TOGGLE_AUDIO } from "../action/actionsType";

export const ToggleAudio = (payload) => {
  return {
    type: TOGGLE_AUDIO,
    payload,
  };
};
