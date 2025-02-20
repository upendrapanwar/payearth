// import React, { useEffect } from "react";
// import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useHistory } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { setIsLoginModalOpen } from "../../../store/reducers/global-reducer";
// import { toast } from "react-toastify";
// // check-symbol
// import axios from "axios";

// function Total(data) {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const authInfo = JSON.parse(localStorage.getItem("authInfo"));
//   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   const couponData = data.couponData;
//   const cart = useSelector((state) => state.cart.cart)
//   console.log("data", data)
//   console.log("cart", cart)

//   // const getTotal = () => {
//   //   let totalQuantity = 0
//   //   let totalPrice = 0
//   //   cart.forEach(item => {
//   //     totalQuantity += item.quantity
//   //     totalPrice += item.price * item.quantity
//   //   })
//   //   return { totalPrice, totalQuantity }
//   // }

//   const getTotal = async () => {
//     let totalQuantity = 0;
//     let totalPrice = 0;

//     for (const item of cart) {
//       let finalPrice = item.price;

//       if (item.discountId) {
//         // API call to check if the discount is active
//         try {
//           const response = await axios.get(`front/discount-status/${item.discountId}`); 
//           const data = await response.data.data;
//           console.log('Discount Status---intotal--:', response.data.data);
//           if(data.isActive === true){
//             finalPrice = item.price - (item.price * data.discount) / 100;
//         }
//         // else{
//         //   finalPrice = item.price - (item.price * discountData.percent) / 100;
//         // }
//         } catch (error) {
//           console.error('Error fetching discount status:', error);
//         }

//       }

//       totalQuantity += item.quantity;
//       totalPrice += finalPrice * item.quantity;
//       //console.log('totalPrice----',totalPrice)
//       //console.log('totalQuantity----',totalQuantity)
//     }
//     console.log('totalPrice----',totalPrice)
//     console.log('totalQuantity----',totalQuantity)

//     return { totalPrice: totalPrice.toFixed(2), totalQuantity };
//   };


//   const amount = couponData !== null ? `${getTotal().totalPrice - getTotal().totalPrice * couponData.discount_per / 100}` : `${getTotal().totalPrice}`;
//   const finalAmount = parseFloat(amount);

//   const additionalData = {
//     "finalAmount": finalAmount,
//     "discount": couponData !== null ? `${getTotal().totalPrice * couponData.discount_per / 100}` : "0",
//     "deliveryCharge": "0",
//     "taxAmount": "0",
//   }

//   const handleCheckout = () => {
//     let reqBody = {
//       "amount": finalAmount,
//       "quantity": getTotal().totalQuantity,
//       "name": userInfo.name,
//       "email": userInfo.email,
//       "cart": cart,
//       "additionalData": additionalData
//     };

//     console.log("reqBody", reqBody)
//     axios.post("user/createPaymentIntent/", reqBody, {
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json;charset=UTF-8",
//         Authorization: `Bearer ${authInfo.token}`,
//       },
//     })
//       .then((response) => {
//         if (response.data.status === true) {
//           const data = response.data.data
//           console.log("data", data)
//           history.push({
//             pathname: '/orderCheckout',
//             state: data,
//           });
//         }
//       })
//       .catch((error) => {
//         if (error.response && error.response.data.status === false) {
//           toast.error(error.response.data.message);
//         }
//       })
//       .finally(() => {
//         setTimeout(() => {
//           // dispatch(setLoading({ loading: false }));
//         }, 300);
//       });
//   };

//   const openmodalHandler = async () => {
//     if (authInfo === null) {
//       toast.error("Buyer login failed....");
//       setTimeout(() => {
//         dispatch(setIsLoginModalOpen({ isLoginModalOpen: true }));
//         document.body.style.overflow = "hidden";
//       }, 2000);
//     } else {
//       handleCheckout()
//     };
//   }


