import axios from "axios";
import store from "../store";
import { setLoading } from './../store/reducers/global-reducer';
import { setBrands, setColors } from './../store/reducers/product-reducer';

const getBrands = (dispatch) => {
    let products = JSON.parse(JSON.stringify([...store.getState().product.products]));
    let reqBody = { product_ids: [] };
    products.forEach((product) => {
        reqBody.product_ids.push(product.id);
    });

    dispatch(setLoading({ loading: true }));
    axios.post('front/product/listing/brands', reqBody).then((response) => {
        if (response.data.status) {
            dispatch(setBrands({ brands: response.data.data }));
        }
    }).catch(error => {
        if (error.response && error.response.data.status === false) {
            dispatch(setBrands({ brands: [] }));
        }
    }).finally(() => {
        setTimeout(() => {
            dispatch(setLoading({ loading: false }));
        }, 300);
    });
}

const getColors = (dispatch) => {
    let products = JSON.parse(JSON.stringify([...store.getState().product.products]));
    let reqBody = { product_ids: [] };
    products.forEach((product) => {
        reqBody.product_ids.push(product.id);
    });

    dispatch(setLoading({ loading: true }));
    axios.post('front/product/listing/colors', reqBody).then((response) => {
        if (response.data.status) {
            dispatch(setColors({ colors: response.data.data }));
        }
    }).catch(error => {
        if (error.response && error.response.data.status === false) {
            dispatch(setColors({ colors: [] }));
        }
    }).finally(() => {
        setTimeout(() => {
            dispatch(setLoading({ loading: false }));
        }, 300);
    });
}

export { getBrands, getColors };