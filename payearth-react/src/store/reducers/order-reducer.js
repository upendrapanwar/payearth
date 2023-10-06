import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orderInfo: [],
        timelines: [],
        reviews: false,
        comlaint: false,
        returnReq: false,
        cancelReq: false,
    },
    reducers: {
        setOrderInfo: (state, action) => {
            state.orderInfo = action.payload.orderInfo
        },
        setTimelines: (state, action) => {
            state.timelines = action.payload.timelines
        },
        setReviews: (state, action) => {
            state.reviews = action.payload.reviews
        },
        setComlaint: (state, action) => {
            state.comlaint = action.payload.comlaint
        },
        setReturnReq: (state, action) => {
            state.returnReq = action.payload.returnReq
        },
        setCancelReq: (state, action) => {
            state.cancelReq = action.payload.cancelReq
        }
    }
});

export const {
    setOrderInfo,
    setTimelines,
    setReviews,
    setComlaint,
    setReturnReq,
    setCancelReq
} = orderSlice.actions;
export default orderSlice.reducer;