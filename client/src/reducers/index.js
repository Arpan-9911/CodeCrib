import { combineReducers } from 'redux';
import authReducer from './auth';
import currentUserReducer from './currentUser';
import usersReducer from './users';
import questionsReducer from './questions';
import subscriptionReducer from './subscription';
import socialPostsReducer from './socialPost';

export default combineReducers({ authReducer, currentUserReducer, usersReducer, questionsReducer, subscriptionReducer, socialPostsReducer });