
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
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setReqBody, setTotalProducts, setMaxPrice } from './../../store/reducers/product-reducer';
import { setLoading } from './../../store/reducers/global-reducer';
import readUrl from './../../helpers/read-product-listing-url';
import { getBrands, getColors } from './../../helpers/product-listing';
import GoToTop from './../../helpers/GoToTop';

const ProductListing = () => {
    const dispatch = useDispatch();
    
    // Use useSelector to access the Redux state instead of store.getState()
    const reqBodyFromStore = useSelector(state => state.product.reqBody);
    const { loading } = useSelector(state => state.global);
    const { totalProducts, categories } = useSelector(state => state.product);
    const { selectedWishItems } = useSelector(state => state.wishlist);
    
    const [reqBody, setReqBodyState] = useState(JSON.parse(JSON.stringify(reqBodyFromStore)));
    const [products, setProductsState] = useState([]);
    const [maxPrice, setMaxPriceState] = useState(0);

    useEffect(() => {
        let reqBodyUpdated = { ...reqBody };
        reqBodyUpdated = readUrl(dispatch, reqBodyUpdated, window.location, setReqBody, 'product-listing');
        setReqBodyState(reqBodyUpdated);
        getProducts('didMount');
    }, []);

    const getProducts = (param) => {
        let reqBodyUpdated = JSON.parse(JSON.stringify(reqBodyFromStore));
        let productsData = [];

        if (param === 'didMount') {
            reqBodyUpdated = reqBody;
        } else if (param === 'viewMore') {
            reqBodyUpdated.count.limit = reqBodyUpdated.count.limit + 9;
        }

        dispatch(setLoading({ loading: true }));

        axios.post('front/product/listing', reqBodyUpdated).then((response) => {
            if (response.data.status) {
                let res = response.data.data.products;
                res.forEach(product => {
                    productsData.push({
                        id: product.id,
                        image: config.apiURI + product.featuredImage,
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
            dispatch(setReqBody({ reqBody: reqBodyUpdated }));
            dispatch(setProducts({ products: productsData }));
            dispatch(setTotalProducts({ totalProducts: response.data.data.totalProducts }));
            setMaxPriceState(response.data.data.maxPrice);
            dispatch(setMaxPrice({ maxPrice: response.data.data.maxPrice }));

            if (param === 'didMount' || param === 'viewMore') {
                getBrands(dispatch);
                getColors(dispatch);
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                dispatch(setProducts({ products: [] }));
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    return (
        <React.Fragment>
            {loading ? <SpinnerLoader /> : ''}
            <Header pageName="product-listing" reqBody={reqBody} />
            <PageTitle title={useSelector(state => state.catSearch.selectedCategory.label)} />

            <section className="inr_wrap">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <Sidebar pageName="product-listing" categories={categories} maxPrice={maxPrice} />
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






// import React, { Component } from 'react';
// import Header from './../../components/user/common/Header';
// import PageTitle from './../../components/user/common/PageTitle';
// import Sidebar from './../../components/user/common/Sidebar';
// import Footer from './../../components/common/Footer';
// import ListingHead from './../../components/user/common/ListingHead';
// import ProductCard from './../../components/common/ProductCard';
// import { NotFound } from './../../components/common/NotFound';
// import SpinnerLoader from './../../components/common/SpinnerLoader';
// import config from './../../config.json';
// import axios from 'axios';
// import store from '../../store/index';
// import { setProducts, setReqBody, setTotalProducts, setMaxPrice } from './../../store/reducers/product-reducer';
// import { setLoading } from './../../store/reducers/global-reducer';
// import { connect } from 'react-redux';
// import readUrl from './../../helpers/read-product-listing-url';
// import { getBrands, getColors } from './../../helpers/product-listing';
// import GoToTop from './../../helpers/GoToTop';

// class ProductListing extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             reqBody: JSON.parse(JSON.stringify({ ...store.getState().product.reqBody })),
//             products: [],
//             loading: false,
//             maxPrice: 0,
//         }
//     }

//     componentDidMount() {
//         const { dispatch } = this.props;
//         let reqBody = { ...this.state.reqBody };
//         // let catId = /cat=([^&]+)/.exec(location.search) !== null ? /cat=([^&]+)/.exec(location.search)[1] : '';
//         // let subCatId = /subcat=([^&]+)/.exec(location.search) !== null ? /subcat=([^&]+)/.exec(location.search)[1] : '';

//         reqBody = readUrl(dispatch, reqBody, window.location, setReqBody, 'product-listing');

//         this.setState(
//             { reqBody },
//             () => this.getProducts('didMount')
//         );
//     }

//     getProducts = param => {
//         const { dispatch } = this.props;
//         let reqBody = JSON.parse(JSON.stringify({ ...store.getState().product.reqBody }));
//         let productsData = [];

//         if (param === 'didMount') {
//             reqBody = this.state.reqBody;
//         } else if (param === 'viewMore') {
//             reqBody.count.limit = reqBody.count.limit + 9;
//         }

//         dispatch(setLoading({ loading: true }));
//         axios.post('front/product/listing', reqBody).then((response) => {
//             if (response.data.status) {
//                 let res = response.data.data.products;
//                 res.forEach(product => {
//                     productsData.push({
//                         id: product.id,
//                         image: config.apiURI + product.featuredImage,
//                         name: product.name,
//                         isService: product.isService,
//                         price: product.price,
//                         avgRating: product.avgRating,
//                         quantity: product.quantity,
//                         cryptoPrices: product.cryptoPrices
//                     });
//                 });
//             }
//             console.log("productsData", productsData)
//             this.setState({ products: productsData });
//             dispatch(setReqBody({ reqBody }));
//             dispatch(setProducts({ products: productsData }));
//             dispatch(setTotalProducts({ totalProducts: response.data.data.totalProducts }));
//             this.setState({ maxPrice: response.data.data.maxPrice });
//             dispatch(setMaxPrice({ maxPrice: response.data.data.maxPrice }));

//             if (param === 'didMount' || param === 'viewMore') {
//                 getBrands(dispatch);
//                 getColors(dispatch);
//             }
//         }).catch(error => {
//             if (error.response && error.response.data.status === false) {
//                 dispatch(setProducts({ products: productsData }));
//             }
//         }).finally(() => {
//             setTimeout(() => {
//                 dispatch(setLoading({ loading: false }));
//             }, 300);
//         });
//     }

//     render() {
//         const { loading } = store.getState().global;
//         const { products, totalProducts, categories } = store.getState().product;
//         const { selectedWishItems } = store.getState().wishlist;

//         return (
//             <React.Fragment>
//                 {loading === true ? <SpinnerLoader /> : ''}
//                 <Header pageName="product-listing" reqBody={this.state.reqBody} />
//                 <PageTitle title={store.getState().catSearch.selectedCategory.label} />

//                 <section className="inr_wrap">
//                     <div className="container">
//                         <div className="row">
//                             <div className="col-md-3">
//                                 <Sidebar pageName="product-listing" categories={categories} maxPrice={this.state.maxPrice} />
//                             </div>
//                             <div className="col-md-9">
//                                 <div className="row">
//                                     <div className="col">
//                                         <ListingHead title="Products" count={products.length} />
//                                     </div>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-sm-12">
//                                         {products.length === 0 ? <NotFound msg="Product not found." /> : ''}
//                                         <div className="cards_wrapper">
//                                             {
//                                                 products.map((product, index) => {
//                                                     return <ProductCard
//                                                         data={product}
//                                                         key={index}
//                                                         inWishList={selectedWishItems.length !== 0 && selectedWishItems.includes(product.id) ? true : false}
//                                                     />
//                                                 })
//                                             }
//                                         </div>
//                                     </div>
//                                     {
//                                         products.length !== 0 && products.length < totalProducts ?
//                                             <div className="col-md-12 more_pord_load_btn">
//                                                 <button type="button" onClick={() => this.getProducts('viewMore')} className="view_more">View More</button>
//                                             </div> : ''
//                                     }
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//                 <Footer />
//                 <GoToTop />
//             </React.Fragment>
//         );
//     }
// }

// export default connect(setProducts)(ProductListing);
