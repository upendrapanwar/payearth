import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from './../../../store/reducers/global-reducer';
import { setReqBody, setProducts, setTotalProducts, setBrands } from './../../../store/reducers/product-reducer';
import config from '../../../config.json';
import axios from 'axios';
import Select from 'react-select';

const ListingHead = (props) => {
    const dispatch = useDispatch();
    const productReqBody = useSelector(state => state.product.reqBody);
    const [defaultSelectedOption, setdefaultSelectedOption] = useState({label: 'Popularity', value: 'popular'});
    const sortingOptions = [
        {label: 'Popularity', value: 'popular'},
        {label: "What's New", value: 'new'},
        {label: 'Low-High', value: 'price_asc'},
        {label: 'High-Low', value: 'price_desc'}
    ];

    const handleChange = selectedOption => {
        let reqBody = {...productReqBody};
        let sortObj = {sort_type: '', sort_val: ''};

        if (selectedOption.value === 'popular') {
            sortObj.sort_type = 'popular';
            sortObj.sort_val = '';
        } else if(selectedOption.value === 'new') {
            sortObj.sort_type = 'new';
            sortObj.sort_val = '';
        } else if(selectedOption.value === 'price_asc') {
            sortObj.sort_type = 'price';
            sortObj.sort_val = 'asc';
        } else if(selectedOption.value === 'price_desc') {
            sortObj.sort_type = 'price';
            sortObj.sort_val = 'desc';
        }

        reqBody.sorting = sortObj;
        setdefaultSelectedOption(selectedOption);
        getProducts(reqBody);
        dispatch(setReqBody({reqBody}));
    }

    const getProducts = (param) => {
        let productsData = [];

        dispatch(setLoading({loading: true}));
        axios.post('front/product/listing', param).then((response) => {
            if (response.data.status) {
                let res = response.data.data.products;
                let ids = [];
                res.forEach(product => {
                    productsData.push({
                        id: product.id,
                        image: config.apiURI + product.featuredImage,
                        name: product.name,
                        price: product.price,
                        avgRating: product.avgRating,
                        isService: product.isService,
                        quantity: product.quantity,
                        cryptoPrices:product.cryptoPrices
                    });
                    ids.push(product.id);
                });
                dispatch(setProducts({products: productsData}));
                dispatch(setTotalProducts({totalProducts: response.data.data.totalProducts}));
                getBrands(ids);
            }
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                dispatch(setProducts({products: productsData}));
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    const getBrands = (ids) => {
        let requestBody = {product_ids: ids};
        axios.post('front/product/listing/brands', requestBody).then((response) => {
            if (response.data.status) {
                dispatch(setBrands({brands: response.data.data}));
            }
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                dispatch(setBrands({brands: []}));
            }
        });
    }

    return(
        <div className="pl_head">
            <div className="pro_search_count">{props.count} {props.title}</div>
            <div className="pro_sorting">
                <Select
                    className="sort_select"
                    options={sortingOptions}
                    value={defaultSelectedOption}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

export default ListingHead;