import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import Footer from '../../components/common/Footer';
import NotFound from '../../components/common/NotFound';

class ManageOrderDetails extends Component {
    constructor(props){
        super(props);
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state={
            data:[],
            orderTimeline: [],
            payment:[]
        }
    }
    getOrderdetails=(orderid)=>{
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
        let url = 'admin/orders/'+orderid;
        this.dispatch(setLoading({ loading: true }));
        axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                 this.setState({
                     data: response.data.data.order,
                     orderTimeline: response.data.data.orderTimeline,
                     payment: response.data.data.payment
                    // pagination: response.data.data.paginationData
                 });
                console.log(response.data.data);
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
        
        let orderId = window.location.pathname.split('/')[3];
        //console.log('orderId='+orderId)
        this.getOrderdetails(orderId);
    }

    render() {
        const orderData = this.state.data;
        const orderTimeline = this.state.orderTimeline;
        const payment = this.state.payment;
        const { loading } = store.getState().global
        console.log(orderData);
        var temp = '';
        //orderData.map
        return (
            <React.Fragment>
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                            <div className="container ">
                                <div className="bg-white rounded-3 pt-3 pb-5">
                                    <div className="dash_inner_wrap row">
                                        <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center border-bottom">
                                            <div className="dash_title">Order Details</div></div>
                                        <div className="col-md-12">
                                            {Object.keys(orderData).map((key, index) => {
                                                
                                                return (
                                                    <>  
                                                    {(() => {
                                                        if(temp != orderData.id) {
                                                            temp = orderData.id;
                                                            const arr = [];
                                                            console.log(orderData);
                                                            console.log(orderData.productId);
                                                            var totalPrice = 0;
                                                            for(var i=0;i<orderData.productId.length;i++) {
                                                                totalPrice = totalPrice + orderData.productId[i].price;
                                                                arr.push( 
                                                                    <div className="pro_summary">
                                                                        <div className="pro_summ_row">
                                                                            <div className="psr_label">Order Code</div>
                                                                            <div className="psr_item">{orderData.orderCode

        }</div>
                                                                        </div>
                                                                        <div className="pro_summ_row">
                                                                            <div className="psr_label">Product Name</div>
                                                                            <div className="psr_item">{orderData.productId[i].name
        }</div>
                                                                        </div>
                                                                        <div className="pro_summ_row">
                                                                            <div className="psr_label">Total sales of product</div>
                                                                            <div className="psr_item">{orderData.product_sku[0].quantity
        }</div>
                                                                        </div>
                                                                        <div className="pro_summ_row">
                                                                            <div className="psr_label">Vendor</div>
                                                                            <div className="psr_item">{orderData.sellerId[0].name}</div>
                                                                        </div>
                                                                        <div className="pro_summ_row">
                                                                            <div className="psr_label">User Name</div>
                                                                            <div className="psr_item">{orderData.userId.name
        }</div>
                                                                        </div>
                                                                        <div className="pro_summ_row">
                                                                            <div className="psr_label">Order Date</div>
                                                                            <div className="psr_item">{orderData.createdAt}</div>
                                                                        </div>
                                                                        <div className="pro_summ_row">
                                                                            <div className="psr_label">Status</div>
                                                                            <div className="psr_item">{orderData.orderStatus.orderStatusId.title
        }</div>
                                                                        </div>
                                                                        
                                                                        <div className="pro_summ_row">
                                                                            <div className="psr_label">Price</div>
                                                                            <div className="psr_item">${orderData.productId[i].price}</div>
                                                                        </div>
                                                                        <div className="pro_summ_row">
                                                                            <div className="psr_label">Total</div>
                                                                            <div className="psr_item">${totalPrice}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return arr;
                                                        }
                                                        
                                                    })()}
                                            </>
                                            )
                                            })
                                            
                                            }
                                            
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                <Footer/>
            </React.Fragment >

        );
    }
}

export default connect(setLoading)(ManageOrderDetails);
