import React, { Component, useRef } from "react";
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Box, Text } from "rebass";
import styled from "styled-components";
import { toast } from 'react-toastify';
import store from '../../store/index';
import successImg from "../../assets/images/success_png.png"
import { useHistory } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Modal from "react-bootstrap/Modal";


class ServiceCheckout extends Component {
    constructor(props) {
        super(props);

        this.buttonRef = React.createRef;
        // this.clientKey = "3q47VR4QY739gdggD4dP2JJsUNyd54bJJdDDpAdmktL59dA96SZMARZHtG2tDz6V";
        // this.apiLoginId = "7e44GKHmR3b";
        this.authInfo = store.getState().auth.authInfo;
        this.userInfo = store.getState().auth.userInfo;
        let serviceName = localStorage.getItem('serviceName');
        let serviceCategory = localStorage.getItem('serviceCategory');
        console.log('serviceCategory---', serviceCategory)
        this.state = {
            formStatus: false,
            chargeData: '',
            checkoutData: '',
            apiData: [],
            statusData: [],
            orderStatus: [],
            paymentId: '',
            productSku: [],
            //status: "paid" | "unpaid" | ["failure", []],
            status: "unpaid",
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
            autherStatus: '',
            user_id: '',
            paymentType: '',
            moneyComparision: false,
            serviceName: serviceName,
            serviceCategory: serviceCategory,
            isLoading: false,

            // stripe
            authName: this.userInfo.name,
            email: this.userInfo.email,
            paymentMethodId: null,
            selectCard: "",
            plan_Id: "price_1OhntbD2za5c5GtOpiypaDOt", // Default service plan it may be change when real time data will update.. 

            id: '',
            nickname: '',
            amount: '',
            interval: '',
            interval_count: '',
            active: '',
            metadata: {},



            error: null,
            planPrice: "200",
            stripeResponse: "",
            sub_id: "",
            allOrderStatus: "",
            show: false,
            showModal: false,
        };
    }


    // Stripe function
    componentWillMount() {
        var storedDataset = sessionStorage.getItem('selectPlan');
        if (storedDataset) {
            var retrievedDataset = JSON.parse(storedDataset);
            this.setState({ plan_Id: retrievedDataset.id })
            this.setState({ selectCard: retrievedDataset })
        } else {
            this.setState({ selectCard: null })
        }

        var serviceData = localStorage.getItem('serviceData');
        if (serviceData) {
            var retriveServiceData = JSON.parse(serviceData);
            this.setState({ serviceName: retriveServiceData.name })
            this.setState({ serviceCategory: retriveServiceData.category })
            this.setState({ serviceCategoryName: retriveServiceData.categoryName })
        }
    }

    // fetchStripePlans = async () => {
    //     try {
    //         const stripeSecretKey = process.env.REACT_APP_SECRET_KEY;
    //         const response = await axios.get(`https://api.stripe.com/v1/plans`, {
    //             headers: {
    //                 Authorization: `Bearer ${stripeSecretKey}`,
    //             },
    //         });
    //         var storedDataset = sessionStorage.getItem('selectPlan');
    //         if (!storedDataset) {
    //             this.setState({ plan_Id: 'price_1OhntbD2za5c5GtOpiypaDOt' })
    //         }
    //     } catch (error) {
    //         console.error('Error fetching Stripe plans:', error);
    //     }
    // };

    handleCheckOut = () => {
        this.setState({ showModal: true });
    };

    handleSubmit = async (event, elements, stripe) => {
        this.setState({ isLoading: true });
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        const cardElement = elements.getElement(CardElement);
        const { token, error } = await stripe.createToken(cardElement);
        if (error) {
            this.setState({ isLoading: false });
            toast.error(error.message);
        } else {
            this.setState({ paymentMethodId: token.id })
        }
        this.handleSubscribeStripe();
    };

