import React from "react";
import { Link } from "react-router-dom";
import { incrementQuantity, decrementQuantity, removeItem } from "../../../store/reducers/cart-slice-reducer";
import { setLoading, setIsLoginModalOpen } from '../../../store/reducers/global-reducer';
import {setSelectedSavedItems} from "../../../store/reducers/savelaterlist-reducer";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";

function CartItem({id, image, title, price, quantity}) {
    const dispatch = useDispatch()
    const authInfo = useSelector(state => state.auth.authInfo);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const addToSaveLaterlist = productId => {
      
      if (isLoggedIn) {
          let reqBody = {
              user_id: authInfo.id,
              product_id: productId
          };
          let selectedSaveLaterItemsCopy;
          selectedSaveLaterItemsCopy = localStorage.getItem('selectedSaveLaterItems') ? JSON.parse(localStorage.getItem('selectedSaveLaterItems')) : [];
          axios.post('user/savelater/', reqBody, {
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization': `Bearer ${authInfo.token}`
              }
          }).then(response => {
              
              
              if (response.data.status) {
                
                selectedSaveLaterItemsCopy.push(response.data.data.productId);
                
                localStorage.setItem('selectedSaveLaterItems', JSON.stringify(selectedSaveLaterItemsCopy));
                  
                  dispatch(setSelectedSavedItems({selectedSaveLaterItems: selectedSaveLaterItemsCopy}));
                  toast.dismiss();
                  
                  toast.success(response.data.message);
              }
          }).catch(error => {
            
              if(error.response && error.response.data.status === false) {
                  toast.error(error.response.data.message);
              }
          }).finally(() => {
            
              setTimeout(() => {
                  dispatch(setLoading({loading: false}));
              }, 300);
          });
      } else {
        dispatch(setIsLoginModalOpen({isLoginModalOpen: true}));
      }
  }
    return (
      <div className="cl_items">
          <div className="cl_pro_info">
            <div className="clp_item">
              <div className="clp_item_img"><img className="cartItem__image" src={image} alt='item'/></div>
              <div className="clp_item_info">
                <ul className="rating">
                  <li className="star rated"></li>
                  <li className="star rated"></li>
                  <li className="star rated"></li>
                  <li className="star rated"></li>
                  <li className="star "></li>
                </ul>
                <div className="cl_pro_name">{title}</div>
                <div className="cl_pro_price"><span className="cl_op">
                  <small>$</small>
                  <strong>{price}</strong></span>
                </div>
                <div>
                  <Link className="btn custom_btn btn_yellow_bordered" to="#" onClick={() => addToSaveLaterlist(id)}
>Save for later</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="cl_pro_qty">
            <div className="qnty_select">
              <div className="input-group">
                <button onClick={() => dispatch(incrementQuantity(id))} className="btn btn-outline-secondary" type="button" id="button-addon1">
                  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0)">
                      <path d="M7.31107 5.81393V0.125H5.68893V5.81393H0V7.43607H5.68893V13.125H7.31107V7.43607H13V5.81393H7.31107Z" fill="black"/>
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width="13" height="13" fill="white" transform="translate(0 0.125)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <input type="text" className="form-control" placeholder="3" aria-label="Example text with button addon" aria-describedby="button-addon1" value={quantity}/>
                <button onClick={() => dispatch(decrementQuantity(id))} className="btn btn-outline-secondary" type="button" id="button-addon2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0)">
                      <path d="M7.81107 5.814L6.18893 5.81396L0.5 5.814V7.43615H6.18893H7.81107H13.5V5.814H7.81107Z" fill="black"/>
                    </g>
                    <defs>
                      <clipPath id="clip0">
                        <rect width="13" height="13" fill="white" transform="translate(0.5 0.125)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="cl_pro_total">
            <span>${price * quantity}</span>
          </div>
          <div className="cl_pro_btn">
            <Link to="#" onClick={() => dispatch(removeItem(id))}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.2188 2.75H14.4375V2.0625C14.4375 0.925246 13.5123 0 12.375 0H9.625C8.48775 0 7.5625 0.925246 7.5625 2.0625V2.75H3.78125C2.83353 2.75 2.0625 3.52103 2.0625 4.46875V6.875C2.0625 7.25467 2.37033 7.5625 2.75 7.5625H3.12572L3.71968 20.0356C3.77214 21.1371 4.67706 22 5.77981 22H16.2202C17.323 22 18.2279 21.1371 18.2803 20.0356L18.8743 7.5625H19.25C19.6297 7.5625 19.9375 7.25467 19.9375 6.875V4.46875C19.9375 3.52103 19.1665 2.75 18.2188 2.75ZM8.9375 2.0625C8.9375 1.68343 9.24593 1.375 9.625 1.375H12.375C12.7541 1.375 13.0625 1.68343 13.0625 2.0625V2.75H8.9375V2.0625ZM3.4375 4.46875C3.4375 4.27921 3.59171 4.125 3.78125 4.125H18.2188C18.4083 4.125 18.5625 4.27921 18.5625 4.46875V6.1875C18.3506 6.1875 4.31548 6.1875 3.4375 6.1875V4.46875ZM16.9069 19.9702C16.8894 20.3374 16.5877 20.625 16.2202 20.625H5.77981C5.41221 20.625 5.11057 20.3374 5.09313 19.9702L4.50227 7.5625H17.4977L16.9069 19.9702Z" fill="#FF0E0E"/>
              <path d="M11 19.25C11.3797 19.25 11.6875 18.9422 11.6875 18.5625V9.625C11.6875 9.24533 11.3797 8.9375 11 8.9375C10.6203 8.9375 10.3125 9.24533 10.3125 9.625V18.5625C10.3125 18.9422 10.6203 19.25 11 19.25Z" fill="#FF0E0E"/>
              <path d="M14.4375 19.25C14.8172 19.25 15.125 18.9422 15.125 18.5625V9.625C15.125 9.24533 14.8172 8.9375 14.4375 8.9375C14.0578 8.9375 13.75 9.24533 13.75 9.625V18.5625C13.75 18.9422 14.0578 19.25 14.4375 19.25Z" fill="#FF0E0E"/>
              <path d="M7.5625 19.25C7.94217 19.25 8.25 18.9422 8.25 18.5625V9.625C8.25 9.24533 7.94217 8.9375 7.5625 8.9375C7.18283 8.9375 6.875 9.24533 6.875 9.625V18.5625C6.875 18.9422 7.18279 19.25 7.5625 19.25Z" fill="#FF0E0E"/>
            </svg>
          </Link>
        </div>  
      </div>
      
    )
  }
  
  export default CartItem