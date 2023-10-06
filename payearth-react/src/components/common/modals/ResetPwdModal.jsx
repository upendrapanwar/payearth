import React, { Fragment, useState } from 'react';
import ReactDom from 'react-dom';
import { useHistory, useLocation } from 'react-router-dom';
import PeModal from './PeModal';
import changePwdSchema from './../../../validation-schemas/changePwdSchema';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import invisibleIcon from './../../../assets/icons/invisible-icon.svg';
import visibleIcon from './../../../assets/icons/eye-icon.svg';

const Modal = (props) => {
    toast.configure();
    const history = useHistory();
    const location = useLocation();
    const [seePassword, setSeePassword] = useState(false);
    const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: '',
            password_confirmation: ''
        },
        validationSchema: changePwdSchema,
        onSubmit: (values, { resetForm }) => {
            const currentUrl = location.search;
            var userId = null;
            var hash = null;

            if(/u=([^&]+)/.exec(currentUrl)[1] !== null) {
                userId = /u=([^&]+)/.exec(currentUrl)[1];
            }
            if(/hash=([^&]+)/.exec(currentUrl)[1] !== null) {
                hash = /hash=([^&]+)/.exec(currentUrl)[1];
            }

            values['id'] = userId;
            values['code'] = hash;

            axios.put('user/reset-password', values).then(response => {
                toast.dismiss();
                if (response.data.status) {
                    toast.success(response.data.message, {autoClose:3000});
                    resetForm();
                    props.onClick();
                    history.push('/');
                    props.showLoginModal();
                } else {
                    toast.error(response.data.message, {autoClose:3000});
                    props.onClick();
                    props.showForgotModal();
                }
            }).catch(error => {
                toast.dismiss();
                if (error.response) {
                    toast.error(error.response.data.message, {autoClose:3000});
                    props.onClick();
                    props.showForgotModal();
                }
            });
        }
    });

    const handlePassword = () => {
        if (seePassword) {
            setSeePassword(false);
        } else {
            setSeePassword(true);
        }
    }

    const handleConfirmPassword = () => {
        if (seeConfirmPassword) {
            setSeeConfirmPassword(false);
        } else {
            setSeeConfirmPassword(true);
        }
    }

    return(
        <Fragment>
        <PeModal onClose={props.onClick} onShow={props.onRestPwdShow}>
            <div className="form_wrapper">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <div>
                    <h4 className="h4">Change Password</h4>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="pwd_wrapper mb-3">
                            <label htmlFor="pwd" className="form-label">New Password <small className="text-danger">*</small></label>
                            {seePassword ?
                                 <input type="text" className="form-control" id="pwd" name="password"
                                     onChange={formik.handleChange}
                                     onBlur={formik.handleBlur}
                                     value={formik.values.password}
                                 /> :
                                <input type="password" className="form-control" id="pwd" name="password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                            }

                            {seePassword ?
                                <img src={visibleIcon} alt="eye-icon" onClick={handlePassword}/>:
                                <img src={invisibleIcon} alt="invisible-icon" onClick={handlePassword}/>
                            }

                            {formik.touched.password && formik.errors.password ? (
                                <small className="text-danger">{formik.errors.password}</small>
                            ) : null}
                        </div>
                        <div className="pwd_wrapper mb-3">
                            <label htmlFor="cornfirmPwd" className="form-label">Confirm New Password <small className="text-danger">*</small></label>
                            {seeConfirmPassword ?
                                <input type="text" className="form-control" id="cornfirmPwd" name="password_confirmation"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password_confirmation}
                                /> :
                                <input type="password" className="form-control" id="cornfirmPwd" name="password_confirmation"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password_confirmation}
                                />
                            }

                            {seeConfirmPassword ?
                                <img src={visibleIcon} alt="eye-icon" onClick={handleConfirmPassword}/>:
                                <img src={invisibleIcon} alt="invisible-icon" onClick={handleConfirmPassword}/>
                            }

                            {formik.touched.password_confirmation && formik.errors.password_confirmation ? (
                                <small className="text-danger">{formik.errors.password_confirmation}</small>
                            ) : null}
                        </div>
                        <button type="submit" className="btn custom_btn btn_yellow text-uppercase" disabled={!formik.isValid}>Save</button>
                    </form>
                </div>
            </div>
        </PeModal>
       </Fragment>
    )
};

function ResetPwdModal(props) {
    return(
        <Fragment>
            {ReactDom.createPortal(<Modal onClick={props.onResetPwdHide} onShow={props.onRestPwdShow} showLoginModal={props.onloginShow} showForgotModal={props.onForgotShow}/>, document.getElementById('overlays'))}
        </Fragment>
    )
}
export default ResetPwdModal;