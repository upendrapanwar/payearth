import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux';
import authSlice from './reducers/auth-reducer';
import catSearchSlice from './reducers/cat-search-reducer';
import globalSlice from "./reducers/global-reducer";
import productSlice from './reducers/product-reducer';
import serviceSlice from './reducers/service-reducer';
import orderSlice from './reducers/order-reducer';
import wishlistSlice from './reducers/wishlist-reducer';
import savelaterlistSlice from './reducers/savelaterlist-reducer';
import postSlice from './reducers/post-reducer';
import { cartReducer } from "./reducers/cart-slice-reducer";
import { loadState, saveState } from "../helpers/localstorage";

import storage from "redux-persist/lib/storage";
import throttle from "lodash.throttle"; 

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist"


const persistConfig = {
    key: 'root',
    storage: storage,
    blacklist: []
}



const persistedState = loadState();

export const rootReducer = combineReducers({ 
  auth: authSlice,
  catSearch: catSearchSlice,
  product: productSlice,
  service: serviceSlice,
  global: globalSlice,
  order: orderSlice,
  wishlist: wishlistSlice,
  savelater: savelaterlistSlice,
  post: postSlice,
  cart: cartReducer,
  //persistedReducer: persistedReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    persistedState,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    
})

store.subscribe(throttle(() => {
  saveState({
    todos: store.getState().todos
  });
},1000));
export const persistor = persistStore(store);

export default store;
