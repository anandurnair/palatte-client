"use client";
import { createSlice } from "@reduxjs/toolkit";
import { useReducer } from "react";

const INITIAL_STATE = {
  userPosts: [],
  saved : [],
  allPosts :[]
};
const postSlice = createSlice({
  name: "posts",
  initialState: INITIAL_STATE,
  reducers: {
    
    updateUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },
    updateSaved: (state, action) => {
      state.saved = action.payload;
    },
    updateAllPosts :(state,action)=>{
        state.allPosts = action.payload;
    }
  },
});

export const { updateUserPosts ,updateSaved ,updateAllPosts} = postSlice.actions;
export default postSlice.reducer;
