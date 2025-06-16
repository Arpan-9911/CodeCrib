import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API })
API.interceptors.request.use((req) => {
  if(localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
  }
  return req
})

// Auth
export const login = (authData) => API.post('/auth/login', authData)
export const signUp = (authData) => API.post('/auth/signup', authData)
export const googleLogin = (authData) => API.post('/auth/googleLogin', authData)

// Users
export const getAllUsers = () => API.get('/users/get')
export const updateUser = (id, updatedUser) => API.patch(`/users/update/${id}`, updatedUser)
export const sendFriendRequest = (fromId, toId) => API.patch('/users/sendFriendRequest', { fromId, toId })
export const acceptFriendRequest = (myId, friendId) => API.patch('/users/acceptFriendRequest', { myId, friendId })
export const rejectFriendRequest = (myId, friendId) => API.patch('/users/rejectFriendRequest', { myId, friendId })
export const removeFriend = (myId, friendId) => API.patch('/users/removeFriend', { myId, friendId })
export const sharePoints = (recipientId, amount) => API.post('/users/sharePoints', { recipientId, amount })
export const toggleNotification = (id) => API.patch(`/users/toggleNotification/${id}`)

// Questions
export const getAllQuestions = () => API.get('/questions/get')
export const askQuestion = (questionData) => API.post('/questions/ask', questionData)
export const deleteQuestion = (id) => API.delete(`/questions/delete/${id}`)
export const voteQuestion = (id, value) => API.patch(`/questions/vote/${id}`, { value })


// Answers
export const postAnswer = (id, answerData) => API.post(`/answers/post/${id}`, answerData)
export const deleteAnswer = (id, answerId) => API.delete(`/answers/delete/${id}`, { data: { answerId }})
export const voteAnswer = (id, answerData) => API.patch(`/answers/vote/${id}`, answerData)

// Subscription
export const subscribe = (plan) => API.post('/subscription/subscribe', { plan })
export const verify = (payload) => API.post('/subscription/verify', payload)

// Social Posts
export const createSocialPost = (FormData) =>
  API.post('/social/create', FormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
export const getAllPosts = () => API.get('/social/get')
export const likePost = (id) => API.patch(`/social/like/${id}`)
export const sharePost = (id) => API.patch(`/social/share/${id}`)
export const addComment = (id, commentData) => API.post(`/social/comment/${id}`, commentData)
export const deletePost = (id) => API.delete(`/social/delete/${id}`)