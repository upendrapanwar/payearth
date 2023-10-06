import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
function Total() {

    const cart = useSelector((state) => state.cart.cart)
  
    const getTotal = () => {
      let totalQuantity = 0
      let totalPrice = 0
      cart.forEach(item => {
        totalQuantity += item.quantity
        totalPrice += item.price * item.quantity
      })
      return {totalPrice, totalQuantity}
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
                  <Link className="btn custom_btn btn_yellow" to="/checkout">Place Order</Link>
              </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Total