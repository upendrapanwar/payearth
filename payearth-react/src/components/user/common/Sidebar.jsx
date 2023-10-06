import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setReqBody, setProducts, setTotalProducts, setMaxPrice } from '../../../store/reducers/product-reducer';
import { setLoading } from '../../../store/reducers/global-reducer';
import config from './../../../config.json';
import axios from 'axios';
import RangeTwoThumbs from './RangeTwoThumbs';
import { getBrands, getColors } from '../../../helpers/product-listing';
import { useLocation } from 'react-router-dom';

const Sidebar = (props) => {
    const {categories, pageName} = props;
    const dispatch = useDispatch();
    const location = useLocation();
    const [catCheckBoxes, setCatCheckBoxes] = useState([]);
    const selectedCategory = useSelector(state => state.catSearch.selectedCategory);
    var productReqBody = useSelector(state => state.product.reqBody);
    var brands = useSelector(state => state.product.brands);
    var colors = useSelector(state => state.product.colors);
    let subCatId = /subcat=([^&]+)/.exec(location.search) !== null ? /subcat=([^&]+)/.exec(location.search)[1] : '';

    useEffect(() => {
        let checks = [];
        categories.forEach(category => {
            checks.push(category.value === subCatId ? true : false);
        });
        setCatCheckBoxes(checks);
    }, [subCatId, categories]);

    const handleCatCheckbox = (event, i) => {
        let reqBody = JSON.parse(JSON.stringify({...productReqBody}));
        let checks = [...catCheckBoxes];

        if (selectedCategory.value === '') {
            let index = reqBody.category_filter.indexOf(event.target.value);

            if (event.target.checked) {
                reqBody.category_filter.push(event.target.value);
            } else {
                if (index >= 0) {
                    reqBody.category_filter.splice(index , 1);
                }
            }
        } else {
            let index = reqBody.sub_category_filter.indexOf(event.target.value);

            if (event.target.checked) {
                reqBody.sub_category_filter.push(event.target.value);
            } else {
                if (index >= 0) {
                    reqBody.sub_category_filter.splice(index , 1);
                }
            }
        }

        // For control checkboxes
        checks[i] = event.target.checked === true ? true : false;
        setCatCheckBoxes(checks);

        reqBody.price_filter = {min_val: '', max_val: ''};
        reqBody.brand_filter = [];
        reqBody.color_filter = [];
        dispatch(setReqBody({reqBody: reqBody}));
        productReqBody = reqBody;
        getProducts(true);
    }

    const handleBrandCheckbox = event => {
        let reqBody = JSON.parse(JSON.stringify({...productReqBody}));
        let index = reqBody.brand_filter.indexOf(event.target.value);

        if (event.target.checked) {
            reqBody.brand_filter.push(event.target.value);
        } else {
            if (index >= 0) {
                reqBody.brand_filter.splice(index , 1);
            }
        }

        dispatch(setReqBody({reqBody: reqBody}));
        productReqBody = reqBody;
        getProducts(false);
    }

    const handleColorCheckbox = event => {
        let reqBody = JSON.parse(JSON.stringify({...productReqBody}));
        let index = reqBody.color_filter.indexOf(event.target.value);

        if (event.target.checked) {
            reqBody.color_filter.push(event.target.value);
        } else {
            if (index >= 0) {
                reqBody.color_filter.splice(index , 1);
            }
        }

        dispatch(setReqBody({reqBody: reqBody}));
        productReqBody = reqBody;
        getProducts(false);
    }

    const getProducts = param => {
        let productsData = [];
        dispatch(setLoading({loading: true}));
        if (param) {
            dispatch(setMaxPrice({maxPrice: ''}));
        }
        axios.post('front/product/listing', productReqBody).then((response) => {
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
                if (param) {
                    dispatch(setMaxPrice({maxPrice: response.data.data.maxPrice}));
                    getBrands(dispatch);
                    getColors(dispatch);
                }
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

    return(
        <div className="side_bar">
            <div className="filters">
                {pageName === 'product-listing' && categories.length ?
                    <ul className="filter_list">
                        <li>
                            <h3>Categories</h3>
                        </li>
                        {categories.map((category, index) => {
                            if (category.value !== '') {
                                return  <li key={category.value}>
                                            <div className="form-check d-flex">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={category.value}
                                                    value={category.value}
                                                    onChange={(event) => handleCatCheckbox(event, index)}
                                                    checked={catCheckBoxes[index]}
                                                />
                                                <label className="form-check-label" htmlFor={category.value}>{category.label}</label>
                                            </div>
                                        </li>
                            } else {
                                return '';
                            }
                        })}
                    </ul> : ''
                }

                <ul className="filter_list">
                    <li>
                        <h3>Price</h3>
                    </li>
                    <li className="mb-5"><RangeTwoThumbs currency="USD" currencySymbol="$" /></li>
                </ul>

                {pageName === 'product-listing' && brands.length ?
                    <ul className="filter_list">
                        <li>
                            <h3>Brands</h3>
                        </li>
                        {brands.map((brand, index) => {
                            return  <li key={brand.id}>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value={brand.id} id={brand.id} onChange={handleBrandCheckbox} />
                                            <label className="form-check-label" htmlFor={brand.id}>{brand.brandName}</label>
                                        </div>
                                    </li>
                        })}
                    </ul> : ''
                }
                {pageName === 'product-listing' && colors.length ?
                    <ul className="filter_list">
                        <li>
                            <h3>Color</h3>
                        </li>

                        <li>
                            <div className="colors_grid">
                                {colors.map((color, index) => {
                                    return <span className="color_box d-inline-block"  data={color.lname} key={color.id} style={{backgroundColor: (color.code === '#ffffff' ? '#f1f1f1' : color.code), border:"1px solid #00000045"}}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            name="color"
                                            value={color.lname}
                                            onChange={handleColorCheckbox}
                                        />
                                    </span>
                                })}
                            </div>
                        </li>
                    </ul> : ''
                }
            </div>
        </div>
    )
}

export default Sidebar;