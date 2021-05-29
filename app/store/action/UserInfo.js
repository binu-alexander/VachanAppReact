import { USER_INFO,USER_LOGED_IN } from "./actionsType";

export const userInfo = (payload) => {
    return {
        type: USER_INFO,
        payload
    }
}
export const userLogedIn = (payload) => {
    return {
        type: USER_LOGED_IN,
        payload
    }
}