    handleSubscribeStripe = () => {
        const { email, paymentMethodId, plan_Id, authName, selectCard } = this.state;
        const url = 'seller/create-subscription';
        const subData = {
            email,
            paymentMethodId,
            plan_Id,
            authName
        };
        axios.post(url, subData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            this.setState({ stripeResponse: response.data })
            if (selectCard !== null) {
                this.savePlan(response.data.data.id);
            }
            const paymentData = [{
                'userId': null,
                'sellerId': this.authInfo.id,
                'amountPaid': response.data.data.plan.amount / 100,
                'paymentMode': response.data.data.plan.currency,
                'paymentAccount': 'Stripe',
                'invoiceUrl': response.data.data.latest_invoice.invoice_pdf,
                'paymentStatus': response.data.data.latest_invoice.status,
            }];
            var paymentIds = this.managePaymentData(paymentData);
            let paymentId;
            paymentIds.then((result) => {
                paymentId = result;
                this.setState({ "paymentId": paymentId })
                this.manageOrderStatus()
            })
        }).catch((error) => {
            console.log("error", error);
        })
    }

    savePlan = (sub_id) => {
        const { selectCard } = this.state;
        const url = '/seller/createSellerSubscriptionPlan';
        const planData = {
            id: selectCard.id,
            nickname: selectCard.nickname,
            amount: selectCard.amount / 100,
            interval: selectCard.interval,
            interval_count: selectCard.interval_count,
            active: selectCard.active,
            metadata: selectCard.metadata,
            usageCount: [{
                authorId: this.authInfo.id,
                sub_id: sub_id,
                count: 0,
                isActive: true
            }]
        }
        axios.post(url, planData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log("error", err)
        })
    }

    // stripeCanclePayment = async (currrent_Sub_Id) => {
    //     try {
    //         const sub_id = currrent_Sub_Id
    //         const response = await axios.delete(`https://api.stripe.com/v1/subscriptions/${sub_id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`, // Replace with your actual Stripe secret key
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //         });
    //         alert("Subscription successfully canceled")
    //         console.log("Subscription successfully canceled: ", response.data);
    //     } catch (error) {
    //         alert("Error canceling subscription")
    //         console.log("Error", error)
    //     }
    // }


    /**
     * Manages payment Data
     * 
     * @param {*} paymentData 
     */
    managePaymentData = async (paymentData) => {
        let res = await axios.post('/seller/savepayment', paymentData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        })
        let productid = res.data.data;
        if (typeof productid != 'undefined') {
            return productid;
        } else {
            return false;
        }
    }
    /**************************************************************************/
    /**************************************************************************/
    /**
     * Initialize instance and function on did mount
     */
    componentDidMount() {
        this.getOrderStaus();
        //this.getOrderTrackingTime();
        // this.getProductSku();
        // this.fetchStripePlans();
    }
    /**************************************************************************/
    /**************************************************************************/
    /**
     * Get the sellet id by product id
     *  
     * @param {*} productId
     * @returns sellerid|null 
     */
    getSellerId = async (productId) => {

        console.log("productId : ", productId)
        let reqBody = this.state.reqBody
        //console.log(this.authInfo)
        let res = await axios.get('user/sellerid/' + productId, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        });

        let sellerid = res.data.data;
        console.log(res.data.data);
        if (sellerid) {
            console.log('sellerid=' + sellerid)
            return sellerid;
        }

        return false;
    }
    /******************************************************************************/
    /******************************************************************************/
    /**
     * Get order status data update main data in this component..
     */
    getOrderStaus = () => {
        let reqBody = this.state.reqBody

        axios.get('/seller/orderstatus', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        }).then((response) => {
            if (typeof response.data.data != 'undefined') {
                const orderStatus = response.data.data;
                this.setState({ orderStatus: orderStatus });
                // console.log("get order status", response.data.data);
                this.setState({ isLoading: false });
            } else {
                this.setState({ orderStatus: '' })
            }

        }).catch(error => {
            console.log(error)
        });
    }
    /**
     * Get order tracking time data
     */
    getOrderTrackingTime = () => {
        axios.get('user/ordertrackingtime', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        }).then((response) => {
            if (typeof response.data.data != 'undefined') {
                this.setState({ orderStatus: response.data.data })
                console.log(response.data.data)
            } else {
                this.setState({ orderStatus: '' })
            }

        }).catch(error => {
            console.log(error)
        });
    }

    /******************************************************************************/
    /******************************************************************************/
    /**
     * Get product details
     * 
     * @returns Array|null
     */
    getProductSku = () => {
        console.log("getProductSku is run")
        const cart = this.props.cart
        let product_sku = [];
        cart.forEach(items => {
            console.log("items", items)
            let sellerdata = this.getSellerId(items.id);
            sellerdata.then((result) => {
                product_sku.push({
                    productId: items.id,
                    quantity: items.quantity,
                    price: items.price,
                    color: '',
                    size: '',
                    sellerId: result
                })
            })
        })
        console.log(product_sku);
        if (product_sku) {
            this.setState({ "productSku": product_sku })
        } else {
            return false
        }
    }
    /******************************************************************************/
    /******************************************************************************/
    /**
     * Get total amount and multiple data 
     * 
     * @returns totalPrice, totalQuantity, totalAmmount, discount, tax
     */
    getTotal = () => {
        const cart = this.props.cart;
        const newDesApi = this.state.apiData;
        var newDiscount = ''
        newDesApi.forEach(val => {
            newDiscount = val.discount_per
        })
        let totalQuantity = 0
        let disCode = newDiscount
        let totalPrice = 0
        let GST = 18
        let totalAmmount = 0
        let discount = 0
        let tax = 0
        cart.forEach(items => {
            totalQuantity += items.quantity
            totalPrice += items.price * items.quantity
            tax = totalPrice * GST / 100
            //totalAmmount = totalPrice + tax
            if (disCode === undefined) {
                discount = 0
                totalAmmount = totalPrice + tax
            } else {
                discount = totalPrice * disCode / 100
                totalAmmount = totalPrice + tax - discount
            }
        })
        return { totalPrice, totalQuantity, totalAmmount, discount, tax }
    }


    manageOrderStatus = async () => {
        const { paymentId, selectCard } = this.state;
        try {
            const orderResId = [];
            if (selectCard !== null) {
                // for subscription plan
                const payload = {
                    status: "Subscription payment complete",
                    userId: this.authInfo.id,
                    paymentId: paymentId,
                    product: null,
                    service: null,
                    serviceCreateCharge: null,
                    subscriptionPlan: {
                        _id: selectCard._id,
                        planId: selectCard.id,
                    }
                }
                const response = await axios.post("seller/updateorderstatus", payload, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                        Authorization: `Bearer ${this.authInfo.token}`,
                    },
                });
                orderResId.push(response.data.data.id);
            } else {
                const payload = {
                    status: "Payment complete",
                    userId: this.authInfo.id,
                    paymentId: paymentId,
                    product: null,
                    service: null,
                    serviceCreateCharge: true,
                    subscriptionPlan: null
                }
                const response = await axios.post("seller/updateorderstatus", payload, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                        Authorization: `Bearer ${this.authInfo.token}`,
                    },
                });
                orderResId.push(response.data.data.id);
            }
            this.onSubmitHandler(orderResId)
        } catch (error) {
            alert("Failed to create some order statuses.");
            console.error("Error updating order status:", error);
        }
    };

    /**
     * Submit form data when order is placed
     * 
     * @param {*} event 
     */
    onSubmitHandler = (orderResId) => {
        const { selectCard, planPrice, stripeResponse } = this.state;
        // console.log("orderResId in onSubmit Handler", orderResId)
        // console.log("price amount selected=> ", selectCard !== null ? selectCard.amount / 100 : planPrice,)

        const url = '/seller/saveorder';

        if (stripeResponse.status === true) {
            let reqBody = {}
            reqBody = {
                data: {
                    userId: this.authInfo.id,
                    paymentId: this.state.paymentId,
                    billingFirstName: this.state.billingFirstName,
                    billingLastName: this.state.billingLastName,
                    billingCity: this.state.billingCity,
                    billingCompanyName: this.state.billingCompanyName,
                    billingCounty: this.state.billingCounty,
                    billingNote: this.state.billingNote,
                    billingPhone: this.state.billingPhone,
                    billingPostCode: this.state.billingPostCode,
                    billingStreetAddress: this.state.billingStreetAddress,
                    billingStreetAddress1: this.state.billingStreetAddress1,
                    billingEmail: this.state.billingEmail,
                    deliveryCharge: 0,
                    taxPercent: 0,
                    taxAmount: 0,
                    discount: 0,
                    price: selectCard !== null ? selectCard.amount / 100 : planPrice,
                    total: selectCard !== null ? selectCard.amount / 100 : planPrice,
                    orderStatus: orderResId,
                    isActive: true,
                    isService: false,
                    isSubscription: true,
                },
                user_id: this.authInfo.id
            }
            axios.post(url, reqBody.data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`,
                }
            }).then((response) => {
                // console.log("response++++ : ", response);
                // console.log("response++++ : ", response.data.status);
                // if (response.data.status === true) {
                //     this.addOrderTimeLine(response.data.data, orderStatus);
                //     console.log("response userSave order : ", response);
                //     this.saveOrderDetails(response.data.data, product_sku, orderStatus);
                // }
                this.handleCheckOut();

            }).catch(error => {
                console.log(error)
                toast.error(error);
            });
        } else {
            toast.dismiss();
            toast.error('Order is not placed.Please try again.');
        }
    }
    /******************************************************************************/
    /******************************************************************************/
    /**
     * Saves the order id and status in the ordertimelime collection
     * 
     * @param {*} orderId 
     * @param {*} orderStatus 
     */
    addOrderTimeLine = (orderId, orderStatus) => {
        let reqBody = {}
        reqBody = {
            data: {
                orderId: orderId,
                orderStatusId: orderStatus,
                isActive: true
            },
        }
        axios.post('seller/saveordertracking', reqBody.data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        }).then((response) => {
            console.log(response.data.data);
            //this.updateOrderStatus(orderId, response.data.data)
        }).catch(error => {
            console.log(error)
            toast.error(error);
        });
    }
    /******************************************************************************/
    /******************************************************************************/
    /**
     * Saves the order id and status in the order details collection
     * 
     * @param {*} orderId 
     * @param {*} orderStatus 
     */
    saveOrderDetails = (orderId, orderStatus) => {

        const { planPrice, selectCard } = this.state;

        let reqBody = {}
        let prodArray = [];

        prodArray.push({
            orderId: orderId,
            price: selectCard !== null ? selectCard.amount / 100 : planPrice,
            userId: this.authInfo.id,
            isService: false,
        });

        reqBody = {
            data: prodArray
        }

        axios.post('/seller/saveorderdetails', reqBody.data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        }).then((response) => {
            console.log("Save order details ", response.data.data);
            this.setState({ allOrderStatus: response.data.data })
            console.log("ORDER ID CHECK", orderId);
            this.updateOrderStatus(orderId, response.data.data)

            // toast.success('Payment successful!', 5000);

        }).catch(error => {
            console.log(error)
            toast.error(error);
        });
    }
    /******************************************************************************/
    /******************************************************************************/
    /**
     * Update the order status
     * 
     * @param {*} orderId 
     * @param {*} orderTrackingId 
     */
    updateOrderStatus = (orderId, orderTrackingId) => {
        const formData = localStorage.getItem('serviceData')
        //console.log('dataofservicetosave',formData)
        let reqBody = {
            orderId: orderId,
            orderStatus: orderTrackingId,
        }
        axios.post('/seller/updateorderstatus', reqBody.data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        }).then((response) => {
            console.log("ORDER STATUS", response.data.data);
            // this.handleCheckOut();
            this.setState({ showModal: true });


            localStorage.setItem('serviceName', this.state.serviceName);
            localStorage.setItem('serviceCategory', this.state.serviceCategory);

            axios.post('seller/services', formData, {
                headers: {
                    'Accept': 'application/form-data',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                if (response.data.status) {
                    //   this.props.history.push('/seller/service-checkout');
                }
                //   console.log('its ressssss', response)
            }).catch(error => {
                console.log('error =>', error)
                if (error.response) {
                    toast.error(error.response.data.message);
                }
            }).finally(() => {
                // console.log('inside the finally block')
                setTimeout(() => {
                    //   this.dispatch(setLoading({ loading: false }));
                }, 300);
            });
        }).catch(error => {
            console.log(error)
            toast.error(error);
        });
    }

    clearSessionStorage = () => {
        sessionStorage.clear();
    }

    render() {
        const { selectCard, planPrice, serviceName, serviceCategory, serviceCategoryName, isLoading, stripeResponse } = this.state;
        // this.onSubmit = () => {
        //     let disCode = document.getElementById('myCoupon').value
        //     console.log(disCode)
        //     let reqBody = {}
        //     let user = this.authInfo.id



        // }    //onSubmit() 

        return (
            <React.Fragment>
                <Header />
                <section className="inr_wrap checkout_wrap">
                    <div className="container">
                        <div className="cart my_cart">
                            <div className="row">
                                {selectCard === null ? <div className="col-md-12">
                                    <div className="payment_method_section">
                                        <div className="payment_list">
                                            <ul>
                                                <li>Service Name : <b>{serviceName}</b></li>
                                                <li>Service Category : <b>{serviceCategoryName}</b></li>
                                                <li>Subscription Price : <b>$ {planPrice}</b></li>
                                                {/* <li>Tax(18%) : {this.getTotal().tax}$ </li> */}
                                            </ul>
                                        </div>
                                        <div className="subtotal_wrapper">
                                            <ul>
                                                <li>Subtotal : <b>$ {planPrice}</b></li>
                                            </ul>
                                        </div>

                                        {/* STRIPE FORM  */}
                                        <div>
                                            <form onSubmit={(e) => this.handleSubmit(e, this.props.elements, this.props.stripe)}>
                                                <CardElement
                                                    options={{
                                                        style: {
                                                            base: {
                                                                fontSize: '18px',
                                                                color: '#424770',
                                                                backgroundColor: '#e6e6e6',
                                                                padding: '4px 4px',
                                                                '::placeholder': {
                                                                    color: '#aab7c4',
                                                                },
                                                            },
                                                            invalid: {
                                                                color: '#9e2146',
                                                            },
                                                        },
                                                    }}
                                                />
                                                <div className="d-grid col-6 mx-auto" >
                                                    <button type="submit" className="btn btn-success" disabled={isLoading} > {isLoading ? "Please wait..." : `PAY $ ${planPrice}`}</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                    :

                                    <div className="payment_method_section">
                                        <div className="payment_list">
                                            <ul>
                                                <li>Type of Plan : <b>{selectCard.nickname}</b></li>
                                                <li>Plan Interval : <b>{selectCard.interval_count} {selectCard.interval}</b></li>
                                                <li>Price : <b>{selectCard.amount / 100} $</b></li>
                                                {/* <li>Tax(18%) : {this.getTotal().tax}$ </li> */}
                                            </ul>
                                        </div>
                                        <div className="subtotal_wrapper">
                                            <ul>
                                                <li>Subtotal : <b>{selectCard.amount / 100} $</b></li>
                                            </ul>
                                        </div>
                                        {/* STRIPE FORM  */}
                                        <div>
                                            <form onSubmit={(e) => this.handleSubmit(e, this.props.elements, this.props.stripe)}>
                                                <CardElement
                                                    options={{
                                                        style: {
                                                            base: {
                                                                fontSize: '18px',
                                                                color: '#424770',
                                                                backgroundColor: '#e6e6e6',
                                                                padding: '4px 4px',
                                                                '::placeholder': {
                                                                    color: '#aab7c4',
                                                                },
                                                            },
                                                            invalid: {
                                                                color: '#9e2146',
                                                            },
                                                        },
                                                    }}
                                                />
                                                <div className="text-center" >
                                                    <button type="submit" className="btn btn-success" disabled={isLoading} >  {isLoading ? 'Please wait....' : `PAY ( $ ${selectCard.amount / 100})`} </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div >
                </section >

                <Modal
                    show={this.state.showModal}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Body>
                        <div className="alert text-center" role="alert">
                            <img src={successImg} alt="Success" style={{ width: '100px', height: '100px' }} />
                            <h4 className="alert-heading text-success">Your payment was successfull!</h4>

                            <p className="mb-0">Your invoice no is <b>{stripeResponse.status === true ? stripeResponse.data.latest_invoice.number : ""}</b></p>

                            <div className="d-grid gap-2 col-6 mx-auto mt-3">
                                {selectCard === null ?
                                    <Link to="/seller/service-stock-management">
                                        <button onClick={this.clearSessionStorage} className="btn btn-primary btn-sm mt-2" type="button">Return</button>
                                    </Link> :
                                    <Link to="/seller/dashboard">
                                        <button onClick={this.clearSessionStorage} className="btn btn-primary btn-sm mt-2" type="button">Return</button>
                                    </Link>
                                }
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <Footer />
            </React.Fragment >
        )
    }
}
//export default CheckOut;
const mapStateToProps = state => {
    return {
        cart: state.cart.cart
    }
}

export default connect(mapStateToProps)(ServiceCheckout);