import React, { Component } from 'react';
import Header from '../../components/user/common/Header';
import PageTitle from '../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import axios from 'axios';
import store from '../../store/index';
import NotFound from './../../components/common/NotFound';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import Rating from '../../components/common/Rating';
import config from './../../config.json';
import { confirmation } from './../../helpers/confirmation';
import { setSelectedWishItems } from './../../store/reducers/wishlist-reducer';


class MyWishlist extends Component {
    constructor(props) {
        super(props);
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {
            data: [],
            reqBody: {
                count: {
                    start: 0,
                    limit: 5
                }
            },
            totalWishlistCount: 0
        };

        toast.configure();
    }

    componentDidMount() {
        this.getWishlistData('didMount');
    }

    getWishlistData(param) {
        const { dispatch } = this.props;
        let reqBody;

        if (param === 'viewMore') {
            reqBody = {
                count: {
                    start: 0,
                    limit: this.state.reqBody.count.limit + 5
                }
            };
        } else {
            reqBody = this.state.reqBody;
        }

        dispatch(setLoading({loading: true}));
        axios.post('user/wishlist/' + this.authInfo.id, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                this.setState({
                    data: response.data.data.wishlist,
                    totalWishlistCount: response.data.data.totalWishlists,
                    reqBody
                });
            }
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    deleteItem(productId) {
        const { dispatch } = this.props;
        let reqBody = {
            user_id: this.authInfo.id,
            product_id: productId
        };

        dispatch(setLoading({loading: true}));
        axios.post('user/remove-from-wishlist/', reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                let filteredArray = this.state.data.filter(item => item.productId.id !== productId);
                let totalWishlistCount = this.state.totalWishlistCount - 1;
                let selectedWishItems = JSON.parse(localStorage.getItem('selectedWishItems'));
                let filteredItems = selectedWishItems.filter(item => item !== productId);

                this.setState({data: filteredArray, totalWishlistCount});
                localStorage.setItem('selectedWishItems', JSON.stringify(filteredItems));
                dispatch(setSelectedWishItems({selectedWishItems: filteredItems}));
                toast.success(response.data.message);
            }
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    render() {
        const { loading } = store.getState().global;
        const { totalWishlistCount, data } = this.state;

        return (
            <React.Fragment>
                { loading === true ? <SpinnerLoader /> : '' }
                <Header />
                <PageTitle title="My Wishlist" />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart wishlist">
                                    <div className="cart_wrap">
                                        <div className="items_incart">
                                            <span>{totalWishlistCount} Items in your Wishlist</span>
                                        </div>
                                    </div>
                                    <div className="cl_head">
                                        <div className="cart_wrap">
                                            <div>Product</div>
                                            <div className="invisible">Actions</div>
                                        </div>
                                    </div>
                                    <div className="cart_list cart_wrap">
                                        {data.length > 0 ?
                                            data.map((value, index) => {
                                                let cls;
                                                if (value.productId.isActive && value.productId.quantity.stock_qty === 0) {
                                                    cls = 'sold';
                                                } else if(value.productId.isActive === false) {
                                                    cls = 'not_available';
                                                }
                                                return <div className={`cl_items ${cls}`} key={index}>
                                                        <div className="cl_pro_info">
                                                            <div className="clp_item">
                                                                <div className="clp_item_img"><img src={config.apiURI + value.productId.featuredImage} alt="mens-jacket" /></div>
                                                                <div className="clp_item_info">
                                                                    <Rating avgRating={value.productId.avgRating} />
                                                                    <div className="cl_pro_name">{value.productId.name}</div>
                                                                    <div className="cl_pro_price">
                                                                        <span className="cl_op">{`${value.productId.isActive !== false ? '$'+value.productId.price : ''}`}</span>
                                                                        {value.productId.isActive !== false && value.productId.cryptoPrices && value.productId.cryptoPrices.length > 0 ?
                                                                            value.productId.cryptoPrices.map((val, index) => {
                                                                                let crypPrice =  value.productId.price / val.cryptoPriceUSD;
                                                                                crypPrice = crypPrice.toFixed(5);
                                                                                return <span key={index} > | {crypPrice} {val.code}</span>
                                                                            })
                                                                        : ""}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="cl_pro_btn">
                                                            <Link title="Remove from list" to="#" onClick={() => confirmation('Confirmation', 'Are you sure you want delete this item from wishlist?', () => this.deleteItem(value.productId.id))}>
                                                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M18.2188 2.75H14.4375V2.0625C14.4375 0.925246 13.5123 0 12.375 0H9.625C8.48775 0 7.5625 0.925246 7.5625 2.0625V2.75H3.78125C2.83353 2.75 2.0625 3.52103 2.0625 4.46875V6.875C2.0625 7.25467 2.37033 7.5625 2.75 7.5625H3.12572L3.71968 20.0356C3.77214 21.1371 4.67706 22 5.77981 22H16.2202C17.323 22 18.2279 21.1371 18.2803 20.0356L18.8743 7.5625H19.25C19.6297 7.5625 19.9375 7.25467 19.9375 6.875V4.46875C19.9375 3.52103 19.1665 2.75 18.2188 2.75ZM8.9375 2.0625C8.9375 1.68343 9.24593 1.375 9.625 1.375H12.375C12.7541 1.375 13.0625 1.68343 13.0625 2.0625V2.75H8.9375V2.0625ZM3.4375 4.46875C3.4375 4.27921 3.59171 4.125 3.78125 4.125H18.2188C18.4083 4.125 18.5625 4.27921 18.5625 4.46875V6.1875C18.3506 6.1875 4.31548 6.1875 3.4375 6.1875V4.46875ZM16.9069 19.9702C16.8894 20.3374 16.5877 20.625 16.2202 20.625H5.77981C5.41221 20.625 5.11057 20.3374 5.09313 19.9702L4.50227 7.5625H17.4977L16.9069 19.9702Z" fill="#FF0E0E"/>
                                                                    <path d="M11 19.25C11.3797 19.25 11.6875 18.9422 11.6875 18.5625V9.625C11.6875 9.24533 11.3797 8.9375 11 8.9375C10.6203 8.9375 10.3125 9.24533 10.3125 9.625V18.5625C10.3125 18.9422 10.6203 19.25 11 19.25Z" fill="#FF0E0E"/>
                                                                    <path d="M14.4375 19.25C14.8172 19.25 15.125 18.9422 15.125 18.5625V9.625C15.125 9.24533 14.8172 8.9375 14.4375 8.9375C14.0578 8.9375 13.75 9.24533 13.75 9.625V18.5625C13.75 18.9422 14.0578 19.25 14.4375 19.25Z" fill="#FF0E0E"/>
                                                                    <path d="M7.5625 19.25C7.94217 19.25 8.25 18.9422 8.25 18.5625V9.625C8.25 9.24533 7.94217 8.9375 7.5625 8.9375C7.18283 8.9375 6.875 9.24533 6.875 9.625V18.5625C6.875 18.9422 7.18279 19.25 7.5625 19.25Z" fill="#FF0E0E"/>
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    </div>
                                            })
                                        : ''}

                                        <div className="pt-4 pb-4">
                                            {data.length > 0 && data.length < totalWishlistCount ?
                                                <div className="col-md-12 more_pord_load_btn">
                                                    <Link to="#" onClick={() => this.getWishlistData('viewMore')} className="view_more">View More</Link>
                                                </div>
                                            : '' }

                                            {data.length === 0 ? <NotFound msg="No Items found in wishlist." /> : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </React.Fragment>
        );
    }
}

export default connect(setLoading) (MyWishlist);