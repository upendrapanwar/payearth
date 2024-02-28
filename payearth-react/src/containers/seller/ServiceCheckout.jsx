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
//coinbase inport
//import CoinbaseCommerceButton from "react-coinbase-commerce";
//import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';
// import { FormComponent, FormContainer } from "react-authorize-net";

//let clientKey = process.env.REACT_APP_AUTHORIZENET_CLIENTKEY as string;
//let clientKey;
//let apiLoginId = process.env.REACT_APP_AUTHORIZENET_LOGINID as string;
//let apiLoginId;
/*
type State = {
    status: "paid" | "unpaid" | ["failure", string[]];
};*/

// const Button = styled.button({
//     "&:hover": { cursor: "pointer" },
//     padding: "10px",
//     backgroundColor: "white",
//     border: "2px solid black",
//     fontWeight: 600,
//     borderRadius: "2px"
// });

// const ErrorComponent = (props: {
//     errors: [];
//     onBackButtonClick: () => void;
// }) => (
//     <div>
//         <Text fontSize={3} fontWeight={"500"} mb={3}>
//             Failed to process payment
//         </Text>
//         {props.errors.map(error => (
//             <Text py={2}>{error}</Text>
//         ))}
//         <Button onClick={props.onBackButtonClick}>Go Back</Button>
//     </div>
// );

