import { USER_INFO,USER_PASS_LOGED_IN } from "./actionsType";

export const userInfo = (payload) => {
    return {
        type: USER_INFO,
        payload
    }
}
export const userPassLogedIn = (payload) => {
    return {
        type: USER_PASS_LOGED_IN,
        payload
    }
}