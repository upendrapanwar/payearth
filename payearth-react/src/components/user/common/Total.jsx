import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { setIsLoginModalOpen } from "../../../store/reducers/global-reducer";
import { toast } from "react-toastify";
// check-symbol
import axios from "axios";

function Total(data) {
  const dispatch = useDispatch();
  const history = useHistory();
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const couponData = data.couponData;
  const cart = useSelector((state) => state.cart.cart)
  console.log("data", data)
  const getTotal = () => {
    let totalQuantity = 0
    let totalPrice = 0
    cart.forEach(item => {
      totalQuantity += item.quantity
      totalPrice += item.price * item.quantity
    })
    return { totalPrice, totalQuantity }
  }

  const amount = couponData !== null ? `${getTotal().totalPrice - getTotal().totalPrice * couponData.discount_per / 100}` : `${getTotal().totalPrice}`;
  const finalAmount = parseFloat(amount);

  const additionalData = {
    "finalAmount": finalAmount,
    "discount": couponData !== null ? `${getTotal().totalPrice * couponData.discount_per / 100}` : "0",
    "deliveryCharge": "0",
    "taxAmount": "0",
  }

  const handleCheckout = () => {
    let reqBody = {
      "amount": finalAmount,
      "quantity": getTotal().totalQuantity,
      "name": userInfo.name,
      "email": userInfo.email,
      "cart": cart,
      "additionalData": additionalData
    };

    console.log("reqBody", reqBody)
    axios.post("user/createPaymentIntent/", reqBody, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${authInfo.token}`,
      },
    })
      .then((response) => {
        if (response.data.status === true) {
          const data = response.data.data
          console.log("data", data)
          history.push({
            pathname: '/orderCheckout',
            state: data,
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.status === false) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setTimeout(() => {
          // dispatch(setLoading({ loading: false }));
        }, 300);
      });
  };

  const openmodalHandler = async () => {
    if (authInfo === null) {
      toast.error("Buyer login failed....");
      setTimeout(() => {
        dispatch(setIsLoginModalOpen({ isLoginModalOpen: true }));
        document.body.style.overflow = "hidden";
      }, 2000);
    } else {
      handleCheckout()
    };
  }


  return (
    <div>
      <div className="cart_footer cart_wrap border-bottom">
        {/* <div className="ctn_btn"><Link to="/" className="view_more">Continue shopping</Link></div> */}
        <div className="cart_foot_price">
          <div className="cfp"><span>Price ({getTotal().totalQuantity} items)</span> <b>${getTotal().totalPrice}</b></div>
          <div className="cfp"><span>Discount</span> <b>{couponData !== null ? `${couponData.discount_per}%` : 'No Discount'}</b> </div>
          {/* <div className="cfp"><span>Discount</span> <b>{couponData && couponData.discount_per !== undefined && couponData.discount_per !== null ? `${couponData.discount_per}%` : '0%'}</b></div> */}
          <div className="cfp"><span>Final Price</span> <b>{`$${amount}`}</b></div>
          {/* <div className="cfp"><span>Final Price</span><b>{amount && !isNaN(amount) ? `$${amount}` : '$0'}</b></div> */}
          <div className="cfp"><span>Delivery Charges</span> <b>Free</b></div>
        </div>
      </div>
      <div className="cart_footer cart_wrap border-bottom justify-content-end">
        <div className="cart_foot_price">
          <div className="cfp"><span>Sub Total</span> <b>{`$${amount}`}</b></div>
          <div className="cfp mt-4 text-center">
            <div className="d-grid col-6 mx-auto">
              <button className="btn custom_btn btn_yellow m-2"
                onClick={openmodalHandler}
              >
                Place Order
              </button>
            </div>
            <br /> OR
            <div className="ctn_btn m-4">
              <Link to="/" className="view_more">Continue shopping</Link>
            </div>
            {/* <button className="btn custom_btn btn_yellow" onClick={openmodalHandler}>Place Order</button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Total