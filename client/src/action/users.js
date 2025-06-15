import * as api from "../api"

export const getAllUsers = () => async (dispatch) => {
  try {
    const { data } = await api.getAllUsers()
    dispatch({ type: 'FETCH_ALL_USERS', payload: data })
  } catch (error) {
    console.log(error)
  }
}

export const updateUser = (id, updatedUser) => async (dispatch) => {
  try {
    const { data } = await api.updateUser(id, updatedUser)
    dispatch({ type: 'UPDATE_PROFILE', payload: data })
    dispatch(getAllUsers())
  } catch (error) {
    const message = error.response?.data?.message || "User Update Failed";
    throw new Error(message);
  }
}

export const sendFriendRequest = (fromId, toId) => async (dispatch) => {
  try {
    const { data } = await api.sendFriendRequest(fromId, toId)
    dispatch({ type: 'UPDATE_PROFILE', payload: data })
    dispatch(getAllUsers())
  } catch (error) {
    const message = error.response?.data?.message || "Request Failed";
    throw new Error(message);
  }
}

export const acceptFriendRequest = (myId, friendId) => async (dispatch) => {
  try {
    const { data } = await api.acceptFriendRequest(myId, friendId)
    dispatch({ type: 'UPDATE_PROFILE', payload: data })
    dispatch(getAllUsers())
  } catch (error) {
    const message = error.response?.data?.message || "Request Failed";
    throw new Error(message);
  }
}

export const rejectFriendRequest = (myId, friendId) => async (dispatch) => {
  try {
    const { data } = await api.rejectFriendRequest(myId, friendId)
    dispatch({ type: 'UPDATE_PROFILE', payload: data })
    dispatch(getAllUsers())
  } catch (error) {
    const message = error.response?.data?.message || "Request Failed";
    throw new Error(message);
  }
}

export const removeFriend = (myId, friendId) => async (dispatch) => {
  try {
    const { data } = await api.removeFriend(myId, friendId)
    dispatch({ type: 'UPDATE_PROFILE', payload: data })
    dispatch(getAllUsers())
  } catch (error) {
    const message = error.response?.data?.message || "Request Failed";
    throw new Error(message);
  }
}

export const sharePoints = (recipientId, amount) => async (dispatch) => {
  try {
    const { data } = await api.sharePoints(recipientId, amount)
    dispatch({ type: 'UPDATE_PROFILE', payload: data })
    dispatch(getAllUsers())
    
  } catch (error) {
    const message = error.response?.data?.message || "Points Share Failed";
    throw new Error(message);
  }
}