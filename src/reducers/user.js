import { SET_CHECKING, LOGOUT, SET_ADMIN, SET_USERS } from "../actions";

const initialState = {
    admin: null,
    users: [],
    checking: false,
}
const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHECKING: {
            return {
                ...state,
                checking: action.payload,
            }
        }
        case SET_ADMIN: {
            return {
                ...state,
                admin: action.payload,
            }
        }
        case SET_USERS: {
            return {
                ...state,
                users: action.payload,
            }
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
}

export default user;