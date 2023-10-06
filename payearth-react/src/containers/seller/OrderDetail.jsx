import React, { Component } from 'react'
import Footer from '../../components/common/Footer';
import Header from '../../components/seller/common/Header';
import axios from 'axios';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import config from '../../config.json';
import store from '../../store/index';
import SpinnerLoader from '../../components/common/SpinnerLoader';

class OrderDetails extends Component {
    constructor(props){
        super(props)
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {
            OrderData:{}
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        let orderId = window.location.pathname.split('/')[3];

        dispatch(setLoading({loading: true}));
        axios.get(`seller/orders/${orderId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                this.setState({OrderData: response.data.data});
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    render() {
        const {loading} = store.getState().global;
        const {OrderData} = this.state;

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap row">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center mb-4">
                                        <div className="dash_title">{Object.keys(OrderData).length && OrderData.order.productId.name}</div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="pro_summary admin_pd_list">
                                            <div className="pro_summ_row">
                                                <div className="psr_label">{Object.keys(OrderData).length && OrderData.order.productId.isService ? 'Service ID': 'Product ID'}</div>
                                                <div className="psr_item">{Object.keys(OrderData).length && OrderData.order.productId.id}</div>
                                            </div>
                                            <div className="pro_summ_row">
                                                <div className="psr_label">{Object.keys(OrderData).length && OrderData.order.productId.isService ? 'Service Name' : 'Product Name'}</div>
                                                <div className="psr_item">{Object.keys(OrderData).length && OrderData.order.productId.name}</div>
                                            </div>
                                            {Object.keys(OrderData).length && OrderData.order.productId.isService ? '' :
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Product Color</div>
                                                    <div className="psr_item">{Object.keys(OrderData).length && OrderData.order.product_sku.color}</div>
                                                </div>
                                            }
                                            {Object.keys(OrderData).length && OrderData.order.productId.isService ? '' :
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Product Size</div>
                                                    <div className="psr_item">{Object.keys(OrderData).length && OrderData.order.product_sku.size}</div>
                                                </div>
                                            }
                                            <div className="pro_summ_row">
                                                <div className="psr_label">Status</div>
                                                <div className="psr_item">{Object.keys(OrderData).length && OrderData.order.orderStatus.orderStatusId.title}</div>
                                            </div>
                                            <div className="pro_summ_row">
                                                <div className="psr_label">Customer's Name</div>
                                                <div className="psr_item">{Object.keys(OrderData).length && OrderData.order.userId.name}</div>
                                            </div>
                                            <div className="pro_summ_row">
                                                <div className="psr_label">Mode of Payment</div>
                                                <div className="psr_item">{Object.keys(OrderData).length && (OrderData.payment.paymentMode).toUpperCase()}</div>
                                            </div>
                                            <div className="pro_summ_row">
                                                <div className="psr_label">Amount paid by customer</div>
                                                <div className="psr_item">${Object.keys(OrderData).length && OrderData.payment.amountPaid}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="admin_pro_detail_img mb-4">
                                            <img className="img-fluid w-100" src={Object.keys(OrderData).length && config.apiURI + OrderData.order.productId.featuredImage} alt="..." />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(OrderDetails);