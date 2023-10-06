import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import Footer from '../../components/common/Footer';

class ManagePaymentDetails extends Component {
    constructor(props){
        super(props);
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state={
            data:[],
        }
    }
    getProducts=(paymentId)=>{
        let reqBody = {
            count: {
                page: 1,
                skip: 0,
                limit: 2
            },
            sorting: {
                sort_type: "date",
                sort_val: "desc"
            }
        };
        let url = '/admin/payments/'+paymentId;
        this.dispatch(setLoading({ loading: true }));
        axios.get(url,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                // this.setState({

                //     data: response.data.data.coupons,
                //     pagination: response.data.data.paginationData
                // });
                this.setState({ 'data': response })
                
                //console.log(response);
            }
           
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }
    componentDidMount() {
        let paymentId = window.location.pathname.split('/')[3];
        console.log('paymentId='+paymentId)
        this.getProducts(paymentId);
    }
    showPaymentData = (paymentData) => {
        console.log(paymentData);
        if(paymentData.status) {
            console.log(paymentData.data.data.payment);
        return(
            
            <div className="col-md-12">
                                            <div className="pro_summary">
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Payment Id</div>
                                                    <div className="psr_item">{paymentData.data.data.payment.id}</div>
                                                </div>
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Invoice No.</div>
                                                    <div className="psr_item">{paymentData.data.data.payment.invoiceNo}</div>
                                                </div>
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Payment Account</div>
                                                    <div className="psr_item">{paymentData.data.data.payment.paymentAccount}</div>
                                                </div>
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Payment Mode</div>
                                                    <div className="psr_item">{paymentData.data.data.payment.paymentMode} </div>
                                                </div>
                                                {/*<div className="pro_summ_row">
                                                    <div className="psr_label">Date of addition</div>
                                                    <div className="psr_item">21-Aug-2022</div>
                                                </div>
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Category</div>
                                                    <div className="psr_item">Books and CDs</div>
                                                </div>
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Sub category</div>
                                                    <div className="psr_item">Books</div>
                                                </div>
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Descriptions</div>
                                                    <div className="psr_item">
                                                        <p>Test Description</p>
                                                    </div>
                                                </div>
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Specifications</div>
                                                    <div className="psr_item">
                                                        <p>Test</p>
                                                    </div>
                                                </div>
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Color &amp; Image</div>
                                                    <div className="psr_item">
                                                        <div className="psr_color_images">
                                                            <ul className="colors_pick ps-0 bg-white"></ul>
                                                            <ul className="pro_img_listing detail ms-0 w-100 mt-2"></ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Price</div>
                                                    <div className="psr_item">$100</div>
                                                </div>*/}
                                            </div>
                                        </div>
           
            
        )
    }
    }
    render() {
        const paymentData = this.state.data;
        return (
            <React.Fragment>
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                            <div className="container ">
                                <div className="bg-white rounded-3 pt-3 pb-5">
                                    <div className="dash_inner_wrap row">
                                        <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center border-bottom">
                                            <div className="dash_title">Payment Details</div></div>
                                            {this.showPaymentData(paymentData)}
                                    </div>
                                </div>
                            </div>
                        </div>
                <Footer/>
            </React.Fragment >

        );
    }
}

export default connect(setLoading)(ManagePaymentDetails);
