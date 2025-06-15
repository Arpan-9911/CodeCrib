import * as api from '../api'
import { getAllUsers } from './users'

export const subscribe = (plan) => async (dispatch) => {
  try {
    const { data } = await api.subscribe(plan)
    dispatch({ type: 'SUBSCRIBE', payload: data })
    dispatch(getAllUsers())
    return data
  } catch (error) {
    const message = error.response?.data?.message || "Subscription Failed";
    throw new Error(message);
  }
}

export const verifySubscription = (payload) => async (dispatch) => {
  try {
    const { data } = await api.verify(payload); // payload: { plan, paymentId, orderId, signature }
    dispatch({ type: 'VERIFY_SUBSCRIPTION', payload: data });
    dispatch(getAllUsers());
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Verification Failed";
    throw new Error(message);
  }
};