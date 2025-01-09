import React, { Component, useRef } from "react";
import Header from "../../components/user/common/Header";
import PageTitle from "../../components/user/common/PageTitle";
import Footer from "../../components/common/Footer";
import { connect } from "react-redux";
import axios from "axios";
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import { Box, Text } from "rebass";
import styled from "styled-components";
import { toast } from "react-toastify";
import store from "../../store/index";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// import InjectedCheckoutForm from "./InjectedCheckoutForm";
import InjectedCheckoutForm from "./productCheckout";
const stripePromise = loadStripe(`${process.env.REACT_APP_PUBLISHABLE_KEY}`);

class CheckOut extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef;
    this.authInfo = store.getState().auth.authInfo;
    this.state = {
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
      clientSecret: this.props.location.state || {},
      appearance: { theme: 'stripe' }
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
    console.log(res.data.data);
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
    //document.getElementsByClassName("sc-htpNat")[0].style.display = "none";
    //document.getElementsByClassName("sc-htpNat")[0].closest("div").style.display = "none";
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

  render() {
    const { clientSecret, appearance } = this.state;
    console.log("clientSecret", clientSecret)
    const cart = this.props.cart;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const fullname = userInfo.name;
    const [first, last] = fullname.split(" ");
    const { history } = this.props;

    // submit Function
    this.onSubmit = () => {
      let disCode = document.getElementById("myCoupon").value;
      console.log(disCode);
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
        {/* <Helmet>
          <title>{"Checkout - Pay Earth"}</title>
        </Helmet> */}
        <section className="inr_wrap checkout_wrap">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="cart my_cart">

                  {/* Start coupon code */}
                  <div className="cart_wrap">
                    <div className="items_incart">
                      <span>
                        have a coupons <a href="/">Click here to have</a>
                      </span>
                    </div>
                    <div className="cart_wrap">
                      <div className="checkout_cart_wrap">
                        <p>IF YOU HAVE A COUPON CODE,PLEASE APPLY IT BELOW </p>
                        <div className="input-group d-flex">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your coupons code"
                            aria-label="Example text with button addon"
                            id="myCoupon"
                          />
                          <button
                            className="btn custom_btn btn_yellow"
                            type="button"
                            onClick={this.onSubmit}
                          >
                            {" "}
                            Apply coupns code
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End coupon code */}

                  <div className="row">
                    <div className="col-md-8">
                      <div
                        style={{ padding: "0px 0px 0px 25px" }}
                        className="checkout_form_section"
                      >
                        <div className="items_incart">
                          <h4>BILLING DETAILS</h4>
                        </div>
                        <div className="checkout-form">
                          <form
                            id="frmCheckoutHandle"
                            onSubmit={this.onSubmitHandler}
                          >
                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div className="form_field">
                                  <label htmlFor="">
                                    First Name <span>*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="billingFirstName"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                              <div className="input-group ">
                                <div className="form_field">
                                  <label htmlFor="">
                                    Last Name<span>*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="billingLastName"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div
                                  className="form_field"
                                  style={{ width: "76%" }}
                                >
                                  <label htmlFor="">
                                    Company Name(optional)
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="billingCompanyName"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div
                                  className="form_field"
                                  style={{ width: "76%" }}
                                >
                                  <label htmlFor="">
                                    County/Region<span>*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="billingCounty"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div
                                  className="form_field"
                                  style={{ width: "76%" }}
                                >
                                  <label htmlFor="">
                                    Street Address <span>*</span>
                                  </label>
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="billingStreetAddress"
                                    placeholder="House number and street number"
                                    style={{ marginBottom: "15px" }}
                                    onChange={this.onChange.bind(this)}
                                  />
                                  <br />
                                  <input
                                    className="form-control"
                                    type="text"
                                    name="billingStreetAddress1"
                                    placeholder="House number"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div
                                  className="form_field"
                                  style={{ width: "76%" }}
                                >
                                  <label htmlFor="">
                                    Town/City<span>*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="billingCity"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div
                                  className="form_field"
                                  style={{ width: "76%" }}
                                >
                                  <label htmlFor="">Country(Optional)</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="billingCountry"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div
                                  className="form_field"
                                  style={{ width: "76%" }}
                                >
                                  <label htmlFor="">
                                    Postcode<span>*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="billingPostCode"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div
                                  className="form_field"
                                  style={{ width: "76%" }}
                                >
                                  <label htmlFor="">
                                    Phone<span>*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    className="form-control"
                                    name="billingPhone"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div
                                  className="form_field"
                                  style={{ width: "76%" }}
                                >
                                  <label htmlFor="">
                                    Email<span>*</span>
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    name="billingEmail"
                                    onChange={this.onChange.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="checkout_form_wrapper">
                              <div className="input-group ">
                                <div
                                  className="form_field"
                                  style={{ width: "76%" }}
                                >
                                  <label htmlFor="">
                                    Note<span>*</span>
                                  </label>
                                  <textarea
                                    name="billingNote"
                                    className="form-control"
                                    placeholder="Note about your oder"
                                    id=""
                                    cols="30"
                                    rows="10"
                                    onChange={this.onChange.bind(this)}
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <button id="frmcheckout" type="submit">
                              Place Order
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="payment_method_section">
                        <div className="payment_list">
                          <ul>
                            <li>
                              Price({this.getTotal().totalQuantity}) :{" "}
                              {this.getTotal().totalPrice}${" "}
                            </li>
                            <li>Tax(18%) : {this.getTotal().tax}$ </li>
                            <li>Discount : {this.getTotal().discount}$ </li>
                            <li>Delivery Charges: 0$ </li>
                          </ul>
                        </div>
                        <div className="subtotal_wrapper">
                          <ul>
                            <li>Subtotal : {this.getTotal().totalAmmount}$</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="inr_wrap checkout_wrap">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="cart my_cart">
                  <div className="dash_inner_wrap">
                    <Formik
                      initialValues={{ name: '', category: "", subCategory: "", brand: "", description: '', specifications: '', price: '', featuredImg: '' }}
                    // onSubmit={values => this.handleSubmit(values)}
                    // validationSchema={addProductSchema}
                    >
                      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, }) => (
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                          <div className="row">
                            <div className="col-md-12 pt-4 d-flex justify-content-between align-items-center">
                              <div className="dash_title">BILLING DETAILS</div>
                              <div className="">
                                <span>
                                  <Link className="btn custom_btn btn_yellow mx-auto " to="/seller/product-stock-management">
                                    {/* <img src={arrow_back} alt="linked-in" />&nbsp; */}
                                    Back
                                  </Link>
                                </span>
                              </div>
                            </div>

                            <div className="cart_wrap mb-5">
                              <div className="items_incart d-flex justify-content-center align-items-center">
                                <span>have a coupons <a href="/">Click here to have</a> </span>
                              </div>
                              <div className="cart_wrap">
                                <div className="checkout_cart_wrap">
                                  <p>IF YOU HAVE A COUPON CODE,PLEASE APPLY IT BELOW </p>
                                  <div className="input-group d-flex">
                                    <input type="text" className="form-control" placeholder="Enter your coupons code" aria-label="Example text with button addon" id="myCoupon" />
                                    <button className="btn custom_btn btn_yellow" type="button"
                                    // onClick={this.onSubmit}
                                    >
                                      {" "}
                                      Apply coupns code
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="row">
                                <div className="col-md-6 mb-4">
                                  <label htmlFor="firstName" className="form-label">
                                    First Name <small className="text-danger">*</small>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="firstName"
                                    placeholder="First Name"
                                  // onChange={handleChange}
                                  // onBlur={handleBlur}
                                  // value={values.firstName}
                                  />
                                  {/* {touched.firstName && errors.firstName ? (
                                      <small className="text-danger">{errors.firstName}</small>
                                        ) : null} */}
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
                                  // onChange={handleChange}
                                  // onBlur={handleBlur}
                                  // value={values.lastName}
                                  />
                                  {/* {touched.lastName && errors.lastName ? (
                                      <small className="text-danger">{errors.lastName}</small>
                                    ) : null} */}
                                </div>
                              </div>

                              <div className="mb-4">
                                <label htmlFor="name" className="form-label">Company Name {'(Optional)'} </label>
                                <input type="text" className="form-control"
                                  name="name"
                                  placeholder="Company Name"
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // value={values.name}
                                />
                                {/* {touched.name && errors.name ? (
                                  <small className="text-danger">{errors.name}</small>
                                ) : null} */}
                              </div>

                              <div className="mb-4">
                                <label htmlFor="name" className="form-label">County/Region <small className="text-danger">*</small></label>
                                <input type="text" className="form-control"
                                  name="name"
                                  placeholder="County/Region"
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // value={values.name}
                                />
                                {/* {touched.name && errors.name ? (
                                  <small className="text-danger">{errors.name}</small>
                                ) : null} */}
                              </div>

                              <div className="mb-4">
                                <label htmlFor="name" className="form-label">Street Address <small className="text-danger">*</small></label>
                                <input type="text" className="form-control"
                                  name="name"
                                  placeholder="Street Address"
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // value={values.name}
                                />
                                {/* {touched.name && errors.name ? (
                                  <small className="text-danger">{errors.name}</small>
                                ) : null} */}
                              </div>

                              <div className="mb-4">
                                <label htmlFor="name" className="form-label">Town/City <small className="text-danger">*</small></label>
                                <input type="text" className="form-control"
                                  name="name"
                                  placeholder="Town/City"
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // value={values.name}
                                />
                                {/* {touched.name && errors.name ? (
                                  <small className="text-danger">{errors.name}</small>
                                ) : null} */}
                              </div>

                              <div className="mb-4">
                                <label htmlFor="name" className="form-label">Postcode <small className="text-danger">*</small></label>
                                <input type="text" className="form-control"
                                  name="name"
                                  placeholder="Postcode"
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // value={values.name}
                                />
                                {/* {touched.name && errors.name ? (
                                  <small className="text-danger">{errors.name}</small>
                                ) : null} */}
                              </div>

                              <div className="mb-4">
                                <label htmlFor="name" className="form-label">Phone <small className="text-danger">*</small></label>
                                <input type="text" className="form-control"
                                  name="name"
                                  placeholder="Phone"
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // value={values.name}
                                />
                                {/* {touched.name && errors.name ? (
                                  <small className="text-danger">{errors.name}</small>
                                ) : null} */}
                              </div>

                              <div className="mb-4">
                                <label htmlFor="name" className="form-label">Email <small className="text-danger">*</small></label>
                                <input type="text" className="form-control"
                                  name="name"
                                  placeholder="Email"
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                // value={values.name}
                                />
                                {/* {touched.name && errors.name ? (
                                  <small className="text-danger">{errors.name}</small>
                                ) : null} */}
                              </div>
                            </div>

                            {/* ******************************************PAYMENT FORM ********************************** */}
                            <div className="col-md-6">
                              <div className="mb-4">
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                  <InjectedCheckoutForm />
                                </Elements>
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
