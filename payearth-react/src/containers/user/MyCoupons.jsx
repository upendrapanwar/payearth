import React, { Component } from 'react';
import Header from '../../components/user/common/Header';
import PageTitle from '../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import voucherIcon from './../../assets/icons/voucher_icon.svg';
import axios from 'axios';
import { setLoading } from './../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import store from '../../store/index';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { NotFound } from './../../components/common/NotFound';

class MyCoupons extends Component {
    constructor(props) {
        console.log("Checking props data", props);
        super(props);
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {
            data: [],
            reqBody: {
                count: {
                    start: 0,
                    limit: 6
                }
            }
        };
    }

    componentDidMount(props) {
        this.getCoupons('didMount');
        console.log("Checking props data12233", props);
    }

    getCoupons(param) {
        const { dispatch } = this.props;
        let reqBody;

        if (param === 'viewMore') {
            reqBody = {
                count: {
                    start: 0,
                    limit: this.state.reqBody.count.limit + 6
                }
            };
            console.log('Checking params reqbody data', reqBody);

        } else {
            reqBody = this.state.reqBody;
            console.log('Checking reqbody data', reqBody);
        }

        dispatch(setLoading({ loading: true }));
        axios.post('user//coupons/new', reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                console.log('response.data.data',response.data.data)
                this.setState({ data: response.data.data, reqBody });
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    render() {
        const { loading } = store.getState().global;
        const { availableCoupons, coupons, totalCoupons } = this.state.data;

        console.log("this.state.data :::", this.state.data)

        return (
            <React.Fragment>
                <Helmet><title>{"My Coupons - Pay Earth"}</title></Helmet>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <PageTitle title="My Coupons" />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart wishlist">
                                    <div className="cart_wrap">
                                        <div className="items_incart">
                                        <span>{Array.isArray(coupons) ? coupons.length : 0} Coupon available</span>
                                        </div>

                                        <div className="row coupons_wrap pb-5">
                                            {coupons !== undefined ? coupons.map((value, index) => {
                                                // if (value.isActive && value.couponId !== null) {
                                                    // let date = new Date(value.couponId?.end)
                                                    return <div className="col-md-4" key={index}>
                                                        <div className="voucher">
                                                            <div className="vhr_offer">
                                                                <div className="vhr_img"><img src={voucherIcon} alt="voucher_icon" /></div>
                                                                <div className="vhr_off">{value.discount_per}%</div>
                                                            </div>
                                                            <div className="vhr_coupon">
                                                                <div className="vhr_code">{value.code}</div>
                                                                <div className="vhr_date">Expiry on {new Date(value.end).toLocaleDateString()}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                // } else {
                                                //     if (value.isActive === false && value.couponId !== null) {
                                                //         return <div className="col-md-4" key={index}>
                                                //             <div className="voucher expired">
                                                //                 <div className="vhr_offer">
                                                //                     <div className="vhr_img"><img src={voucherIcon} alt="voucher_icon" /></div>
                                                //                     <div className="vhr_off">{value.couponId.discount_per}%</div>
                                                //                 </div>
                                                //                 <div className="vhr_coupon">
                                                //                     <div className="vhr_code">{value.couponId.code}</div>
                                                //                     <div className="vhr_date">Expired</div>
                                                //                 </div>
                                                //             </div>
                                                //         </div>
                                                //     } else {
                                                //         return '';
                                                //     }
                                                // }
                                            }) : ''}

                                            {coupons !== undefined && coupons.length !== 0 && coupons.length < totalCoupons ?
                                                <div className="col-md-12 more_pord_load_btn">
                                                    <Link to="#" onClick={() => this.getCoupons('viewMore')} className="view_more">View More</Link>
                                                </div>
                                                : ''}

                                            {coupons !== undefined && coupons.length === 0 ? <NotFound msg="Coupon not found." /> : ''}
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

export default connect(setLoading)(MyCoupons);