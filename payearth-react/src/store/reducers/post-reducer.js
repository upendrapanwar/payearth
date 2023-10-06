import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        postsData: [],
        postCategories:[],
        postProducts:[],
        postImages:[]
    },
    reducers: {
        setPostsData: (state, action) => {
            state.postsData = action.payload.postsData
        },
        setPostCategories: (state, action) => {
            state.postCategories = action.payload.postCategories
        },
        setPostProducts: (state, action) => {
            state.postProducts = action.payload.postProducts
        },
        setPostImages: (state, action) => {
            state.postImages = action.payload.postImages
        }
    }
});

export const { setPostsData, setPostCategories,setPostProducts,setPostImages} = postSlice.actions;
export default postSlice.reducer;