const socialPostsReducer=(state={data:null},action)=>{
  switch (action.type) {
    case "CREATE_SOCIAL_POST":
      return {...state};
    case "GET_ALL_POSTS":
      return {...state,data:action.payload};
    case "LIKE_POST":
      return {...state};
    case "SHARE_POST":
      return {...state};
    case "ADD_COMMENT":
      return {...state};
    default:
      return state;
  }
};
export default socialPostsReducer;