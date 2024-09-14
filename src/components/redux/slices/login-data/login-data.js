import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if it exists
const initialState  = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

export const loginData = createSlice({
    name: "login",
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload;
            // Persist user data to localStorage
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logoutUser: (state) => {
            state.user = null;
            // Clear user data from localStorage
            localStorage.removeItem("user");
        },
    }
});

export const { loginUser, logoutUser } = loginData.actions;

export default loginData.reducer;
