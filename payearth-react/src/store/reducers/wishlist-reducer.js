import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        selectedWishItems: localStorage.getItem('selectedWishItems') !== null ? JSON.parse(localStorage.getItem('selectedWishItems')) : []
    },
    reducers: {
        setSelectedWishItems: (state, action) => {
            state.selectedWishItems = action.payload.selectedWishItems
        }
    }
});

export const { setSelectedWishItems } = wishlistSlice.actions;
export default wishlistSlice.reducer;