"use client";
import { createSlice } from "@reduxjs/toolkit";
import { useReducer } from "react";

const INITIAL_STATE = {
  currentUser: null,
  tempUser:null
};
const userSlice = createSlice({
  name: "user",
  initialState: INITIAL_STATE,
  reducers: {
    updateUser: (state, action) => {
      state.currentUser = action.payload;
      console.log("currentUser : ", state.currentUser);
    },
    signupUser: (state, action) => {
      state.tempUser = action.payload;
      console.log("signupUser : ", state.tempUser);
    },
  },
});

export const { updateUser ,signupUser} = userSlice.actions;
export default userSlice.reducer;
