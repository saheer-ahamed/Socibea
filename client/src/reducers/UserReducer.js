import Cookies from "js-cookie"

export function userReducer(
    state = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null, 
    action){
    switch (action.type) {
        case "LOGIN":
            return action.payload
        case "LOGOUT":
            return state = null 
        case "FOLLOW":
            return {...state, following: [...state.following, action.payload]} 
        case "UNFOLLOW":
            return {...state, following: [...state.following.filter(f => f !== action.payload)]} 
        default: 
            return state
    }
}