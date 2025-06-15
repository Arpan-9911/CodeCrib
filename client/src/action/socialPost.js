import * as api from '../api'

export const getAllPosts = () => async (dispatch) => {
  try {
    const { data } = await api.getAllPosts()
    dispatch({ type: 'GET_ALL_POSTS', payload: data })
  } catch (error) {
    const message = error.response?.data?.message || "Posts Not Found";
    throw new Error(message);
  }
}

export const createSocialPost = (FormData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.createSocialPost(FormData)
    dispatch({ type: 'CREATE_SOCIAL_POST', payload: data })
    dispatch(getAllPosts())
    navigate('/social')
  } catch (error) {
    const message = error.response?.data?.message || "Post Not Created";
    throw new Error(message);
  }
}

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id)
    dispatch({ type: 'LIKE_POST', payload: data })
    dispatch(getAllPosts())
  } catch (error) {
    const message = error.response?.data?.message || "Like Failed";
    throw new Error(message);
  }
}

export const sharePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.sharePost(id)
    dispatch({ type: 'SHARE_POST', payload: data })
    dispatch(getAllPosts())
  } catch (error) {
    const message = error.response?.data?.message || "Share Failed";
    throw new Error(message);
  }
}

export const addComment = (id, commentData) => async (dispatch) => {
  try {
    const { data } = await api.addComment(id, commentData)
    dispatch({ type: 'ADD_COMMENT', payload: data })
    dispatch(getAllPosts())
  } catch (error) {
    const message = error.response?.data?.message || "Comment Failed";
    throw new Error(message);
  }
}

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id)
    dispatch(getAllPosts())
  } catch (error) {
    const message = error.response?.data?.message || "Delete Failed";
    throw new Error(message);
  }
}