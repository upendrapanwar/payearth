import { createSlice } from "@reduxjs/toolkit";

const postLikeSlice = createSlice({
    name: 'like',
    initialState: {
        likedPostItems: localStorage.getItem('likedPostItems') !== null ? JSON.parse(localStorage.getItem('likedPostItems')) : []
    },
    reducers: {
        setLikedPostItems: (state, action) => {
            state.likedPostItems = action.payload.likedPostItems
        }
    }
});

export const { setLikedPostItems } = postLikeSlice.actions;
export default postLikeSlice.reducer;