import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
//import store from '../../store/index';
import axios from 'axios';
toast.configure();

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: []
    },
    
    reducers: {
        addToCart: (state, action) => {
            const itemInCart = state.cart.find((item) => item.id === action.payload.id);
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));
            
            if(itemInCart) {
                
                let reqBody = {
                    user_id: authInfo.id,
                    productId: itemInCart.id,
                    qty: itemInCart.quantity,
                    price: itemInCart.price
            
                };
                
                axios.post('user/addtocart', reqBody, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${authInfo.token}`
                    }
                }).then(response => {
                    
                    if (response.data.status) {
                        //toast.success(response.data.message, {autoClose: 3000});
                        //resetForm();
                    }
                }).catch(error => {
                    
                    if (error.response) {
                        //toast.error(error.response.data.message, {autoClose: 3000});
                    }
                }).finally(() => {
                    console.log('addtocart');
                    /*setTimeout(() => {
                        dispatch(setLoading({loading: false}));
                    }, 300);*/
                });
                itemInCart.quantity++;
            } else {
                state.cart.push({ ...action.payload, quantity: 1});
            }
        },
        incrementQuantity: (state, action) => {
            
            const item = state.cart.find((item) => item.id === action.payload);
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));
            item.quantity++;
            let reqBody = {
                user_id: authInfo.id,
                productId: item.id,
                qty: item.quantity,
                price: item.price
        
            };
            
            axios.post('user/updateToCart', reqBody, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then(response => {
                
                if (response.data.status) {
                    //toast.success(response.data.message, {autoClose: 3000});
                    //resetForm();
                }
            }).catch(error => {
                
                if (error.response) {
                    //toast.error(error.response.data.message, {autoClose: 3000});
                }
            }).finally(() => {
                console.log('incrementQuantity');
                /*setTimeout(() => {
                    dispatch(setLoading({loading: false}));
                }, 300);*/
            });
        },
        decrementQuantity: (state, action) => {
            
            const item = state.cart.find((item) => item.id === action.payload);
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));
            if(item.quantity === 1) {
                item.quantity = 1;        
            } else {
                item.quantity--;
            }
            let reqBody = {
                user_id: authInfo.id,
                productId: item.id,
                qty: item.quantity,
                price: item.price
        
            };
            axios.post('user/updateToCart', reqBody, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then(response => {
                
                if (response.data.status) {
                    //toast.success(response.data.message, {autoClose: 3000});
                    //resetForm();
                }
            }).catch(error => {
                
                if (error.response) {
                    //toast.error(error.response.data.message, {autoClose: 3000});
                }
            }).finally(() => {
                console.log('decrementQuantity');
                /*setTimeout(() => {
                    dispatch(setLoading({loading: false}));
                }, 300);*/
            });
        },
        removeItem: (state, action) => {
            const removeItem = state.cart.filter((item) => item.id !== action.payload);
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));
            state.cart = removeItem;
            let reqBody = {
                user_id: authInfo.id,
                productId: removeItem.id,
                qty: removeItem.quantity,
                price: removeItem.price
        
            };
            axios.post('user/updateToCart', reqBody, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then(response => {
                
                if (response.data.status) {
                    //toast.success(response.data.message, {autoClose: 3000});
                    //resetForm();
                }
            }).catch(error => {
                
                if (error.response) {
                    //toast.error(error.response.data.message, {autoClose: 3000});
                }
            }).finally(() => {
                console.log('removeItem');
                /*setTimeout(() => {
                    dispatch(setLoading({loading: false}));
                }, 300);*/
            });
        } 
    }
});

export const cartReducer = cartSlice.reducer;
export const {
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeItem
} = cartSlice.actions;