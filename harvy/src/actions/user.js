import { LOGIN_USER, LOGOUT_USER } from './actionTypes'
import axios from 'axios'

const login = (user) => ({
  type: LOGIN_USER,
  user
})

export const loginUser = (email) => async (dispatch) => {
  const res = await axios.post('api/v1/login', {email:email})
  localStorage.setItem('email', email)
  dispatch(login(res.data))
}