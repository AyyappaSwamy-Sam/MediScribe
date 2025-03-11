import { configureStore } from "@reduxjs/toolkit";
import {authSlice} from './authStore'

const store = configureStore({
    reducer:authSlice.reducer,
})

export default store