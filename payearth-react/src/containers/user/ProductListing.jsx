
import React, { useState, useEffect } from 'react';
import Header from './../../components/user/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import Sidebar from './../../components/user/common/Sidebar';
import Footer from './../../components/common/Footer';
import ListingHead from './../../components/user/common/ListingHead';
import ProductCard from './../../components/common/ProductCard';
import { NotFound } from './../../components/common/NotFound';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import config from './../../config.json';
import axios from 'axios';
import { Link, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setReqBody, setTotalProducts, setMaxPrice } from './../../store/reducers/product-reducer';
import { setLoading } from './../../store/reducers/global-reducer';
import readUrl from './../../helpers/read-product-listing-url';
import { getBrands, getColors } from './../../helpers/product-listing';
import GoToTop from './../../helpers/GoToTop';

const ProductListing = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("cat");
    const searchQuery = queryParams.get("searchText");
    const reqBodyFromStore = useSelector(state => state.product.reqBody);
    const { loading } = useSelector(state => state.global);
    const { totalProducts } = useSelector(state => state.product);
    const { selectedWishItems } = useSelector(state => state.wishlist);
    const [reqBody, setReqBodyState] = useState(JSON.parse(JSON.stringify(reqBodyFromStore)));
    const [products, setProductsState] = useState([]);
    const [priceRange, setPriceRange] = useState();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [categories, setCategories] = useState('')

    useEffect(() => {
        if (!category) {
            setSelectedCategories([]);
        } else {
            handleCategoryChange([`${category}`]);
        }
    }, [category]);

    useEffect(() => {
        axios
            .get("front/allProductCategory")
            .then((response) => {
                if (response.data.status) {
                    console.log("response.data.data", response.data.data)
                    setCategories(response.data.data);
                } else {
                    console.log("Error")
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        let reqBodyUpdated = { ...reqBody };
        reqBodyUpdated = readUrl(dispatch, reqBodyUpdated, window.location, setReqBody, 'product-listing');
        setReqBodyState(reqBodyUpdated);
        getProducts('didMount');
    }, []);

    useEffect(() => {
        getProducts()
    }, [priceRange, selectedCategories, selectedBrands, selectedSubCategories, searchQuery])

    const handlePriceRangeChange = (range) => {
        setPriceRange(range);
    };

    const handleCategoryChange = (categories) => {
        setSelectedCategories(categories);
    };

    const handleSubCategoryChange = (categories) => {
        setSelectedSubCategories(categories);
    };

    const handleBrandChange = (brands) => {
        setSelectedBrands(brands);
    };

    const getProducts = () => {
        let productsData = [];
        let reqBodyUpdated = {
            "priceRange": priceRange,
            "selectedCategories": selectedCategories,
            "selectedSubCategories": selectedSubCategories,
            "selectedBrands": selectedBrands,
            "searchQuery": searchQuery,
        };

        axios.post('front/products/listing', reqBodyUpdated).then((response) => {
            if (response.data.status) {
                let res = response.data.data;
                res.forEach(product => {
                    productsData.push({
                        id: product.id,
                        image: product.featuredImage,
                        name: product.name,
                        isService: product.isService,
                        price: product.price,
                        avgRating: product.avgRating,
                        quantity: product.quantity,
                        cryptoPrices: product.cryptoPrices
                    });
                });
            }
            setProductsState(productsData);


            // dispatch(setReqBody({ reqBody: reqBodyUpdated }));
            // dispatch(setProducts({ products: productsData }));
            // dispatch(setTotalProducts({ totalProducts: response.data.data.totalProducts }));
            // setMaxPriceState(response.data.data.maxPrice);
            // dispatch(setMaxPrice({ maxPrice: response.data.data.maxPrice }));
            // if (param === 'didMount' || param === 'viewMore') {
            // getBrands(dispatch);
            // getColors(dispatch);
            // }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                // dispatch(setProducts({ products: [] }));
            }
        }).finally(() => {
            setTimeout(() => {
                // dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    const handleProductData = (data) => {
        console.log("data in product listing page", data)
    }

    // console.log("priceRange in product listing", priceRange)
    // console.log("selectedCategories product listing", selectedCategories)
    // console.log("selectedBrands product listing", selectedBrands)

    return (
        <React.Fragment>
            {loading === true ? <SpinnerLoader /> : ''}
            <Header
                pageName="product-listing"
                reqBody={reqBody}
                sendProductsData={handleProductData}
            />
            <PageTitle title={"Products"} />
            <section className="inr_wrap">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar pageName="product-listing"
                                categories={categories}
                                onPriceRangeChange={handlePriceRangeChange}
                                onCategoryChange={handleCategoryChange}
                                onSubCategoryChange={handleSubCategoryChange}
                                onBrandChange={handleBrandChange}

                            />
                        </div>
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col">
                                    <ListingHead title="Products" count={products.length} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    {products.length === 0 ? <NotFound msg="Product not found." /> : ''}
                                    <div className="cards_wrapper">
                                        {
                                            products.map((product, index) => (
                                                <ProductCard
                                                    data={product}
                                                    key={index}
                                                    inWishList={selectedWishItems.length !== 0 && selectedWishItems.includes(product.id)}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                                {products.length !== 0 && products.length < totalProducts && (
                                    <div className="col-md-12 more_pord_load_btn">
                                        <button type="button" onClick={() => getProducts('viewMore')} className="view_more">View More</button>
                                    </div>
                                )}
                            </div>

                            {/* <div className="row">
                                <div className="col-sm-12">
                                    {(searchingProducts.length === 0 ? products : searchingProducts).length === 0
                                        ? <NotFound msg="Product not found." />
                                        : ''}
                                    <div className="cards_wrapper">
                                        {
                                            (searchingProducts.length === 0 ? products : searchingProducts).map((product, index) => (
                                                <ProductCard
                                                    data={product}
                                                    key={index}
                                                    inWishList={selectedWishItems.length !== 0 && selectedWishItems.includes(product.id)}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                                {((searchingProducts.length === 0 ? products : searchingProducts).length !== 0) &&
                                    (searchingProducts.length === 0 ? products : searchingProducts).length < totalProducts && (
                                        <div className="col-md-12 more_pord_load_btn">
                                            <button type="button" onClick={() => getProducts('viewMore')} className="view_more">View More</button>
                                        </div>
                                    )}
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <GoToTop />
        </React.Fragment>
    );
}

export default ProductListing;
