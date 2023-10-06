import { createSlice } from "@reduxjs/toolkit";

const catSearchSlice = createSlice({
    name: 'catSearch',
    initialState: {
        selectedCategory: { label: 'All', value: '' },
        searchInput: '',
        isService: 0
    },
    reducers: {
        setCatSearchValue: (state, action) => {
            state.selectedCategory = action.payload.selectedCategory;
            state.searchInput = action.payload.searchInput;
        },
        setIsService: (state, action) => {
            state.isService = action.payload.isService;
        }
    }
});

export const { setCatSearchValue, setIsService } = catSearchSlice.actions;
export default catSearchSlice.reducer;