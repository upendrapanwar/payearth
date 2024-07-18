import React, { Component, useRef } from "react";
import Header from "../../components/user/common/Header";
import PageTitle from "../../components/user/common/PageTitle";
import Footer from "../../components/common/Footer";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Box, Text } from "rebass";
import styled from "styled-components";
import { toast } from 'react-toastify';
import store from '../../store/index';
import successImg from "../../assets/images/success_png.png"
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Modal from "react-bootstrap/Modal";

const Button = styled.button({
    "&:hover": { cursor: "pointer" },
    padding: "10px",
    backgroundColor: "white",
    border: "2px solid black",
    fontWeight: 600,
    borderRadius: "2px"
});

class ServiceCheckOut extends Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef;
        this.authInfo = store.getState().auth.authInfo;
        this.userInfo = store.getState().auth.userInfo;

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

            // stripe
            authName: this.userInfo.name,
            email: this.userInfo.email,
            paymentMethodId: null,
            planId: "",
            error: null,
            selectCard: "",
            stripeResponse: "",
            allOrderStatus: "",
            show: false,
            showModal: false,
            isLoading: false,
            serviceDetails: "",
        };
    }

    // stripe function

    componentWillMount() {
        const services = sessionStorage.getItem('serviceDetails');
        if (services) {
            console.log("services run")
            const parsedItem = JSON.parse(services);
            this.setState({ serviceDetails: parsedItem });
        }
    }

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
        // TEST *********************
        // const { error, paymentMethod } = await stripe.createPaymentMethod({
        //     type: 'card',
        //     card: cardElement,
        // });

        // TEST**********************/
        const { token, error } = await stripe.createToken(cardElement);

        if (error) {
            console.error("card validation error : ", error);
            toast.error(error.message);
            this.setState({ isLoading: false });

        } else {
            // console.log("this.authInfo.token", this.authInfo.token)
            const response = await fetch('/user/serviceCharge', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
                body: JSON.stringify({
                    paymentMethodId: token.id,
                    email: this.userInfo.email,
                    amount: this.state.serviceDetails.charges * 100,
                    authName: this.userInfo.name
                }),
            });
            const paymentIntent = await response.json();
            console.log("paymentIntent : ", paymentIntent);

            if (paymentIntent.status === true) {
                // this.setState({ stripeResponse: paymentIntent });
                const paymentData = [{
                    'userId': this.authInfo.id,
                    'sellerId': "",
                    'amountPaid': paymentIntent.data.paymentIntent.amount_received / 100,
                    // 'paymentMode': "",
                    'paymentAccount': 'Stripe',
                    'invoiceUrl': paymentIntent.data.invoice.invoice_pdf,
                    'paymentStatus': paymentIntent.data.invoice.status,
                }];

                var paymentIds = this.managePaymentData(paymentData);
                let paymentId;
                paymentIds.then((result) => {
                    paymentId = result;
                    this.setState({ "paymentId": paymentId })
                    this.onSubmitHandler();
                })
                this.setState({ stripeResponse: paymentIntent });
            }
        }
    };

    // handleSubscribeStripe = () => {
    //     const { email, paymentMethodId,
    //         // plan_Id,
    //         authName } = this.state;
    //     const url = '/user/serviceCharge';

    //     const subData = {
    //         email,
    //         paymentMethodId,
    //         // plan_Id,
    //         authName
    //     };

    //     axios.post(url, subData, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${this.authInfo.token}`
    //         }
    //     }).then((response) => {
    //         console.log("Subscription created succesfully....", response.data);
    //         console.log("response", response.data.data)
    //         // console.log("invoice url : ",response.data.data.latest_invoice.invoice_pdf)
    //         // console.log("currency", response.data.data.plan.currency)
    //         console.log("paymentStatus", response.data.data.latest_invoice.status)
    //         this.setState({ stripeResponse: response.data })

    //         const paymentData = [{
    //             'userId': this.authInfo.id,
    //             'sellerId': this.state.productSku,
    //             'amountPaid': response.data.data.plan.amount / 100,
    //             'paymentMode': response.data.data.plan.currency,
    //             'paymentAccount': 'Stripe',
    //             'invoiceUrl': response.data.data.latest_invoice.invoice_pdf,
    //             'paymentStatus': response.data.data.latest_invoice.status,
    //         }];
    //         console.log("paymentData", paymentData)
    //         // this.onSubmitHandler();
    //         var paymentIds = this.managePaymentData(paymentData);
    //         let paymentId;
    //         paymentIds.then((result) => {
    //             paymentId = result;
    //             this.setState({ "paymentId": paymentId })
    //             this.onSubmitHandler();

    //         })
    //     }).catch((error) => {
    //         console.log("error", error);
    //     })
    // }





    /**
     * Manages payment Data
     * 
     * @param {*} paymentData 
     */
    managePaymentData = async (paymentData) => {
        let reqBody = this.state.reqBody
        let res = await axios.post('user/savepayment', paymentData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        })
        console.log("managepayment Data", res.data.data);
        let productid = res.data.data;
        if (typeof productid != 'undefined') {
            return productid;
        } else {
            return false;
        }
        {/*}.then((response) => {
            //this.setState({ orderStatus: response.data.data.orderstatus })
            console.log(response.data.data)
        }).catch(error => {
            console.log(error)
        });*/}
    }
    /**************************************************************************/
    /**************************************************************************/
    /**
     * Initialize instance and function on did mount
     */
    componentDidMount() {
        this.getNewCouponCode();
        this.getOrderStaus();
        //this.getOrderTrackingTime();
        this.getProductSku();
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
     * Get order status data
     */
    getOrderStaus = () => {
        let reqBody = this.state.reqBody

        axios.get('user/orderstatus', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        }).then((response) => {
            if (typeof response.data.data != 'undefined') {
                this.setState({ orderStatus: response.data.data })
                console.log("get order status", response.data.data)
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
        let reqBody = this.state.reqBody

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
     *  get new Coupon code 
     */
    getNewCouponCode = () => {
        let reqBody = this.state.reqBody
        axios.post('user/coupons/new', reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        }).then((response) => {
            this.setState({ data: response.data.data.coupons })
            console.log(response.data.data.coupons)
        }).catch(error => {
            console.log(error)
        });
    }   //get new Coupon code
    /******************************************************************************/
    /******************************************************************************/

    /**
     * Get product details
     * 
     * @returns Array|null
     */
    getProductSku = () => {
        const cart = this.props.cart
        let product_sku = [];
        cart.forEach(items => {
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

        //return product_sku;
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
    /******************************************************************************/
    /******************************************************************************/

    /**
     * Submit form data when order is placed 
     * 
     * @param {*} event 
     */
    onSubmitHandler = () => {
        const { selectCard, stripeResponse } = this.state;

        console.log("stripeResponse: ", stripeResponse)
        console.log("amount", stripeResponse.data.paymentIntent.amount_received / 100);
        const url = 'user/saveorder';

        if (stripeResponse.status === true) {
            let orderStatusData = this.state.orderStatus;
            let orderStatus = '';//pending
            console.log(orderStatusData);
            if (typeof orderStatusData != 'undefined') {
                orderStatusData && orderStatusData.map((d) => {
                    if (d.title == "Completed") {
                        orderStatus = d._id;
                    }
                })
            }

            let product_sku = this.state.productSku;
            let reqBody = {}
            // let user = this.authInfo.id

            reqBody = {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 2,
                    data: '',
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                data: {
                    userId: this.authInfo.id,
                    productId: product_sku,
                    paymentId: this.state.paymentId,
                    sellerId: product_sku,
                    product_sku: product_sku,
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
                    price: stripeResponse.data.paymentIntent.amount_received / 100,
                    total: stripeResponse.data.paymentIntent.amount_received / 100,
                    orderStatus: orderStatus,
                    isActive: true,
                    isService: true
                },
                user_id: this.authInfo.id
            }
            // console.log("submit handler: ", reqBody);

            axios.post(url, reqBody.data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`,
                }
            }).then((response) => {
                // toast.success('Order Placed Successfull', { autoClose: 3000 });
                // console.log("response++++ : ", response);
                // console.log("response++++ : ", response.data.status);
                if (response.data.status === true) {
                    this.addOrderTimeLine(response.data.data, orderStatus);
                    // console.log("response userSave order : ", response);
                    this.saveOrderDetails(response.data.data, product_sku, orderStatus);

                }
            }).catch(error => {
                console.log(error)
                toast.error(error);
            });
            // console.log("out of then .......", response.data)
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
        axios.post('user/saveordertracking', reqBody.data, {
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
        const serviceId=sessionStorage.getItem('serviceId');
        let reqBody = {}
        var prodArray = [];
        // for (var i = 0; i < subscriptionPlanData.length; i++) {
        prodArray.push({
            orderId: orderId,
            //   productId: productData[i].productId,
            serviceId:serviceId,
            //  quantity: productData[i].quantity,
            price: this.state.stripeResponse.data.paymentIntent.amount_received / 100,
            //  color: productData[i].color,
            //  size: productData[i].size,
            userId: this.authInfo.id,
            //   sellerId: productData[i].sellerId,
            isService: true,
        });
        //  }
        reqBody = {
            data: prodArray
        }
        axios.post('user/saveorderdetails', reqBody.data, {
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

        let reqBody = {
            orderId: orderId,
            orderStatus: orderTrackingId,
        }
        axios.post('user/updateorderstatus', reqBody.data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`,
            }
        }).then((response) => {
            console.log("ORDER STATUS", response.data.data);
            this.setState({ isLoading: false });
            this.handleCheckOut();

            // toast.success('Payment Successfull', { autoClose: 3000 });
            // this.props.history.push('/my-banners')
            // toast.dismiss();
            // toast.success('Payment successful!', 2000, function () {
            //     this.props.history.push('/my-banners')
            // });
        }).catch(error => {
            console.log(error)
            toast.error(error);
        });
    }
    /**
     * Sets the form data
     * 
     * @param {*} field 
     * @param {*} value 
     */
    //onChange(field, value) {
    // parent class change handler is always called with field name and value
    //    this.setState({field: value});
    //this.setState({ "productSku": product_sku })
    //}
    // onChange(evt) {
    //     // parent class change handler is always called with field name and value
    //     const value = evt.target.value;
    //     this.setState({ ...this.state, [evt.target.name]: value });
    // }
    /******************************************************************************/
    /******************************************************************************/

    clearSessionStorage = () => {
        sessionStorage.clear();
    }

    render() {

        const { expiryDate, selectCard, isLoading, stripeResponse, serviceDetails } = this.state;
        console.log("serviceDetails in service checkout: ", serviceDetails)
        console.log("serviceDetails charges:>", serviceDetails.charges)
        //  const subscriptionPlanData = this.props.location.state && this.props.location.state.subscriptionPlan;
        //  console.log("Date form create banner pages", subscriptionPlanData)


        const cart = this.props.cart
        // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        // const fullname = userInfo.name;
        // const [first, last] = fullname.split(' ');
        // const { history } = this.props;


        // submit Function
        this.onSubmit = () => {
            let disCode = document.getElementById('myCoupon').value
            console.log(disCode)
            //this.setState({ couponCode: disCode })
            let reqBody = {}
            let user = this.authInfo.id
            reqBody = {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 2,
                    data: '',
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                data: disCode,
                user_id: user
            }

            if (disCode === '') {
                toast.error('Coupon code is blank')
            } else {
                //check isActive is true
                axios.post('user/coupons/check', reqBody, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${this.authInfo.token}`,
                    }
                }).then((response) => {
                    this.setState({ apiData: response.data.data.coupons })

                }).catch(error => {
                    console.log(error)
                    toast.error('This code is already used or code is not match')
                });//check isActive is true
            }
        }    //onSubmit() 


        //getTotal();

        this.onValueChange = (event) => {
            this.setState({
                paymentType: event.target.value
            });

            if (this.state.paymentType === 'cripto') {
                this.setState({ moneyComparision: false })
                this.setState({ formStatus: false })
            }
        }



        return (
            <React.Fragment>
                <Header />
                <PageTitle title="Service Charges" />
                <section className="inr_wrap checkout_wrap">
                    <div className="container">
                        <div className="cart my_cart">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="payment_method_section">
                                        <div className="payment_list">
                                            <ul>
                                                <li>Service Name : <b>{serviceDetails.name}</b></li>
                                                <li>Service Category : <b>{serviceDetails.category.categoryName}</b></li>
                                                <li>Charges : <b>{serviceDetails.charges} $</b></li>
                                                {/* <li>Tax(18%) : {this.getTotal().tax}$ </li> */}
                                            </ul>
                                        </div>
                                        <div className="subtotal_wrapper">
                                            <ul>
                                                <li>Total Amount : <b>{serviceDetails.charges} $</b></li>
                                            </ul>
                                        </div>
                                        {/* STRIPE FORM  */}
                                        <div>
                                            <form onSubmit={(e) => this.handleSubmit(e, this.props.elements, this.props.stripe)}>
                                                {/* <input
                                                            type="email"
                                                            placeholder="Enter your email"
                                                            value={this.state.email}
                                                            onChange={(e) => this.setState({ email: e.target.value })}
                                                        /> */}
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
                                                    <button type="submit" className="btn btn-success" disabled={isLoading} >  {isLoading ? 'Please wait....' : `PAY ( $ ${serviceDetails.charges})`} </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

                            {/* <p className="mb-0">Your invoice no is <b>{stripeResponse.status === true ? stripeResponse.data.latest_invoice.number : ""}</b></p> */}
                            <div className="d-grid gap-2 col-6 mx-auto mt-3">
                                {/* <div className="ctn_btn"><Link to="/my-banners" className="view_more">DONE</Link></div> */}
                                <Link to="/">
                                    <button onClick={this.clearSessionStorage} className="btn btn-primary btn-sm mt-2" type="button">Return</button>
                                </Link>
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

export default connect(mapStateToProps)(ServiceCheckOut);