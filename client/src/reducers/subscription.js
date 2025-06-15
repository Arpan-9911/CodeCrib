const subscriptionReducer = (state = {data: null}, action) => {
  switch (action.type) {
    case 'SUBSCRIBE':
      return action.payload;
    case 'VERIFY_SUBSCRIPTION':
      return action.payload;
    default:
      return state;
  }
};

export default subscriptionReducer