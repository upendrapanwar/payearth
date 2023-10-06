import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        reqBody: {
            search_value: '',
            category_filter: [],
            sub_category_filter: [],
            brand_filter: [],
            color_filter: [],
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
        products: [],
        totalProducts: 0,
        categories: [],
        brands: [],
        colors: [],
        maxPrice: 0
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload.products;
        },
        setReqBody: (state, action) => {
            state.reqBody = action.payload.reqBody;
        },
        setTotalProducts: (state, action) => {
            state.totalProducts = action.payload.totalProducts;
        },
        setCategories: (state, action) => {
            state.categories = action.payload.categories;
        },
        setBrands: (state, action) => {
            state.brands = action.payload.brands;
        },
        setColors: (state, action) => {
            state.colors = action.payload.colors;
        },
        setMaxPrice: (state, action) => {
            state.maxPrice = action.payload.maxPrice;
        }
    }
});

export const {
    setProducts,
    setReqBody,
    setTotalProducts,
    setCategories,
    setBrands,
    setColors,
    setMaxPrice
} = productSlice.actions;
export default productSlice.reducer;