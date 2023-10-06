import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
    name: 'service',
    initialState: {
        reqBody: {
            search_value: '',
            category_filter: [],
            sub_category_filter: [],
            episode_filter: [],
            rating_filter: [],
            price_filter: {
                min_val: '',
                max_val: ''
            },
            sorting: {
                sort_type: 'popular',
                sort_val: ''
            },
            count: {
                start: 0,
                limit: 9
            }
        },
        services: [],
        totalServices: 0,
        categories: [],
        episodes: [5, 10, 15, 20],
        ratings: [4, 3, 2, 1],
        maxPrice: 0,
        videoCount: 0
    },
    reducers: {
        setServices: (state, action) => {
            state.services = action.payload.services;
        },
        setServiceReqBody: (state, action) => {
            state.reqBody = action.payload.reqBody;
        },
        setTotalServices: (state, action) => {
            state.totalServices = action.payload.totalServices;
        },
        setServiceCategories: (state, action) => {
            state.categories = action.payload.categories;
        },
        setEpisodes: (state, action) => {
            state.episodes = action.payload.episodes;
        },
        setRatings: (state, action) => {
            state.ratings = action.payload.ratings;
        },
        setServiceMaxPrice: (state, action) => {
            state.maxPrice = action.payload.maxPrice;
        }
    }
});

export const {
    setServices,
    setServiceReqBody,
    setTotalServices,
    setServiceCategories,
    setEpisodes,
    setRatings,
    setServiceMaxPrice
} = serviceSlice.actions;
export default serviceSlice.reducer;