
import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
//import store from '../../store/index';

import axios from 'axios';

toast.configure();

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
    },

    reducers: {
        addToCart: (state, action) => {

            if (!Array.isArray(state.cart)) {
                state.cart = [];
            }

            const productinPayload = action.payload
            const itemInCart = state.cart.find((item) => item.id === action.payload.id);
            const authInfo = JSON.parse(localStorage.getItem('authInfo')); 
            console.log('itemInCart----in authInfo--------', authInfo)
            if (authInfo !== null) {
                console.log('itemInCart----in cart--------', itemInCart)
                console.log('itemInCart----in authInfo--------', authInfo)
                if (itemInCart) {
                    // itemInCart.quantity++;
                    itemInCart.quantity ++;
                    if (productinPayload.discountId) itemInCart.discountId = productinPayload.discountId;
                    if (productinPayload.discountPercent) itemInCart.discountPercent = productinPayload.discountPercent;
                    let reqBody = {
                        user_id: authInfo.id,
                        productId: itemInCart.id,
                        qty: itemInCart.quantity,
                        price: itemInCart.price,
                        discountId: itemInCart.discountId,
                    };
                    axios.post('user/addtocart', reqBody, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Authorization': `Bearer ${authInfo.token}`
                        }
                    }).then(response => {
                        if (response.data.status) {
                            toast.success('Product added', { autoClose: 3000 });
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
                }else{
                    let reqBody = {
                        user_id: authInfo.id,
                        productId: productinPayload.id,
                        qty: productinPayload.quantity,
                        price: productinPayload.price,
                        discountId: productinPayload.discountId || null
                    };
                    axios.post('user/addtocart', reqBody, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Authorization': `Bearer ${authInfo.token}`
                        }
                    }).then(response => {
                        if (response.data.status) {
                            toast.success('Product added', { autoClose: 3000 });
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
                    state.cart.push({ ...action.payload, quantity: 1 });
                }
            } else {
                if (itemInCart) {
                    itemInCart.quantity++;
                } else {
                    state.cart.push({ ...action.payload, quantity: 1 });
                    console.log('itemInCart----in cart----- else---')
                }
            }


        },


        incrementQuantity: (state, action) => {
            console.log('incrementQuantity----run')
           // const productinPayload = action.payload
            const item = state.cart.find((item) => item.id === action.payload);
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));
            if (authInfo === null) {
                console.log("user not login")
                item.quantity++;
            } else {
                console.log("user is login")
                item.quantity++;
                let reqBody = {
                    user_id: authInfo.id,
                    productId: item.id,
                    qty: item.quantity,
                    price: item.price,
                   // discountId: productinPayload.discountId || null
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
            }
        },

        decrementQuantity: (state, action) => {
           // const productinPayload = action.payload
            const item = state.cart.find((item) => item.id === action.payload);
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));
            if (authInfo === null) {
                if (item.quantity === 1) {
                    item.quantity = 1;
                } else {
                    item.quantity--;
                }
            } else {
                if (item.quantity === 1) {
                    item.quantity = 1;
                } else {
                    item.quantity--;
                }
                let reqBody = {
                    user_id: authInfo.id,
                    productId: item.id,
                    qty: item.quantity,
                    price: item.price,
                    //discountId: productinPayload.discountId || null

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
            }
        },

        removeItem: (state, action) => {
            //const productinPayload = action.payload
            const removeItem = state.cart.filter((item) => item.id !== action.payload);
            const Itemtodelete = state.cart.find((item) => item.id == action.payload);
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));

            // console.log('state---',state.cart)
            // console.log('action---',action.payload)
            // const removeItem = state.cart.filter((item) => item.id !== action.payload);
             console.log('removeItem---',removeItem)
            // const removeItem = state.cart.find((item) => item.id == action.payload);
            
            if (authInfo === null) {
                state.cart = removeItem;
            } else {
                state.cart = removeItem;
                let reqBody = {
                    user_id: authInfo.id,
                    productId: Itemtodelete.id,
                    qty: Itemtodelete.quantity,
                    price: Itemtodelete.price,
                   // discountId: productinPayload.discountId || null

                };
                console.log('reqBody--',reqBody)
                axios.post('user/deletefromcart', reqBody, {
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
        },
        clearCart: (state) => {
            console.log("clearCart run")
            state.cart = [];
        },

        updateCart: (state, action) => {
            state.cart = action.payload;
            console.log('Cart updated:', state.cart);
        },

    }
});

export const cartReducer = cartSlice.reducer;
export const {
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
    updateCart
} = cartSlice.actions;