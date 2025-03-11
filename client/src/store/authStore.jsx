import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name:'auth',
  initialState:{
    isAuthenticated: false,
    token: null
  },
  
  reducers:{
      isLoggedIn(state, action){
        isAuthenticated=true,
        token = action.payload.token
      },
      isLoggedOut(){
        isAuthenticated=false,
        token=null
      },

  }
})