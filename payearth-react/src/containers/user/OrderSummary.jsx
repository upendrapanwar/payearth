import React, { Component, useRef } from "react";
import Header from "../../components/user/common/Header";
import PageTitle from "../../components/user/common/PageTitle";
import Footer from "../../components/common/Footer";
import axios from "axios";
import { toast } from 'react-toastify';
import store from '../../store/index';
import { withRouter } from "react-router";

class OrderSummary extends Component {
    
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            formStatus: false,
            apiData: [],
            data: [],
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 2,
                    data: ''
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                }
            },
            user_id: '',
            paymentType: '',
        };
    }
    
    /**
     * Initialize instance and function on did mount
     */
    componentDidMount() {
        this.getOrderDetails();
        this.removeCartData();
    }
    /**************************************************************************/
    /**************************************************************************/
    removeCartData = () => {
        const cart = this.props.cart;
        if(typeof cart != 'undefined') {
            
            cart.forEach(items => {
                let reqBody = {
                    user_id: this.authInfo.id,
                    product_id: items.id
                };
                //totalQuantity += items.quantity
                axios.post('user/remove-from-wishlist/', reqBody, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${this.authInfo.token}`,
                    }
                }).then((response) => {
                    //console.log(response);
                    return true; 
                }).catch(error => {
                    return false;
                });
                
            })
        }
        
    }
    getOrderDetails = () => {
        const orderid = this.props.match.params.id;
        //console.log(this.props.match.params.id)
        if(orderid) {
            axios.get('user/orderbyid/'+orderid, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`,
                }
            }).then((response) => {
                //console.log(response);
                if(response.status) {
                    this.setState({ data: response.data })
                    //console.log(response.data)
                } else {
                    this.setState({data: []})
                    toast.error('Error while loading data.Please try again.')
                } 
            }).catch(error => {
                console.log(error)
            });
        }
    }
    showOrderDetails = () => {
        if(typeof this.state.data.data != 'undefined') {
            return (
                <div>
                    <p>{<label><strong>OrderId:</strong> {typeof this.state.data.data._id != 'undefined' ? this.state.data.data._id : null}</label>}</p>
                    <p>{<label><strong>Order Code:</strong> {typeof this.state.data.data.orderCode != 'undefined' ? this.state.data.data.orderCode : null}</label>}</p>
                    <p>{<label><strong>Order Status:</strong> {typeof this.state.data.data.orderStatus != 'undefined' ? this.state.data.data.orderStatus : null}</label>}</p>
                    <p>{<label><strong>Tax Amount:</strong> {typeof this.state.data.data.taxAmount != 'undefined' ? this.state.data.data.taxAmount : null}</label>}</p>
                    <p>{<label><strong>Delivery Charge:</strong> {typeof this.state.data.data.deliveryCharge != 'undefined' ? this.state.data.data.deliveryCharge : null}</label>}</p>
                    <p>{<label><strong>Discount:</strong> {typeof this.state.data.data.discount != 'undefined' ? this.state.data.data.discount : null}</label>}</p>
                    <p>{<label><strong>Tax Percent:</strong> {typeof this.state.data.data.taxPercent != 'undefined' ? this.state.data.data.taxPercent : null}</label>}</p>
                    <p>{<label><strong>Total:</strong> {typeof this.state.data.data.total != 'undefined' ? this.state.data.data.total : null}</label>}</p>
                    <p>{<label><strong>Billing City:</strong> {typeof this.state.data.data.billingCity != 'undefined' ? this.state.data.data.billingCity : null}</label>}</p>
                    <p>{<label><strong>Billing Company Name:</strong> {typeof this.state.data.data.billingCompanyName != 'undefined' ? this.state.data.data.billingCompanyName : null}</label>}</p>
                    <p>{<label><strong>Billing Country:</strong> {typeof this.state.data.data.billingCountry != 'undefined' ? this.state.data.data.billingCountry : null}</label>}</p>
                    <p>{<label><strong>Billing County:</strong> {typeof this.state.data.data.billingCounty != 'undefined' ? this.state.data.data.billingCounty : null}</label>}</p>
                    <p>{<label><strong>Billing Email:</strong> {typeof this.state.data.data.billingEmail != 'undefined' ? this.state.data.data.billingEmail : null}</label>}</p>
                    <p>{<label><strong>Billing First Name:</strong> {typeof this.state.data.data.billingFirstName != 'undefined' ? this.state.data.data.billingFirstName : null}</label>}</p>
                    <p>{<label><strong>Billing Last Name:</strong> {typeof this.state.data.data.billingLastName != 'undefined' ? this.state.data.data.billingLastName : null}</label>}</p>
                    <p>{<label><strong>Billing Note:</strong> {typeof this.state.data.data.billingNote != 'undefined' ? this.state.data.data.billingNote : null}</label>}</p>
                    <p>{<label><strong>Billing Phone:</strong> {typeof this.state.data.data.billingPhone != 'undefined' ? this.state.data.data.billingPhone : null}</label>}</p>
                    <p>{<label><strong>Billing PostCode:</strong> {typeof this.state.data.data.billingPostCode!= 'undefined' ? this.state.data.data.billingPostCode : null}</label>}</p>
                    <p>{<label><strong>Billing Street Address:</strong> {typeof this.state.data.data.billingStreetAddress != 'undefined' ? this.state.data.data.billingStreetAddress : null}</label>}</p>
                    <p>{<label><strong>Billing Street Address1:</strong> {typeof this.state.data.data.billingStreetAddress1 != 'undefined' ? this.state.data.data.billingStreetAddress1 : null}</label>}</p>
                 </div>
                 
            ) 
        }

    }
    render() {
        const cart = this.props.cart
        
        return (
            <React.Fragment>
                <Header />
                <PageTitle title="Order Summary" />
                <section className="inr_wrap checkout_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart my_cart">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div style={{ "padding": "0px 0px 0px 25px" }} className="checkout_form_section">
                                                <div className="items_incart">
                                                    <h4>Order Summay</h4>
                                                </div>
                                                <div className="checkout-form">
                                                    {this.showOrderDetails()}
                                                </div>
                                                <div><a href="/">Back to Home</a></div>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <Footer />
            </React.Fragment>
        )
    }
}
const OrderSummaryRouter = withRouter(OrderSummary);
export default OrderSummary;