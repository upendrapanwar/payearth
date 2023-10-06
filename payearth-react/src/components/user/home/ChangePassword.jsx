import React from 'react';
import buyerLogin from './../../assets/images/buyer-login.jpg';

const ChangePassword = () => {
    return(
        <div className="modal fade" id="buyerChangePwdModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="form_wrapper">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div>
                            <h4 className="h4">Change Password</h4>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="pwd" className="form-label">New Password<small>*</small></label>
                                    <input type="password" className="form-control" id="pwd" aria-describedby="pwdHelp" required="required" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="cornfirmPwd" className="form-label">Confirm Password<small>*</small></label>
                                    <input type="password" className="form-control" id="cornfirmPwd" aria-describedby="confirmPwdHelp" required="required" />
                                </div>
                                <button type="submit" className="btn custom_btn btn_yellow text-uppercase">Save</button>
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

export default ChangePassword;