import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: 'post',
    initialState: {
        postsData: [],
        SellerPostsData: [],
        postCategories: [],
        postProducts: [],
        postImages: []
    },
    reducers: {
        setPostsData: (state, action) => {
            state.postsData = action.payload.postsData
        },
        setSellerPostsData: (state, action) => {
            state.SellerPostsData = action.payload.SellerPostsData
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

export const { setPostsData, setSellerPostsData, setPostCategories, setPostProducts, setPostImages } = postSlice.actions;
export default postSlice.reducer;