import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/login-data/login-data.js";


const store = configureStore({
    reducer: {
        login: loginReducer
    }
})

export default store;