//   return (
//     <div>
//       <div className="cart_footer cart_wrap border-bottom">
//         {/* <div className="ctn_btn"><Link to="/" className="view_more">Continue shopping</Link></div> */}
//         <div className="cart_foot_price">
//           <div className="cfp"><span>Price ({getTotal().totalQuantity} items)</span> <b>${getTotal().totalPrice}</b></div>
//           <div className="cfp"><span>Discount</span> <b>{couponData !== null ? `${couponData.discount_per}%` : 'No Discount'}</b> </div>
//           {/* <div className="cfp"><span>Discount</span> <b>{couponData && couponData.discount_per !== undefined && couponData.discount_per !== null ? `${couponData.discount_per}%` : '0%'}</b></div> */}
//           <div className="cfp"><span>Final Price</span> <b>{`$${amount}`}</b></div>
//           {/* <div className="cfp"><span>Final Price</span><b>{amount && !isNaN(amount) ? `$${amount}` : '$0'}</b></div> */}
//           <div className="cfp"><span>Delivery Charges</span> <b>Free</b></div>
//         </div>
//       </div>
//       <div className="cart_footer cart_wrap border-bottom justify-content-end">
//         <div className="cart_foot_price">
//           <div className="cfp"><span>Sub Total</span> <b>{`$${amount}`}</b></div>
//           <div className="cfp mt-4 text-center">
//             <div className="d-grid col-6 mx-auto">
//               <button className="btn custom_btn btn_yellow m-2"
//                 onClick={openmodalHandler}
//               >
//                 Place Order
//               </button>
//             </div>
//             <br /> OR
//             <div className="ctn_btn m-4">
//               <Link to="/" className="view_more">Continue shopping</Link>
//             </div>
//             {/* <button className="btn custom_btn btn_yellow" onClick={openmodalHandler}>Place Order</button> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Total



import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { setIsLoginModalOpen } from "../../../store/reducers/global-reducer";
import { toast } from "react-toastify";
import axios from "axios";

