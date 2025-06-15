import * as api from '../api'
import { setCurrentUser } from './currentUser'
import { getAllUsers } from './users'

export const signUp = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(authData)
    dispatch({ type: 'AUTH', data })
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem('profile'))))
    dispatch(getAllUsers())
    navigate('/')
  } catch (error) {
    const message = error.response?.data?.message || "Signup failed";
    throw new Error(message);
  }
}

export const login = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.login(authData)
    dispatch({ type: 'AUTH', data })
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem('profile'))))
    dispatch(getAllUsers())
    navigate('/')
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    throw new Error(message);
  }
}

export const googleLogin = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.googleLogin(authData)
    dispatch({ type: 'AUTH', data })
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem('profile'))))
    dispatch(getAllUsers())
    navigate('/')
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    throw new Error(message);
  }
}