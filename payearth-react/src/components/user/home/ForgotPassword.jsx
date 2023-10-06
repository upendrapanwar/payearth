import React from 'react';
import buyerLogin from './../../../assets/images/buyer-login.jpg';

const ForgotPassword = () => {
    return(
        <div className="modal fade" id="buyerForgotPwdModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="form_wrapper">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div>
                            <h4 className="h4">Forgot Password</h4>
                            <p>Please enter your registered email address</p>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email ID<small>*</small></label>
                                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" required="required" />
                                </div>
                                <button type="submit" className="btn custom_btn btn_yellow text-uppercase">Get Verification Link</button>
                            </form>
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

export default ForgotPassword;