import { USER_INFO ,USER_PASS_LOGED_IN} from '../action/actionsType';

const initialState = {
    email: null,
    uid: null,
    userName: '',
    phoneNumber: '',
    lodenIn:false
}
function UserInfoReducer(state = initialState, action) {
    switch (action.type) {
        case USER_INFO:
            return {
                ...state,
                email: action.payload.email,
                uid: action.payload.uid,
                userName: action.payload.userName,
                phoneNumber: action.payload.phoneNumber,
                photo: action.payload.photo
            }
        case USER_PASS_LOGED_IN:
            return {
                ...state,
                logedIn:action.payload.logedIn
            }
        default:
            return state
    }
}

export default UserInfoReducer