/*
const Header = props => (
  <Flex py={4}>
    <Heading>react-authorize-net-example</Heading>
  </Flex>
);*/


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
            plan_Id: "",
            error: null,
            planPrice: "200",
            stripeResponse: "",
            allOrderStatus: "",
            show: false,
            showModal: false,

        };
    }
    

    // Stripe function

    fetchStripePlans = async () => {
        console.log("fetchStrip plan function is run")
        try {
            const stripeSecretKey = process.env.REACT_APP_SECRET_KEY;
            const response = await axios.get(`https://api.stripe.com/v1/plans`, {
                headers: {
                    Authorization: `Bearer ${stripeSecretKey}`,
                },
            });

            console.log("response.data", response.data.data)
            console.log("response.data", response.data)
            this.setState({ plan_Id: 'price_1OhntbD2za5c5GtOpiypaDOt' })
            // setPlans(fetchedPlans);
        } catch (error) {
            console.error('Error fetching Stripe plans:', error);
        }

    };

    handleCheckOut = () => {
        console.log("RUNNNNN>>>>>>handleCheckOut")
        this.setState({ showModal: true });
    };
    
    handleSubmit = async (event, elements, stripe) => {
        this.setState({isLoading: true});
        event.preventDefault();
        console.log("Just to check handleSubmit")
        console.log("Elements", elements)
        console.log("event", event)
        console.log("stripe", stripe)
        if (!stripe || !elements) {
            return;
        }
        const cardElement = elements.getElement(CardElement);
        const { token, error } = await stripe.createToken(cardElement);

        if (error) {
            console.error("Create Token Error:",error);
            this.setState({isLoading: false});
            toast.error(error.message);
        } else {
            // You can handle the token or payment method ID here
            console.log('Token or Payment Method ID:', token.id);
            this.setState({ paymentMethodId: token.id })
            // Now, you can send the token or payment method ID to your server for further processing
        }

        this.handleSubscribeStripe();
    };

    handleSubscribeStripe = () => {
        const { email, paymentMethodId, plan_Id, authName } = this.state;
        console.log("Plan ID", plan_Id)
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
            console.log("Subscription created succesfully....", response.data);
            console.log("payment status", response.data.data.status)
            this.setState({ stripeResponse: response.data })

            const paymentData = [{
                'userId': this.authInfo.id,
                'sellerId': "",
                'amountPaid': "",
                'paymentMode': 'usd',
                'paymentAccount': 'Stripe',
                'invoiceUrl': '',
                'paymentStatus': response.data.data.status,
            }];
            console.log("paymentData", paymentData)
            // this.onSubmitHandler();
            var paymentIds = this.managePaymentData(paymentData);
            let paymentId;
            paymentIds.then((result) => {
                paymentId = result;
                this.setState({ "paymentId": paymentId })
                this.onSubmitHandler();

            })
        }).catch((error) => {
            console.log("error", error);
        })
    }




    // onErrorHandler = (response) => {

    //     //  const subscriptionPlanData = this.props.location.state && this.props.location.state.subscriptionPlan;

    //     console.log(response);
    //     this.setState({
    //         status: ["failure", response.messages.message.map(err => err.text)]
    //     });
    //     const paymentData = [{
    //         'userId': this.authInfo.id,
    //         'sellerId': this.state.productSku,
    //         'amountPaid': "",
    //         'paymentMode': 'usd',
    //         'paymentAccount': 'Authorize .Net',
    //         'invoiceUrl': '',
    //         'paymentStatus': 'failed',
    //     }];
    //     console.log("......", paymentData);
    //     var paymentIds = this.managePaymentData(paymentData);
    //     let paymentId;
    //     paymentIds.then((result) => {
    //         paymentId = result;
    //     })
    //     this.setState({ "paymentId": paymentId })

    // };
    /**
     * Called On successful payment
     * 
    //   @param {*} response 
     */
    // onSuccessHandler = (response) => {

    //     //  const subscriptionPlanData = this.props.location.state && this.props.location.state.subscriptionPlan;

    //     console.log("resp:", response);
    //     console.log("resp:", response.isTrusted === true ? "TRUE" : "FALSE");
    //     if (response.isTrusted === true) {
    //         console.log("subscription trueeeeeee")
    //         this.setState({ status: ["paid", []] });
    //         toast.dismiss();
    //         toast.success('Payment Successfull', { autoClose: 3000 });

    //         const paymentData = [{
    //             'userId': this.authInfo.id,
    //             'sellerId': this.state.productSku,
    //             'amountPaid': "subscriptionPlanData.planPrice",
    //             'paymentMode': 'usd',
    //             'paymentAccount': 'Authorize .Net',
    //             'invoiceUrl': '',
    //             'paymentStatus': 'Paid',
    //         }];
    //         console.log("......", paymentData);
    //         var paymentIds = this.managePaymentData(paymentData);
    //         let paymentId;
    //         paymentIds.then((result) => {
    //             console.log(result);
    //             paymentId = result;
    //             this.setState({ "paymentId": result })
    //             // this.onSubmitHandler();
    //             // this.savePayData()
    //         })
    //         console.log(paymentId)
    //         console.log("Payment PAID or UNPAID check here: ", this.state.status)



    //     }
    //     // Process API response on your backend...

    // };

    /****************************************************************************************** */
    // handleCardNumber = (e) => {
    //     this.setState({ cardNumber: e.target.value })
    // }
    // handleExpiry = (e) => {
    //     const input = e.target.value.replace(/\D/g, '');
    //     if (input.length > 2) {
    //         this.setState({ expiryDate: input.slice(0, 2) + '/' + input.slice(2) });
    //     } else {
    //         this.setState({ expiryDate: input })
    //     }
    // }
    // handleCvv = (e) => {
    //     this.setState({ cvv: e.target.value })
    // }

    /**************************************************************************/
    /**************************************************************************/

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
        this.fetchStripePlans();
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
                console.log("get order status", response.data.data);
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
     *  get new Coupon code 
     */
    getNewCouponCode = () => {
        let reqBody = this.state.reqBody
        axios.post('/seller/coupons/new', reqBody, {
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
    }  

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
    onSubmitHandler = event => {
        const { planPrice, stripeResponse } = this.state;
        const url = '/seller/saveorder';

        if (stripeResponse.status === true) {
            let orderStatusData = this.state.orderStatus;
            let orderStatus = '6137423b2651fc157c545d50';//pending
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
                    price: planPrice,
                    total: planPrice,
                    orderStatus: orderStatus,
                    isActive: true,
                    isService: false
                },
                user_id: this.authInfo.id
            }
            console.log("submit handler: ", reqBody);

            axios.post(url, reqBody.data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`,
                }
            }).then((response) => {
                // toast.success('Order Placed Successfull', { autoClose: 3000 });
                console.log("response++++ : ", response);
                console.log("response++++ : ", response.data.status);
                if (response.data.status === true) {
                    this.addOrderTimeLine(response.data.data, orderStatus);
                    console.log("response userSave order : ", response);
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
        let reqBody = {}
        let prodArray = [];

        prodArray.push({
            orderId: orderId,
            price: this.state.planPrice,
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

        const { planPrice, serviceName, serviceCategory, isLoading, stripeResponse } = this.state;

        // submit Function
        this.onSubmit = () => {
            let disCode = document.getElementById('myCoupon').value
            console.log(disCode)
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
                <section className="inr_wrap checkout_wrap">
                    <div className="container">
                        <div className="cart my_cart">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="payment_method_section">
                                        <div className="payment_list">
                                            <ul>
                                                <li>Service Name : <b>{serviceName}</b></li>
                                                <li>Service Category : <b>{serviceCategory}</b></li>
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
                                                <div className="d-grid col-6 mx-auto" >
                                                    <button type="submit" className="btn btn-success" disabled= {isLoading} > {isLoading ? "Please wait..." : `PAY $ ${planPrice}`}</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </section >


                <Modal
                    show={this.state.showModal}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered

                // aria-labelledby="example-custom-modal-styling-title"
                >

                    <Modal.Body>
                        <div className="alert text-center" role="alert">
                            <img src={successImg} alt="Success" style={{ width: '100px', height: '100px' }} />
                            <h4 className="alert-heading text-success">Your payment was successfull!</h4>

                            <p className="mb-0">Your invoice no is <b>{stripeResponse.status === true ? stripeResponse.data.latest_invoice.number : ""}</b></p>

                            <div className="d-grid gap-2 col-6 mx-auto mt-3">
                                {/* <div className="ctn_btn"><Link to="/my-banners" className="view_more">DONE</Link></div> */}
                                <Link to="/seller/service-stock-management">
                                    <button onClick={this.clearSessionStorage} class="btn btn-primary btn-sm mt-2" type="button">Return</button>
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

export default connect(mapStateToProps)(ServiceCheckout);