function Total({ couponData }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const cart = useSelector((state) => state.cart.cart);

  const [total, setTotal] = useState({
    totalPrice: 0,
    totalQuantity: 0,
    actualPrice: 0,
    dealDiscountAmount: 0,  // To store only the deal discount amount
  });

  const [userDataAvailable, setUserDataAvailable] = useState(false)

  useEffect(() => {
    if (authInfo) {
      getUserData();
    }
  }, [])

  useEffect(() => {
    const calculateTotal = async () => {
      let totalQuantity = 0;
      let totalPrice = 0;
      let actualPrice = 0;
      let dealDiscountAmount = 0;

      for (const item of cart) {
        let finalPrice = item.price;

        if (item.discountId) {
          try {
            const response = await axios.get(`front/discount-status/${item.discountId}`);
            const data = response.data.data;
            if (data.isActive) {
              finalPrice = item.price - (item.price * data.discount) / 100;
              dealDiscountAmount += (item.price - finalPrice) * item.quantity;  // Add only item-level discount
            }
          } catch (error) {
            console.error("Error fetching discount status:", error);
          }
        }

        totalQuantity += item.quantity;
        totalPrice += finalPrice * item.quantity;
        actualPrice += item.price * item.quantity;
      }

      setTotal({
        totalPrice: totalPrice.toFixed(2),
        totalQuantity,
        actualPrice: actualPrice.toFixed(2),
        dealDiscountAmount: dealDiscountAmount.toFixed(2),  // Set the deal discount amount
      });
    };

    calculateTotal();
  }, [cart, couponData]);

  const amount = couponData !== null ? (total.totalPrice - total.totalPrice * couponData.discount_per / 100).toFixed(2) : total.totalPrice;
  const taxRate = 0.05; // 5% tax
  const finalAmount = (parseFloat(amount) + parseFloat(amount) * taxRate).toFixed(2);
  const additionalData = { finalAmount, discount: couponData ? (total.totalPrice * couponData.discount_per / 100).toFixed(2) : "0", deliveryCharge: "0", taxAmount: "0", };

  const handleCheckout = () => {
    const reqBody = {
      amount: finalAmount,
      quantity: total.totalQuantity,
      name: userInfo.name,
      email: userInfo.email,
      cart,
      additionalData,
    };

    axios
      .post("user/createPaymentIntent/", reqBody, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${authInfo.token}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          history.push({
            pathname: "/orderCheckout",
            state: response.data.data,
          });
        }
      })
      .catch((error) => {
        if (error.response?.data?.status === false) {
          toast.error(error.response.data.message);
        }
      });
  };

  const getUserData = () => {
    const userId = authInfo.id
    axios.get('user/my-profile/' + userId, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${authInfo.token}`
      }
    }).then((response) => {
      if (response.data.status) {
        let resData = response.data.data;
        // console.log("resData", resData)
        // this.setState({
        //   userDetails: resData,
        // });

        const isValid = resData?.name &&
          resData?.email &&
          resData?.phone &&
          resData?.address?.street &&
          resData?.address?.city &&
          resData?.address?.state &&
          resData?.address?.country &&
          resData?.address?.zip;

        if (isValid) {
          setUserDataAvailable(true)
        } else {
          setUserDataAvailable(false)
          console.log("Some fields are missing. User data set to false.");
        }
      }
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      setTimeout(() => {
        // dispatch(setLoading({ loading: false }));
      }, 300);
    });
  }

  const openmodalHandler = () => {
    if (!authInfo) {
      toast.error("Buyer login failed...");
      dispatch(setIsLoginModalOpen({ isLoginModalOpen: true }));
      document.body.style.overflow = "hidden";
    } else {
      handleCheckout();
    }
  };

  console.log("userDataAvailable", userDataAvailable)

  return (
    <div>
      <div className="cart_footer cart_wrap border-bottom">
        <div className="cart_foot_price">
          <div className="cfp">
            <span>Price ({total.totalQuantity} items)</span>
            <b>${total.actualPrice}</b>
          </div>
          <div className="cfp">
            <span>Deal Discount</span>
            <b>${total.dealDiscountAmount}</b> {/* Show only the deal discount */}
          </div>
          <div className="cfp">
            <span>Coupon Discount</span>
            <b>{couponData ? `${couponData.discount_per}%` : "No Discount"}</b>
          </div>
          <div className="cfp">
            <span>Final Price</span>
            <b>${amount}</b>
          </div>
          <div className="cfp">
            <span>Delivery Charges</span>
            <b>Free</b>
          </div>
          <div className="cfp">
            <span>Tax</span>
            <b>5%</b>
          </div>
        </div>
      </div>
      <div className="cart_footer cart_wrap border-bottom justify-content-end">
        <div className="cart_foot_price">
          <div className="cfp">
            <span>Sub Total</span>
            <b>${finalAmount}</b>
          </div>
          {authInfo ? (

            <div className="cfp mt-4 text-center">
              {userDataAvailable === true ? ''
                :
                <div class="alert alert-danger" role="alert">
                  Profile update required! Complete your details to proceed with your order.
                </div>}
              <div className="d-grid col-6 mx-auto">

                {userDataAvailable === true ?
                  <button className="btn custom_btn btn_yellow m-2" onClick={openmodalHandler}>
                    Place Order
                  </button>
                  :
                  <Link className="btn custom_btn btn_yellow m-2" to="/my-profile">Complete Profile</Link>
                }
                {/* <button className="btn custom_btn btn_yellow m-2" onClick={openmodalHandler}>
                Place Order
              </button> */}
              </div>
              <br /> OR
              <div className="ctn_btn m-4">
                <Link to="/" className="view_more">
                  Continue shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="cfp mt-4 text-center">
                <div class="alert alert-danger" role="alert">
                  Login required! Login to proceed with your order.
                </div>
              {/* <div className="d-grid col-6 mx-auto">
                  <Link className="btn custom_btn btn_yellow m-2" to="/my-profile">Login</Link>
              </div> */}
              <br /> OR
              <div className="ctn_btn m-4">
                <Link to="/" className="view_more">
                  Continue shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Total;


