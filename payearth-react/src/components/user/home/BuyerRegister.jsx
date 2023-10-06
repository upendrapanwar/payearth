import React from 'react';
import { Link } from 'react-router-dom';
import invisibleIcon from './../../../assets/icons/invisible-icon.svg';
import googleLogo from './../../../assets/images/google-logo.png';
import fbLogo from './../../../assets/images/fb-logo.png';
import instagramLogo from './../../../assets/images/instagram-logo.png';
import buyerLogin from './../../../assets/images/buyer-login.jpg';

const BuyerRegister = () => {
    return(
        <div className="modal fade" id="buyerRegisterModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="form_wrapper">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div>
                            <h4 className="h4">Buyer register</h4>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name<small>*</small></label>
                                    <input type="email" className="form-control" id="name" aria-describedby="nameHelp" required="required" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email ID<small>*</small></label>
                                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" required="required" />
                                </div>
                                <div className="pwd_wrapper mb-3">
                                    <label htmlFor="password" className="form-label">Password<small>*</small></label>
                                    <input type="password" className="form-control" id="password" required="required" />
                                    <img src={invisibleIcon} alt="invisible-icon" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Want to purchase in?</label>
                                    <div className="radio_wrapper">
                                        <label className="radio-container">Retail
                                            <input type="radio" name="radio" />
                                            <span className="radio-checkmark"></span>
                                        </label>
                                        <label className="radio-container">Wholesale
                                            <input type="radio" name="radio" />
                                            <span className="radio-checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" className="btn custom_btn btn_yellow text-uppercase">Register</button>
                            </form>
                            <div className="social_box">
                                <p><span>Or</span> Register with</p>
                                <div>
                                    <Link to="#" className="d-inline-block me-2"><img src={googleLogo} alt="google-logo" /></Link>
                                    <Link to="#" className="d-inline-block me-2"><img src={fbLogo} alt="fb-logo" /></Link>
                                    <Link to="#" className="d-inline-block"><img src={instagramLogo} alt="instagram-logo" /></Link>
                                </div>
                                <p>Already a customer ? <Link to="#" className="view_more text-capitalize" data-bs-target="#buyerLoginModal">Login</Link></p>
                            </div>
                        </div>
                    </div>
                    <div className="img_wrapper">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <img src={buyerLogin} alt="buyer-login" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyerRegister;