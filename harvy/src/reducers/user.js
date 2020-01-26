import { LOGIN_USER, LOGOUT_USER } from '../actions/actionTypes'

const initialState = {
  user: null
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.user
      }
      default: return state;
  }
}

export default user;