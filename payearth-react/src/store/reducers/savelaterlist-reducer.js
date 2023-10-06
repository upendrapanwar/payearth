import { createSlice } from "@reduxjs/toolkit";

const savelaterlistSlice = createSlice({
    name: 'savelaterlist',
    initialState: {
        selectedSavedItems: localStorage.getItem('selectedSavedItems') !== null ? JSON.parse(localStorage.getItem('selectedSavedItems')) : []
    },
    reducers: {
        setSelectedSavedItems: (state, action) => {
            state.selectedSavedItems = action.payload.selectedSavedItems
        }
    }
});

export const { setSelectedSavedItems } = savelaterlistSlice.actions;
export default savelaterlistSlice.reducer;