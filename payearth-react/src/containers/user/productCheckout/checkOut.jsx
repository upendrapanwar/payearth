import React, { Component, useRef } from "react";
import Header from "../../../components/user/common/Header";
import PageTitle from "../../../components/user/common/PageTitle";
import Footer from "../../../components/common/Footer";
import { connect } from "react-redux";
import { setLoading } from '../../../store/reducers/global-reducer';
import axios from "axios";
import * as Yup from 'yup';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import { Box, Text } from "rebass";
import styled from "styled-components";
import { toast } from "react-toastify";
import store from "../../../store/index";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import arrow_back from '../../../assets/icons/arrow-back.svg';
// import InjectedCheckoutForm from "./InjectedCheckoutForm";
import CheckoutForm from "./checkoutForm";

const stripePromise = loadStripe(`${process.env.REACT_APP_PUBLISHABLE_KEY}`);
// console.log("stripePromise: ", stripePromise)

class CheckOut extends Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            userDetails: [],
            formStatus: false,
            chargeData: "",
            checkoutData: "",
            apiData: [],
            statusData: [],
            orderStatus: [],
            paymentId: "",
            productSku: [],
            //status: "paid" | "unpaid" | ["failure", []],
            status: "unpaid",
            data: [],
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 2,
                    data: "",
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc",
                },
            },
            autherStatus: "",
            user_id: "",
            paymentType: "",
            moneyComparision: false,


            // Stripe
            stripeData: this.props.location.state || {},
        };
    }

    /**************************************************************************/
    /**************************************************************************/

    /**
     * Manages payment Data
     *
     * @param {*} paymentData
     */
    managePaymentData = async (paymentData) => {
        let reqBody = this.state.reqBody;
        let res = await axios.post("user/savepayment", paymentData, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${this.authInfo.token}`,
            },
        });
        // console.log(res.data.data);
        let productid = res.data.data;
        if (typeof productid != "undefined") {
            return productid;
        } else {
            return false;
        }
    };
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
        this.getUserData();

    }
    /**************************************************************************/
    /**************************************************************************/

    getUserData = () => {
        const userId = this.authInfo.id
        axios.get('user/my-profile/' + userId, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                let resData = response.data.data;
                // console.log("resData", resData)
                this.setState({
                    userDetails: resData,
                });
            }
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setTimeout(() => {
                // dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }


    // componentDidMount() {
    //     const { dispatch } = this.props;
    //     dispatch(setLoading({ loading: true }));
    //     axios.get('user/my-profile/' + this.authInfo.id, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${this.authInfo.token}`
    //         }
    //     }).then((response) => {
    //         if (response.data.status) {
    //             let resData = response.data.data;
    //             // console.log("resData", resData)
    //             // this.setState({
    //             //     userDetails: resData,                
    //             // });
    //             // console.log("Response data from backend", resData)
    //         }
    //     }).catch(error => {
    //         console.log(error)
    //     }).finally(() => {
    //         setTimeout(() => {
    //             dispatch(setLoading({ loading: false }));
    //         }, 300);
    //     });
    // }



    /**
     * Get the sellet id by product id
     *
     * @param {*} productId
     * @returns sellerid|null
     */
    getSellerId = async (productId) => {
        let reqBody = this.state.reqBody;
        //console.log(this.authInfo)
        let res = await axios.get("user/sellerid/" + productId, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${this.authInfo.token}`,
            },
        });

        let sellerid = res.data.data;
        console.log(res.data.data);
        if (sellerid) {
            console.log("sellerid=" + sellerid);
            return sellerid;
        }

        return false;
    };
    /******************************************************************************/
    /******************************************************************************/
    /**
     * Get order status data
     */
    getOrderStaus = () => {
        let reqBody = this.state.reqBody;

        axios
            .get("user/orderstatus", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${this.authInfo.token}`,
                },
            })
            .then((response) => {
                if (typeof response.data.data != "undefined") {
                    this.setState({ orderStatus: response.data.data });
                    console.log(response.data.data);
                } else {
                    this.setState({ orderStatus: "" });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    /**
     * Get order tracking time data
     */
    getOrderTrackingTime = () => {
        let reqBody = this.state.reqBody;

        axios
            .get("user/ordertrackingtime", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${this.authInfo.token}`,
                },
            })
            .then((response) => {
                if (typeof response.data.data != "undefined") {
                    this.setState({ orderStatus: response.data.data });
                    console.log(response.data.data);
                } else {
                    this.setState({ orderStatus: "" });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    /******************************************************************************/
    /******************************************************************************/

    /**
     *  get new Coupon code
     */
    getNewCouponCode = () => {
        let reqBody = this.state.reqBody;
        axios
            .post("user/coupons/new", reqBody, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${this.authInfo.token}`,
                },
            })
            .then((response) => {
                this.setState({ data: response.data.data.coupons });
                console.log(response.data.data.coupons);
            })
            .catch((error) => {
                console.log(error);
            });
    }; //get new Coupon code
    /******************************************************************************/
    /******************************************************************************/

    /**
     * Get product details
     *
     * @returns Array|null
     */
    getProductSku = () => {
        const cart = this.props.cart;
        let product_sku = [];
        cart.forEach((items) => {
            let sellerdata = this.getSellerId(items.id);
            sellerdata.then((result) => {
                product_sku.push({
                    productId: items.id,
                    quantity: items.quantity,
                    price: items.price,
                    color: "",
                    size: "",
                    sellerId: result,
                });
            });
        });
        console.log(product_sku);
        if (product_sku) {
            this.setState({ productSku: product_sku });
        } else {
            return false;
        }

        //return product_sku;
    };
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
        var newDiscount = "";
        newDesApi.forEach((val) => {
            newDiscount = val.discount_per;
        });
        let totalQuantity = 0;
        let disCode = newDiscount;
        let totalPrice = 0;
        let GST = 18;
        let totalAmmount = 0;
        let discount = 0;
        let tax = 0;
        cart.forEach((items) => {
            totalQuantity += items.quantity;
            totalPrice += items.price * items.quantity;
            tax = (totalPrice * GST) / 100;
            //totalAmmount = totalPrice + tax
            if (disCode === undefined) {
                discount = 0;
                totalAmmount = totalPrice + tax;
            } else {
                discount = (totalPrice * disCode) / 100;
                totalAmmount = totalPrice + tax - discount;
            }
        });
        return { totalPrice, totalQuantity, totalAmmount, discount, tax };
    };
    /******************************************************************************/
    /******************************************************************************/

    /**
     * Submit form data when order is placed
     *
     * @param {*} event
     */
    onSubmitHandler = (event) => {
        event.preventDefault();
        const orderData = [];
        const cart = this.props.cart;
        console.log(this.state);

        if (this.state.status[0] === "paid") {
            let orderStatusData = this.state.orderStatus;
            let orderStatus = "6137423b2651fc157c545d50"; //pending
            console.log(orderStatusData);
            if (typeof orderStatusData != "undefined") {
                orderStatusData &&
                    orderStatusData.map((d) => {
                        if (d.title == "Completed") {
                            orderStatus = d._id;
                        }
                    });
            }

            let product_sku = this.state.productSku;
            let reqBody = {};
            let user = this.authInfo.id;

            reqBody = {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 2,
                    data: "",
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc",
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
                    price: this.getTotal().totalAmmount,
                    total: this.getTotal().totalAmmount,
                    orderStatus: orderStatus,
                    isActive: true,
                    isService: false,
                },
                user_id: this.authInfo.id,
            };
            console.log(reqBody);

            axios
                .post("user/saveorder", reqBody.data, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                        Authorization: `Bearer ${this.authInfo.token}`,
                    },
                })
                .then((response) => {
                    this.setState({ data: response.status });

                    if (response.status) {
                        this.addOrderTimeLine(response.data.data, orderStatus);
                        this.saveOrderDetails(response.data.data, product_sku, orderStatus);
                        console.log(response);
                        toast.dismiss();
                        toast.success("Order Placed Successfull", { autoClose: 3000 });
                        this.props.history.push("/order-summary/" + response.data.data);
                    }
                    //console.log(response.data.data.order)
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error);
                });
        } else {
            toast.dismiss();
            toast.error("Order is not placed.Please try again.");
        }
    };
    /******************************************************************************/
    /******************************************************************************/
    /**
     * Saves the order id and status in the ordertimelime collection
     *
     * @param {*} orderId
     * @param {*} orderStatus
     */
    addOrderTimeLine = (orderId, orderStatus) => {
        let reqBody = {};
        reqBody = {
            data: {
                orderId: orderId,
                orderStatusId: orderStatus,
                isActive: true,
            },
        };
        axios
            .post("user/saveordertracking", reqBody.data, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${this.authInfo.token}`,
                },
            })
            .then((response) => {
                console.log(response.data.data);
                //this.updateOrderStatus(orderId, response.data.data)
            })
            .catch((error) => {
                console.log(error);
                toast.error(error);
            });
    };
    /******************************************************************************/
    /******************************************************************************/
    /**
     * Saves the order id and status in the order details collection
     *
     * @param {*} orderId
     * @param {*} orderStatus
     */
    saveOrderDetails = (orderId, productData, orderStatus) => {
        let reqBody = {};
        var prodArray = [];
        for (var i = 0; i < productData.length; i++) {
            prodArray.push({
                orderId: orderId,
                productId: productData[i].productId,
                quantity: productData[i].quantity,
                price: productData[i].price,
                color: productData[i].color,
                size: productData[i].size,
                userId: this.authInfo.id,
                sellerId: productData[i].sellerId,
                isService: false,
            });
        }
        reqBody = {
            data: prodArray,
        };
        axios
            .post("user/saveorderdetails", reqBody.data, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${this.authInfo.token}`,
                },
            })
            .then((response) => {
                console.log("Save order details ", response.data.data);
                console.log("ORDER ID CHECK", orderId);
                this.updateOrderStatus(orderId, response.data.data);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error);
            });
    };
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
        };
        axios
            .post("user/updateorderstatus", reqBody.data, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${this.authInfo.token}`,
                },
            })
            .then((response) => {
                console.log("ORDER STATUS", response.data.data);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error);
            });
    };
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
    onChange(evt) {
        // parent class change handler is always called with field name and value
        const value = evt.target.value;
        this.setState({ ...this.state, [evt.target.name]: value });
    }
    /******************************************************************************/
    /******************************************************************************/

    handleSubmit = (values) => {
        const updatedValues = {
            ...values,
            role: 'user'
        };
        const { dispatch } = this.props;
        dispatch(setLoading({ loading: true }));
        axios.put(`user/edit-profile/${this.authInfo.id}`, updatedValues, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                "Authorization": `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                toast.success(response.data.message, { autoClose: 3000 });
                this.handleEdit();
            }
        }).catch(error => {
            toast.dismiss();
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message, { autoClose: 3000 });
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    handleEdit = () => {
        this.setState({ userDetails: this.state.userDetails })
        let editProfile = localStorage.getItem('editProfile');
        if (editProfile !== null && editProfile === 'false') {
            localStorage.setItem('editProfile', true);
            this.setState({ editProfile: true });
        } else {
            localStorage.setItem('editProfile', false);
            this.setState({ editProfile: false });
        }
    }

    render() {
        const { stripeData, userDetails, editProfile } = this.state;
        console.log("stripeData", stripeData)
        const reviewOrder = JSON.parse(stripeData.metadata.cart);
        // console.log("reviewOrder", reviewOrder)

        const options = {
            clientSecret: stripeData.client_secret,
            appearance: { theme: 'flat' },
        };

        const cart = this.props.cart;
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const fullname = userInfo.name;
        const [first, last] = fullname.split(" ");
        const { history } = this.props;


        // submit Function
        this.onSubmit = () => {
            let disCode = document.getElementById("myCoupon").value;
            // console.log(disCode);
            //this.setState({ couponCode: disCode })
            let reqBody = {};
            let user = this.authInfo.id;
            reqBody = {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 2,
                    data: "",
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc",
                },
                data: disCode,
                user_id: user,
            };

            if (disCode === "") {
                toast.error("Coupon code is blank");
            } else {
                //check isActive is true
                axios
                    .post("user/coupons/check", reqBody, {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json;charset=UTF-8",
                            Authorization: `Bearer ${this.authInfo.token}`,
                        },
                    })
                    .then((response) => {
                        this.setState({ apiData: response.data.data.coupons });
                    })
                    .catch((error) => {
                        console.log(error);
                        toast.error("This code is already used or code is not match");
                    }); //check isActive is true
            }
        }; //onSubmit()

        //getTotal();

        this.onValueChange = (event) => {
            this.setState({
                paymentType: event.target.value,
            });

            if (this.state.paymentType === "cripto") {
                this.setState({ moneyComparision: false });
                this.setState({ formStatus: false });
            }
        };

        return (
            <React.Fragment>
                {/* {loading === true ? <SpinnerLoader /> : ''} */}
                <Header />
                <PageTitle title="CheckOut" />
                <div className="inr_wrap checkout_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart my_cart">
                                    <div className="dash_inner_wrap">
                                        <Formik
                                            initialValues={{
                                                name: this.state.userDetails.name,
                                                email: this.state.userDetails.email,
                                                phone: this.state.userDetails.phone || '',
                                                address: {
                                                    street: this.state.userDetails?.address?.street || '',
                                                    city: this.state.userDetails?.address?.city || '',
                                                    state: this.state.userDetails?.address?.state || '',
                                                    country: this.state.userDetails?.address?.country || '',
                                                    zip: this.state.userDetails?.address?.zip || '',
                                                }
                                            }}
                                            validationSchema={Yup.object().shape({
                                                name: Yup.string().required("Name is required.").min(3, 'Name is too short - should be 3 chars minimum.').max(50, 'Name is too long - should be 50 chars maximum.'),
                                                email: Yup.string().email().required("Email is required."),
                                                phone: Yup.string().matches(/^[0-9]+$/, "Phone number is not valid").min(10, 'Phone number is too short').max(15, 'Phone number is too long').required("Phone is required."),
                                                address: Yup.object().shape({
                                                    street: Yup.string().required("Street is required."),
                                                    city: Yup.string().required("City is required."),
                                                    state: Yup.string().required("State is required."),
                                                    country: Yup.string().required("Country is required."),
                                                    zip: Yup.number().required("Zip code is required.").positive().integer(),
                                                })
                                            })}
                                            onSubmit={(values, { setSubmitting }) => {
                                                this.handleSubmit(values);
                                                setTimeout(() => {
                                                    setSubmitting(false);
                                                }, 400);
                                            }}
                                            enableReinitialize={true}
                                        >
                                            {({
                                                values,
                                                errors,
                                                touched,
                                                handleChange,
                                                handleBlur,
                                                handleSubmit,
                                                isValid,
                                            }) => (
                                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                    <div className="row">
                                                        <div className="col-md-12 pt-4 d-flex justify-content-between align-items-center">
                                                            <div className="dash_title">Getting Your Order</div>

                                                            <div className="">
                                                                <span>
                                                                    <Link className="btn custom_btn btn_yellow mx-auto " to="/seller/product-stock-management">
                                                                        <img src={arrow_back} alt="linked-in" />&nbsp;
                                                                        Back
                                                                    </Link>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="col-md-6">
                                                            <h5 className="font-semibold">Shipping Information</h5>
                                                            <div className="row mt-5">
                                                                <div className="col-md-6 mb-4">
                                                                    <label htmlFor="firstName" className="form-label">
                                                                        First Name <small className="text-danger">*</small>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="firstName"
                                                                        placeholder="First Name"
                                                                        value={first}
                                                                        disabled={true}
                                                                    />
                                                                </div>
                                                                <div className="col-md-6 mb-4">
                                                                    <label htmlFor="lastName" className="form-label">
                                                                        Last Name <small className="text-danger">*</small>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="lastName"
                                                                        placeholder="Last Name"
                                                                        value={last}
                                                                        disabled={true}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="mb-4">
                                                                <label htmlFor="name" className="form-label">Email <small className="text-danger">*</small></label>
                                                                <input
                                                                    type="email"
                                                                    className="form-control"
                                                                    name="email"
                                                                    placeholder="Email"
                                                                    onChange={handleChange}
                                                                    // onBlur={handleBlur}
                                                                    value={values.email}
                                                                    disabled={true}
                                                                    maxLength="50"
                                                                />
                                                                {touched.email && errors.email && (
                                                                    <small className="text-danger">{errors.email}</small>
                                                                )}
                                                            </div>

                                                            <div className="mb-4">
                                                                <label htmlFor="name" className="form-label">Phone <small className="text-danger">*</small></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="phone"
                                                                    placeholder="Phone"
                                                                    onChange={handleChange}
                                                                    // onBlur={handleBlur}
                                                                    value={values.phone}
                                                                    disabled={!editProfile}
                                                                />
                                                                {touched.phone && errors.phone && (
                                                                    <small className="text-danger">{errors.phone}</small>
                                                                )}
                                                            </div>


                                                            <div className="mb-4">
                                                                <label htmlFor="name" className="form-label">County/Region <small className="text-danger">*</small></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="address.country"
                                                                    placeholder="County/Region"
                                                                    onChange={handleChange}
                                                                    // onBlur={handleBlur}
                                                                    value={values.address.country}
                                                                    disabled={!editProfile}
                                                                />
                                                                {touched.address?.country && errors.address?.country && (
                                                                    <small className="text-danger">{errors.address.country}</small>
                                                                )}
                                                            </div>

                                                            <div className="mb-4">
                                                                <label htmlFor="name" className="form-label">Street Address <small className="text-danger">*</small></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="address.street"
                                                                    placeholder="Street Address"
                                                                    onChange={handleChange}
                                                                    // onBlur={handleBlur}
                                                                    value={values.address.street}
                                                                    disabled={!editProfile}
                                                                />
                                                                {touched.address?.street && errors.address?.street && (
                                                                    <small className="text-danger">{errors.address.street}</small>
                                                                )}
                                                            </div>

                                                            <div className="mb-4">
                                                                <label htmlFor="name" className="form-label">Town/City <small className="text-danger">*</small></label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="address.city"
                                                                    placeholder="Town/City"
                                                                    onChange={handleChange}
                                                                    // onBlur={handleBlur}
                                                                    value={values.address.city}
                                                                    disabled={!editProfile}
                                                                />
                                                                {touched.address?.city && errors.address?.city && (
                                                                    <small className="text-danger">{errors.address.city}</small>
                                                                )}
                                                            </div>

                                                            <div className="mb-4">
                                                                <label htmlFor="name" className="form-label">Zip Code <small className="text-danger">*</small></label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="address.zip"
                                                                    placeholder="Zip Code"
                                                                    onChange={handleChange}
                                                                    // onBlur={handleBlur}
                                                                    value={values.address.zip}
                                                                    disabled={!editProfile}
                                                                />
                                                                {touched.address?.zip && errors.address?.zip && (
                                                                    <small className="text-danger">{errors.address.zip}</small>
                                                                )}
                                                            </div>


                                                            <div className="form-group text-center mb-4">
                                                                {editProfile ? (
                                                                    <div>
                                                                        <button type="submit" className="btn custom_btn btn_yellow_bordered">Save</button>
                                                                        <button type="button" className="btn custom_btn btn_yellow_bordered ms-2" onClick={this.handleEdit}>Cancel</button>
                                                                    </div>
                                                                ) : (
                                                                    <button type="button" className="btn custom_btn btn_yellow_bordered" onClick={this.handleEdit}>Click to Update</button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* ******************************************PAYMENT FORM ********************************** */}
                                                        <div className="col-md-6">
                                                            <h5 className="text-md font-semibold mb-4 text-center">Review Your Order</h5>
                                                            <div className="checkout_cart_element mt-2">
                                                                <div className="mb-5">
                                                                    {reviewOrder.map((item, index) => (
                                                                        <div className="d-flex justify-content-between align-items-center border-bottom py-2">
                                                                            <div className="product-data text-start">
                                                                                {/* <h6 className="mb-1">{`${index + 1}) ${item.name}`}</h6> */}
                                                                                <h6 className="mb-1">{`${index + 1}) ${item.name.split(' ').slice(0, 4).join(' ')}${item.name.split(' ').length > 4 ? '...' : ''}`}</h6>
                                                                            </div>
                                                                            {/* <div className="product-quantity text-start">
                                                                                <h6 className="mb-1">{`x`}</h6>
                                                                            </div> */}
                                                                            <div className="product-quantity text-end">
                                                                                <h6 className="mb-1"><b>{`${item.quantity}`}</b> qty.</h6>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <div className="cart_footer cart_wrap border-bottom">
                                                                        <div className="cart_foot_price">
                                                                            <div className="cfp"><span>Total Item</span> <b>{reviewOrder.length}</b></div>
                                                                            <div className="cfp"><span>Subtotal </span> <b>{`$${stripeData.amount / 100}`}</b></div>
                                                                            <div className="cfp"><span>Tax </span> <b></b></div>
                                                                            <div className="cfp"><span>Grand Total</span> <b>{`$${stripeData.amount / 100}`}</b></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mb-4">
                                                                    <Elements options={options} stripe={stripePromise} >
                                                                        <CheckoutForm />
                                                                    </Elements>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}
//export default CheckOut;
const mapStateToProps = (state) => {
    return {
        cart: state.cart.cart,
    };
};

export default connect(mapStateToProps)(CheckOut);
