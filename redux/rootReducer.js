import { combineReducers } from "redux";
import userSlice from "./reducers/user";
import postSlice from "./reducers/post";

const rootReducer = combineReducers({
  user: userSlice,
  posts: postSlice,
});

export default rootReducer;
