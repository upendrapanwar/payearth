import { createSlice } from "@reduxjs/toolkit";

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
const authInfo = JSON.parse(localStorage.getItem('authInfo'));
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: userInfo !== null ? true : false,
        userInfo: userInfo !== null ? userInfo : [],
        authInfo: authInfo !== null ? authInfo : []
    },
    reducers: {
        setLoginStatus: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload.userInfo;
        },
        setAuthInfo: (state, action) => {
            state.authInfo = action.payload.authInfo;
        }
    }
});

export const { setUserInfo, setLoginStatus, setAuthInfo } = authSlice.actions;
export default authSlice.reducer;