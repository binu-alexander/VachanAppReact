import { SELECT_CONTENT,PARALLEL_VISIBLE_VIEW } from "./actionsType";

export const selectContent = (payload) => {
    return {
        type: SELECT_CONTENT,
        payload
    }
}
export const parallelVisibleView = (payload) => {
    return {
        type: PARALLEL_VISIBLE_VIEW,
        payload
    }
}