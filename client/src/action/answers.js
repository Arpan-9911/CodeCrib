import * as api from '../api'
import { getAllQuestions } from './questions'
import { getAllUsers } from './users'

export const postAnswer = (id, answerData) => async (dispatch) => {
  try {
    const { data } = await api.postAnswer(id, answerData)
    dispatch({ type: 'POST_ANSWER', payload: data })
    dispatch(getAllQuestions())
    dispatch(getAllUsers())
  } catch (error) {
    const message = error.response?.data?.message || "Answer Not Posted";
    throw new Error(message);
  }
}

export const deleteAnswer = (id, answerId) => async (dispatch) => {
  try {
    await api.deleteAnswer(id, answerId)
    dispatch(getAllQuestions())
    dispatch(getAllUsers())
  } catch (error) {
    const message = error.response?.data?.message || "Answer Not Deleted";
    throw new Error(message);
  }
}

export const voteAnswer = (id, answerData) => async (dispatch) => {
  try {
    await api.voteAnswer(id, answerData)
    dispatch(getAllQuestions())
    dispatch(getAllUsers())
  } catch (error) {
    const message = error.response?.data?.message || "Voting Failed";
    throw new Error(message);
  }
}