import * as api from '../api'

export const getAllQuestions = () => async (dispatch) => {
  try {
    const { data } = await api.getAllQuestions()
    dispatch({ type: 'FETCH_ALL_QUESTIONS', payload: data })
  } catch (error) {
    console.log(error)
  }
}

export const askQuestion = (questionData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.askQuestion(questionData)
    dispatch({ type: 'ASK_QUESTION', payload: data })
    dispatch(getAllQuestions())
    navigate('/questions')
  } catch (error) {
    const message = error.response?.data?.message || "Question Not Posted";
    throw new Error(message);
  }
}

export const deleteQuestion = (id, navigate) => async (dispatch) => {
  try {
    await api.deleteQuestion(id)
    dispatch(getAllQuestions())
    navigate('/questions')
  } catch (error) {
    const message = error.response?.data?.message || "Question Not Deleted";
    throw new Error(message);
  }
}

export const voteQuestion = (id, value) => async (dispatch) => {
  try {
    await api.voteQuestion(id, value)
    dispatch(getAllQuestions())
  } catch (error) {
    const message = error.response?.data?.message || "Voting Failed";
    throw new Error(message);
  }
}