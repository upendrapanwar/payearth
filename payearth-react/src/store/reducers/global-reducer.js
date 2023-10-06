import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name: 'global',
    initialState: {
        loading: false,
        isLoginModalOpen: false
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload.loading;
        },
        setIsLoginModalOpen: (state, action) => {
            state.isLoginModalOpen = action.payload.isLoginModalOpen;
        }
    }
});

export const { setLoading, setIsLoginModalOpen } = globalSlice.actions;
export default globalSlice.reducer;