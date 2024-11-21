import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { setIsLoginModalOpen } from "../../../store/reducers/global-reducer";
import { toast } from "react-toastify";
import axios from "axios";

function Total() {
  // const [price, setTotalPrice] = useState('')
  const dispatch = useDispatch();
  const history = useHistory();
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const cart = useSelector((state) => state.cart.cart)
  // console.log("cart", cart)
  const getTotal = () => {
    let totalQuantity = 0
    let totalPrice = 0
    cart.forEach(item => {
      totalQuantity += item.quantity
      totalPrice += item.price * item.quantity
    })
    return { totalPrice, totalQuantity }
  }

  const handleCheckout = () => {
    let reqBody = {
      "amount": getTotal().totalPrice,
      "quantity": getTotal().totalQuantity,
      "name": userInfo.name,
      "email": userInfo.email,
      "cart": cart
    };
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
        <div className="ctn_btn"><Link to="/" className="view_more">Continue shopping</Link></div>
        <div className="cart_foot_price">
          <div className="cfp"><span>Price ({getTotal().totalQuantity} items)</span> <b>${getTotal().totalPrice}</b></div>
          <div className="cfp"><span>Discount</span> <b>0000 BTC</b></div>
          <div className="cfp"><span>Delivery Charges</span> <b>Free</b></div>
        </div>
      </div>
      <div className="cart_footer cart_wrap border-bottom justify-content-end">
        <div className="cart_foot_price">
          <div className="cfp"><span>Sub Total</span> <b>${getTotal().totalPrice}</b></div>

          <div className="cfp mt-4">
            <Link className="btn custom_btn btn_yellow"
              to="#"
              onClick={openmodalHandler}
            >
              Place Order
            </Link>
            {/* <button className="btn custom_btn btn_yellow" onClick={openmodalHandler}>Place Order</button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Total